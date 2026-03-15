# Callback Implementation

This document describes the implementation of callback support in GIRest, including reentrancy support and thread affinity mechanisms.

## Overview

GIRest handles callbacks from native GStreamer/GObject code by using callback URLs. The client provides a callback URL when registering the callback, and GIRest makes HTTP POST requests to this URL when callbacks are triggered.

This approach supports **reentrancy** (calling REST APIs from within callbacks) and **thread affinity** (ensuring reentrant calls execute on the correct native thread).

## Callback Mechanism

**How it works:**
1. Client starts a callback server (e.g., HTTP server listening on a port)
2. Client registers callback with REST API, providing callback URL in request body
3. GIRest server makes HTTP POST requests to the callback URL when events occur
4. Client server handles POST requests and executes callback function

**Advantages:**
- Server-to-server communication
- No persistent connection required
- Flexible routing and authentication
- Supports all callback scopes (sync and async)

**Requirements:**
- Client must run an HTTP server to receive callbacks
- Client provides callback URL when registering callbacks

**Example (Python test):**
```python
# Start callback server
callback_server = await start_callback_server()

# Register callback with URL
payload = {
    "func": {
        "url": f"http://localhost:{callback_server.port}/callback/0"
    }
}
response = await client.post("/Gst/debug_add_log_function", json=payload)

# Server will POST to the callback URL when events occur
```

**How it works:**
1. Client starts a callback server (e.g., aiohttp server listening on a port)
2. Client registers callback with REST API, providing callback URL in request body
3. GIRest server makes HTTP POST requests to the callback URL when events occur
4. Client server handles POST requests and executes callback function

**Advantages:**
- Server-to-server communication
- No persistent connection required
- Flexible routing and authentication
- Supports all callback scopes (sync and async)

**Requirements:**
- Client must run an HTTP server to receive callbacks
- Client provides callback URL when registering callbacks

**Example (Python test):**
```python
# Start callback server
callback_server = await start_callback_server()

# Register callback with URL
payload = {
    "func": {
        "url": f"http://localhost:{callback_server.port}/callback/0"
    }
}
response = await client.post("/Gst/debug_add_log_function", json=payload)

# Server will POST to the callback URL when events occur
```

## Reentrancy Support

**What is reentrancy?**
When a callback function makes additional REST API calls back to the GIRest server, this is called a "reentrant call". For example:
- A callback iterating over elements might call `element.get_name()` for each element
- A callback on bin elements might call `element.foreach_pad()` which triggers nested callbacks

**Why reentrancy is challenging:**
In native C code, callbacks execute on the same thread that triggered them (e.g., the GStreamer main loop thread). If a callback calls back into GStreamer APIs, those calls naturally run on the correct thread. In the REST API model, callbacks are dispatched to external clients, and reentrant REST calls could come from different threads, breaking thread-safety assumptions.

**How GIRest handles reentrancy:**
GIRest provides a **thread affinity** mechanism using correlation IDs to ensure reentrant calls execute on the same native thread as the callback:

1. When a callback is triggered, GIRest assigns it a unique `correlation_id` (same as `callback_id`)
2. The correlation ID is sent to the client along with callback data
3. Client includes `X-Correlation-Id` header in reentrant REST API calls
4. GIRest routes these calls to execute on the same native thread as the original callback

This ensures thread safety and maintains the same execution semantics as native C code.

## Thread Affinity Architecture

### Overview

Thread affinity ensures that reentrant API calls execute on the same native thread that triggered the callback. This is critical for thread-safety in GStreamer and GObject code.

### Components

**1. Correlation ID Assignment (girest.js - Frida)**
```javascript
// When callback is triggered, assign correlation_id
const correlation_id = cb_id;
send({
  "kind": "callback",
  "data": {
    "id": cb_id,
    "correlation_id": correlation_id,
    "data": callback_params
  }
});
```

**2. Client-Side Header Injection**
The client must include the `X-Correlation-Id` header in reentrant API calls:

```python
# Callback handler
async def callback_handler(request):
    data = await request.json()
    correlation_id = data.get('correlation_id')
    
    # Make reentrant call with correlation ID
    headers = {'X-Correlation-Id': str(correlation_id)}
    response = await client.get(f"/GstElement/{element_id}/get_name", headers=headers)
    
    return web.Response(text="OK")
```

**3. Server-Side Routing (girest/resolvers.py)**

The `execute()` method checks for the correlation ID header and routes the call accordingly:

```python
async def execute(self, operation_id: str, params: dict) -> dict:
    correlation_id = get_active_correlation_id()
    
    if correlation_id is not None:
        # This is a reentrant call from a callback
        # Execute on the same thread as the callback
        return await self._execute_queued(operation_id, params, correlation_id)
    else:
        # Normal call - execute directly
        return await self._execute_direct(operation_id, params)
```

**4. Queued Execution (girest.js - Frida)**

When a reentrant call is received, it's queued on the callback thread:

```javascript
// Message type specific to this callback
recv(`callback-${callback_id}`, function(message) {
    if (message.kind === "queued-call") {
        // Execute on callback thread
        const result = execute_rpc(message.operation_id, message.params);
        send({
            "kind": "callback-response",
            "request_id": message.request_id,
            "result": result
        });
    }
});
```

The key mechanism is `recv(message_type)` with a callback-specific message type. Frida's `recv()` returns control to the caller's thread after receiving a message, ensuring execution on the correct thread.

**5. Thread-Local Storage (conftest.py)**

Correlation IDs are stored in thread-local storage to track which thread is handling which callback:

```python
# Global thread-local storage
_girest_correlation_id = {}

def set_active_correlation_id(correlation_id: Optional[int]):
    thread_id = threading.get_ident()
    if correlation_id is None:
        _girest_correlation_id.pop(thread_id, None)
    else:
        _girest_correlation_id[thread_id] = correlation_id

def get_active_correlation_id() -> Optional[int]:
    thread_id = threading.get_ident()
    return _girest_correlation_id.get(thread_id)
```

**Critical Implementation Detail: asyncio.to_thread**

When using `asyncio.to_thread()` to run callback handlers in a thread pool, the correlation ID must be set **inside** the thread pool thread, not before calling `asyncio.to_thread()`:

```python
# WRONG - correlation_id not visible in thread pool thread
set_active_correlation_id(correlation_id)
response_value = await asyncio.to_thread(handler, data)

# CORRECT - set correlation_id inside thread pool thread
def handler_with_correlation_id():
    try:
        set_active_correlation_id(correlation_id)
        return handler(data)
    finally:
        set_active_correlation_id(None)

response_value = await asyncio.to_thread(handler_with_correlation_id)
```

### Execution Flow Example

**Nested Callback with Reentrant Calls:**

```
1. Client calls: bin.iterate_elements(callback_func)
   └─> Frida: Creates callback_id=0, correlation_id=0
   └─> Posts message with type="callback-0"

2. Callback executes on Thread 1638567
   └─> Client receives: {id: 0, correlation_id: 0, data: {element: ptr}}
   └─> Sets thread-local correlation_id=0
   └─> Client calls: element.get_name() with X-Correlation-Id: 0
       └─> Server routes to _execute_queued(correlation_id=0)
       └─> Posts message with type="callback-0" (same thread!)
       └─> Executes on Thread 1638567 ✓

3. Client calls nested: element.foreach_pad(pad_callback)
   └─> Frida: Creates callback_id=1, correlation_id=1
   └─> Posts message with type="callback-1"

4. Pad callback executes on Thread 1638567
   └─> Client receives: {id: 1, correlation_id: 1, data: {pad: ptr}}
   └─> Sets thread-local correlation_id=1
   └─> Client calls: pad.get_name() with X-Correlation-Id: 1
       └─> Server routes to _execute_queued(correlation_id=1)
       └─> Posts message with type="callback-1" (same thread!)
       └─> Executes on Thread 1638567 ✓
```

All calls execute on the same native thread (1638567), maintaining thread safety.

### Server Log Example

```
INFO: Executing queued call on thread: 1638567, correlation_id=0
INFO: Executing queued call on thread: 1638567, correlation_id=0
INFO: Executing queued call on thread: 1638567, correlation_id=1
INFO: Executing queued call on thread: 1638567, correlation_id=1
INFO: Executing queued call on thread: 1638567, correlation_id=2
INFO: Executing queued call on thread: 1638567, correlation_id=2
```

All reentrant calls execute as "queued calls" on the same thread, regardless of nesting depth.

## TypeScript Client Usage

The TypeScript bindings include automatic callback support. When you call a function that takes a callback parameter (like `Gst.debug_add_log_function`), the generated code will:

1. Make the REST API call to register the callback
2. Register your callback function with the callback handler
3. Provide the callback URL to the server
4. Server POSTs to the callback URL when events occur
5. Callback handler dispatches to your callback function

Example usage:

```typescript
import { Gst, setCallbackHandler } from './gst';
import { MyCallbackHandler } from './my-handler';

// Set up callback handler
setCallbackHandler(new MyCallbackHandler());

// Define your callback function with proper types
function onLog(category, level, file, func, line, obj, message) {
  console.log(`${file}:${line} ${func}() - ${message}`);
}

// Register the callback - it will be automatically dispatched
await Gst.debug_add_log_function('session-123', 'my-secret', onLog);
```

## Architecture

### 1. OpenAPI Schema Generation (girest/main.py)

**Callback Schemas**: Added `_generate_callback()` method that generates OpenAPI schemas for callback types with:
- `x-gi-type: callback` to identify callback types
- `x-gi-callback-params` array containing parameter information with transfer modes
- `x-gi-callback-return` for the callback's return type

**Function Metadata**: Modified `_generate_function()` to:
- Track callbacks in function parameters
- Add `x-gi-callbacks` field to operations that use callbacks
- Reference callback type schemas via `#/components/schemas/{CallbackName}`
- Automatically skip user_data and destroy_notify parameters (via closure/destroy indices)

### 2. TypeScript Generator (girest/generator.py)

**Callback Type Signatures**: Added `_get_callback_type_signature()` to generate TypeScript function signatures from callback schemas:
```typescript
// Example: GstLogFunction callback signature
(category: GstDebugCategory, level: GstDebugLevel, file: string, 
 function_: string, line: number, object: GObjectObject, 
 message: GstDebugMessage) => void
```

**Method Generation**: Modified `_prepare_method_data()` to:
- Detect callback parameters in operations
- Add callback functions to method signatures
- Track callback information for template rendering

**Reserved Keyword Handling**: Parameters named with JavaScript reserved keywords (e.g., `function`, `type`) are renamed by appending underscore (e.g., `function_`, `type_`). The original name is preserved for API calls.

**Standalone Functions**: Added support for functions without tags (namespace-level functions):
- Collected in `standalone_functions` list
- Generated in an `export namespace` block
- Functions use `export async function` (not `static`)

### 3. TypeScript Templates

**Main Template (main.ts.j2)**: Added callback dispatcher initialization:
```typescript
const callbackDispatcher = new Map<string, Function>();

const callbackSource = new EventSource('{base_url}/GIRest/callbacks');
callbackSource.onmessage = (ev) => {
  const json = JSON.parse(ev.data);
  const cb = callbackDispatcher.get(json.id.toString());
  if (cb) {
    cb(...Object.values(json.data));
  }
};
```

**Method Template (method.ts.j2)**: Methods with callbacks:
1. Make the REST API call
2. Receive callback ID in response
3. Register the callback function in the dispatcher map:
```typescript
if (data.func !== undefined) {
  callbackDispatcher.set(data.func.toString(), func);
}
```

## Usage Example

### Generated TypeScript
```typescript
// From: Gst.debug_add_log_function()
export async function debug_add_log_function(
  func: (
    category: GstDebugCategory,
    level: GstDebugLevel,
    file: string,
    function_: string,  // Original parameter name 'function' is a reserved keyword
    line: number,
    object: GObjectObject,
    message: GstDebugMessage
  ) => void
): Promise<{ func?: number }> {
  const url = new URL('/Gst/debug_add_log_function', 'http://localhost:8000');
  const response = await fetch(url.toString());
  const data = await response.json();
  
  // Register callback automatically
  if (data.func !== undefined) {
    callbackDispatcher.set(data.func.toString(), func);
  }
  
  return data;
}
```

### Client Code
```typescript
import { Gst } from './gst';

// Define callback function
function onLog(category, level, file, func, line, obj, message) {
  console.log(`${file}:${line} ${func}() - ${message}`);
}

// Register callback - automatically dispatched when events arrive
await Gst.debug_add_log_function(onLog);
```

### Comparison with Manual Approach

**Before (girest/examples/log.js)**:
```javascript
const cbsDispatcher = new Map();

// Manually create EventSource
const cbsSource = new EventSource("http://localhost:8000/GIRest/callbacks");
cbsSource.onmessage = (ev) => {
  const json = JSON.parse(ev.data);
  var cb = cbsDispatcher.get(json.id.toString());
  if (cb) cb(...Object.values(json.data));
};

// Manually register callback
const response = await fetch("http://localhost:8000/Gst/debug_add_log_function");
const json = await response.json();
cbsDispatcher.set(json.func.toString(), on_log);
```

**After (with generated bindings)**:
```typescript
await Gst.debug_add_log_function(onLog);  // That's it!
```

## Known Limitations

### TypeScript Compilation
The generated TypeScript may show warnings when compiled with strict settings:
1. **FinalizationRegistry**: Requires ES2021+ target
2. **Namespace as Type**: Enums with methods create both namespaces and types, which can cause type checking issues

To compile the generated TypeScript:
```bash
tsc --target es2021 --lib es2021,dom --module esnext --skipLibCheck gst.ts
```

Or add to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2021",
    "lib": ["es2021", "dom"],
    "module": "esnext",
    "skipLibCheck": true
  }
}
```

These warnings don't affect functionality - the generated JavaScript works correctly at runtime.

### GObject Reference Counting
The current implementation does not handle GObject reference counting for callback parameters. According to the issue requirements:

> If the type of any parameter is a GObject inherited type, on finalizing it the refcounting will be decreased. If the transfer is none, we will destroy the object earlier so we need to increase the ref counting first.

This should be handled in the Frida script (gstaudit.js) when invoking callbacks, based on the transfer mode:

**Transfer Mode: "none"**
- The callee (callback) does not take ownership
- The object may be destroyed after the callback returns
- Solution: Call `g_object_ref` before passing to callback, then `g_object_unref` after callback completes
- This keeps the object alive during callback execution

**Transfer Mode: "full"**
- The callee (callback) takes full ownership
- The callback is responsible for unreferencing the object
- No additional ref counting needed from the dispatcher

**Transfer Mode: "container"**
- The callee takes ownership of the container but not the contents
- For callbacks, this is rare and would need case-by-case handling

Implementation example for gstaudit.js:
```javascript
// In the NativeCallback handler
for (var cb_a of cb_def) {
  var arg_value = args[cb_idx];
  
  // Check if this is a GObject type with transfer "none"
  if (cb_a["is_gobject"] && cb_a["transfer"] === "none") {
    // Increase ref count to keep object alive
    var g_object_ref = new NativeFunction(
      Module.findExportByName(null, 'g_object_ref'),
      'pointer', ['pointer']
    );
    g_object_ref(arg_value);
  }
  
  data[cb_a["name"]] = arg_value;
  cb_idx++;
}

// Send callback data to client
send({ "kind": "callback", "data": {"id": cb_id, "data": data} });

// After callback completes, unref GObject parameters with transfer "none"
for (var cb_a of cb_def) {
  if (cb_a["is_gobject"] && cb_a["transfer"] === "none") {
    var g_object_unref = new NativeFunction(
      Module.findExportByName(null, 'g_object_unref'),
      'void', ['pointer']
    );
    g_object_unref(data[cb_a["name"]]);
  }
}
```

This is a server-side concern and doesn't affect the TypeScript bindings implementation.

## Testing

Run e2e tests with callback servers:
```bash
cd girest
poetry run pytest tests/e2e/test_e2e_thread_affinity.py -v
```

Tests verify:
- Callback URL registration
- Reentrant API calls with correlation IDs
- Thread affinity (all calls on same native thread)
- Nested callbacks with proper correlation ID tracking

### Thread Affinity Validation
Enable debug logging to verify thread affinity:
```python
# In girest/resolvers.py
logger.info(f"Executing queued call on thread: {threading.get_ident()}, correlation_id={correlation_id}")
```

All reentrant calls for a given callback should show the same thread ID in logs.

## Future Improvements

1. **GObject Refcounting**: Implement in girest.js Frida script
2. **Type Safety**: Improve enum namespace handling to avoid TypeScript warnings
3. **Error Handling**: Add error handling for callback registration failures
4. **Callback Cleanup**: Allow unregistering callbacks
5. **Multiple Callbacks**: Support registering multiple callbacks for the same event
6. **Correlation ID Timeout**: Add timeout for correlation ID cleanup when callbacks don't complete

## Key Takeaways

### Callback Mechanism
- Server-to-server communication via HTTP POST
- Requires callback HTTP server on client side
- Supports all callback scopes and patterns

### Reentrancy is Fully Supported
- Callbacks can make REST API calls back to GIRest
- Use `X-Correlation-Id` header to maintain thread affinity
- No restrictions on nesting depth or number of reentrant calls

### Thread Affinity Guarantees Safety
- Correlation IDs ensure reentrant calls execute on correct thread
- Uses Frida's `recv(message_type)` for per-callback message routing
- Thread-local storage tracks active correlation IDs
- Critical: Set correlation ID inside `asyncio.to_thread()` worker thread

### Architecture is Transparent
- Native C semantics preserved: callbacks execute on same thread
- REST API feels like native code from the callback's perspective
- GIRest handles all the complexity of thread routing
