# TypeScript Callback Implementation

This document describes the implementation of TypeScript callback support for GIRest-generated REST API bindings.

## Overview

The implementation allows TypeScript/JavaScript clients to register callback functions that are automatically dispatched when events are received from the server via Server-Sent Events (SSE).

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
(category: GstDebugCategory, level: GstDebugLevel, ...) => void
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

const callbackSource = new EventSource('{base_url}/Application/callbacks');
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
    function_: string,  // Renamed from 'function' (reserved keyword)
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

**Before (examples/log.js)**:
```javascript
const cbsDispatcher = new Map();

// Manually create EventSource
const cbsSource = new EventSource("http://localhost:8000/Application/callbacks");
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
1. **FinalizationRegistry**: Requires ES2021+ target (`--lib es2021,dom`)
2. **Namespace as Type**: Enums with methods create both namespaces and types, which can cause type checking issues

These warnings don't affect functionality - the generated JavaScript works correctly at runtime.

### GObject Reference Counting
The current implementation does not handle GObject reference counting for callback parameters. According to the issue requirements:

> If the type of any parameter is a GObject inherited type, on finalizing it the refcounting will be decreased. If the transfer is none, we will destroy the object earlier so we need to increase the ref counting first.

This should be handled in the Frida script (gstaudit.js) when invoking callbacks:
1. Check if callback parameter is a GObject type
2. Check transfer mode from callback schema
3. If transfer is "none", call `g_object_ref` before passing to callback
4. After callback completes, call `g_object_unref`

This is a server-side concern and doesn't affect the TypeScript bindings implementation.

## Testing

Run the TypeScript generator:
```bash
cd girest
python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
```

Check the generated callback:
```bash
grep -A 10 "debug_add_log_function" gst.ts
```

Expected output shows:
- Callback function parameter with proper TypeScript signature
- Automatic callback registration after API call
- Reserved keywords renamed (`function` -> `function_`)

## Files Changed

1. **girest/girest/main.py**: Added callback schema generation
2. **girest/girest/generator.py**: Added callback type generation and reserved keyword handling
3. **girest/girest/templates/main.ts.j2**: Added callback dispatcher
4. **girest/girest/templates/method.ts.j2**: Added callback registration
5. **examples/log.ts**: TypeScript example demonstrating callback usage
6. **README.md**: Updated with callback support documentation
7. **girest/README-client-generator.md**: Added detailed callback examples

## Future Improvements

1. **GObject Refcounting**: Implement in gstaudit.js Frida script
2. **Type Safety**: Improve enum namespace handling to avoid TypeScript warnings
3. **Error Handling**: Add error handling for callback registration failures
4. **Callback Cleanup**: Allow unregistering callbacks and closing EventSource connection
5. **Multiple Callbacks**: Support registering multiple callbacks for the same event
