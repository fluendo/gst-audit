# GIRest - REST API for GObject Introspection

GIRest is a comprehensive framework that exposes GObject-based APIs as REST APIs. It consists of three main components:

1. **OpenAPI Schema Generator**: Converts GObject Introspection (GI) metadata into OpenAPI 3.0 specifications
2. **GIRest Server**: A Frida-based runtime that exposes live GObject APIs via HTTP
3. **TypeScript Client Generator**: Generates type-safe TypeScript bindings from OpenAPI schemas

This allows you to interact with running GObject-based applications (like GStreamer pipelines) through REST APIs with full type safety and IDE support.

---

## Table of Contents

- [Quick Start](#quick-start)
- [OpenAPI Schema Generator](#openapi-schema-generator)
- [GIRest Server (Frida Runtime)](#girest-server-frida-runtime)
- [TypeScript Client Generator](#typescript-client-generator)
- [Installation](#installation)
- [Design Decisions](#design-decisions)

---

## Quick Start

```bash
# 1. Install dependencies
cd girest
poetry install

# 2. Start your GObject-based application (e.g., GStreamer pipeline)
gst-launch-1.0 videotestsrc ! fakesink

# 3. Attach GIRest to the running process
python3 girest-frida.py --pid [PID] Gst 1.0

# 4. Generate TypeScript bindings
python3 girest-client-generator.py Gst 1.0 --host localhost --port 9000 -o gst.ts

# 5. Use the REST API or TypeScript bindings
# REST API: http://localhost:9000/ui (Swagger UI)
# TypeScript: import { Gst } from './gst'
```

---

## OpenAPI Schema Generator

The schema generator (`girest/girest/main.py`) converts GObject Introspection metadata into OpenAPI 3.0 specifications. It uses `GIRepository` to read introspection data and generates comprehensive REST API schemas.

### Usage

```bash
# Generate OpenAPI schema in JSON format
python3 girest-dump-schema.py Gst 1.0 -o gst-schema.json

# Options:
#   --sse-only    SSE-style callbacks (EventSource-based)
#   (default)     URL-based callbacks (HTTP POST)
```

### GI Features and OpenAPI Mapping

#### Object Types and Inheritance

**GI Feature**: GObject classes with inheritance hierarchies

**OpenAPI Mapping**:
- Classes mapped to schemas with `x-gi-type: "object"`
- Inheritance represented using `allOf` with `$ref` to parent schema
- Methods organized by tags matching class names

```json
{
  "GstElement": {
    "type": "object",
    "x-gi-type": "object",
    "allOf": [{ "$ref": "#/components/schemas/GstObject" }]
  }
}
```

#### Structs and Records

**GI Feature**: C structs (e.g., `GValue`, `GstCaps`)

**OpenAPI Mapping**:
- Mapped to schemas with `x-gi-type: "struct"`
- Copy/free methods auto-generated if missing
- Memory management through `copy` and `free` endpoints

#### Enums and Flags

**GI Feature**: Enumeration types and bitfield flags

**OpenAPI Mapping**:
- Enums as string enums with `x-gi-type: "enum"`
- Flags as string enums with `x-gi-type: "flags"`
- Validates parameter values at API level

```json
{
  "GstState": {
    "type": "string",
    "enum": ["void-pending", "null", "ready", "paused", "playing"],
    "x-gi-type": "enum"
  }
}
```

#### Return Values and Output Parameters

**GI Feature**: Functions can return values and have output parameters

**OpenAPI Mapping**:
- Return value: `properties.return` with `x-gi-is-return: true`
- Out parameters: Additional properties in response object
- Multiple return values wrapped in object

**Example**:
```javascript
// GI: gboolean gst_element_query_position(GstElement *element, GstFormat format, gint64 *cur)
// Returns: { return: true, cur: 1234567890 }
```

#### Callbacks - Dual Mode Support

**GI Feature**: Function pointers with scope (call, async, notified, forever)

GIRest supports two callback modes:

##### SSE Mode (Server-Sent Events) - `--sse-only`

**When to use**: Browser clients, simple integration, persistent connections

**OpenAPI Mapping**:
- Callbacks return integer IDs in response
- Single `/GIRest/callbacks` endpoint (text/event-stream)
- Events dispatched with `{ id: callbackId, data: {...} }`

**Features**:
- ✅ Synchronous callbacks (scope: call) - **Excluded** in SSE-only mode
- ✅ Asynchronous callbacks (scope: async, notified, forever)
- ✅ Automatic reconnection
- ✅ Built-in EventSource support

**Schema Example**:
```json
{
  "responses": {
    "200": {
      "content": {
        "application/json": {
          "schema": {
            "properties": {
              "func": {
                "type": "integer",
                "description": "Callback ID",
                "x-gi-callback": "#/components/schemas/GstLogFunction"
              }
            }
          }
        }
      }
    }
  }
}
```

##### URL-Based Callbacks Mode (Default)

**When to use**: Server-to-server, custom callback handling, all callback types

**OpenAPI Mapping**:
- Callback URL parameters: `{name}_url` (e.g., `func_url`)
- Required headers: `session-id`, `callback-secret`
- OpenAPI callbacks specification for POST webhooks
- HMAC signature verification

**Features**:
- ✅ All callback scopes supported (sync and async)
- ✅ No persistent connection required
- ✅ Flexible routing and authentication
- ✅ Custom callback infrastructure integration

**Schema Example**:
```json
{
  "parameters": [
    {
      "name": "func_url",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "format": "uri"
      },
      "x-gi-callback": "#/components/schemas/GstLogFunction",
      "x-gi-callback-style": "async"
    }
  ],
  "callbacks": {
    "LogFunction": {
      "{$request.query.func_url}": {
        "post": {
          "requestBody": {
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/GstLogFunction" }
              }
            }
          }
        }
      }
    }
  }
}
```

**Callback Payload** (URL mode):
```json
{
  "sessionId": "client-session-123",
  "callbackName": "func",
  "args": [category, level, file, function, line, object, message],
  "invocationNumber": 0,
  "timestamp": "2025-12-10T10:30:00Z",
  "isComplete": false
}
```

##### Callback Scope Handling

| GI Scope | Description | SSE Mode | URL Mode |
|----------|-------------|----------|----------|
| `CALL` | Synchronous, called during function execution | ❌ Excluded | ✅ Supported |
| `ASYNC` | Fire-and-forget, no guarantee of invocation | ✅ Supported | ✅ Supported |
| `NOTIFIED` | Called multiple times until destroyed | ✅ Supported | ✅ Supported |
| `FOREVER` | Never destroyed, called indefinitely | ✅ Supported | ✅ Supported |

#### Pointer Types

**GI Feature**: Memory addresses as pointers

**OpenAPI Mapping**:
- Schema type: `string` with pattern `^0x[0-9a-fA-F]+$|^[0-9]+$`
- Accept both hex (`0x12345678`) and decimal (`305419896`) formats
- Used in paths: `/Gst/Element/ptr,{ptr}/set_state`

#### Transfer Modes

**GI Feature**: Ownership transfer (none, container, full)

**OpenAPI Mapping**:
- Marked with `x-gi-transfer` extension
- Affects reference counting in Frida resolver
- TypeScript bindings handle ref/unref automatically

#### Constructors and Destructors

**GI Feature**: Factory methods and cleanup functions

**OpenAPI Mapping**:
- Constructors: `x-gi-constructor: true`, return object instances
- Destructors: `x-gi-destructor: true`, cleanup resources
- Copy methods: `x-gi-copy: true` for structs

**Example**:
```javascript
// Constructor: POST /Gst/ElementFactory/make?factoryname=identity
// Returns: { return: { ptr: "0x12345678" } }

// Use: GET /Gst/Element/ptr,0x12345678/set_state?state=playing

// Destructor: DELETE /Gst/Element/ptr,0x12345678/unref
```

#### Container Types

**GI Feature**: Lists (GList, GSList), arrays

**OpenAPI Mapping**:
- Array type with `x-gi-element-type` for elements
- Automatic serialization/deserialization in Frida

#### Nullable Types

**GI Feature**: Optional parameters with `nullable` annotation

**OpenAPI Mapping**:
- Marked with `x-gi-null: true`
- TypeScript generates `Type | null` unions

### Schema Vendor Extensions

Custom extensions used throughout the schema:

| Extension | Purpose | Example |
|-----------|---------|---------|
| `x-gi-type` | GI type category | `"object"`, `"struct"`, `"enum"`, `"callback"` |
| `x-gi-namespace` | GI namespace | `"Gst"` |
| `x-gi-name` | Original GI name | `"Element"` |
| `x-gi-transfer` | Ownership transfer | `"none"`, `"full"`, `"container"` |
| `x-gi-is-return` | Mark return value | `true` |
| `x-gi-null` | Nullable type | `true` |
| `x-gi-callback` | Callback schema ref | `"#/components/schemas/GstLogFunction"` |
| `x-gi-callback-style` | Callback type | `"sync"`, `"async"` |
| `x-girest-callback-mode` | API mode | `"sse"`, `"url"` |

---

## GIRest Server (Frida Runtime)

The GIRest server (`girest-frida.py`) uses [Frida](https://frida.re) to inject into a running process and expose its GObject APIs via HTTP.

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Target Process (e.g., gst-launch-1.0)                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Frida Agent (girest.js)                           │  │
│  │                                                    │  │
│  │  • Intercepts GObject function calls               │  │
│  │  • Manages native callbacks                        │  │
│  │  • Serializes/deserializes parameters              │  │
│  │  • Handles memory management                       │  │
│  └────────────────────────────────────────────────────┘  │
│                          ▲                               │
│                          │ Native calls                  │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Native GObject Libraries                          │  │
│  │  (libgstreamer, libgobject, etc.)                  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ▲
                          │ Frida RPC
                          ▼
┌──────────────────────────────────────────────────────────┐
│  Python Server (girest-frida.py)                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Connexion/Flask HTTP Server                       │  │
│  │  • REST endpoints (OpenAPI-defined)                │  │
│  │  • Swagger UI at /ui                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  GIResolver (girest/resolvers.py)                  │  │
│  │  • Maps HTTP requests to Frida RPC calls           │  │
│  │  • Handles callbacks (SSE or URL-based)            │  │
│  │  • Manages callback lifecycle                      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### How It Works

1. **Attachment**: Frida attaches to target process via PID or process name
2. **Injection**: JavaScript agent (`girest.js`) injected into process
3. **Resolution**: HTTP requests mapped to Frida RPC calls
4. **Execution**: Agent calls native GObject functions via `NativeFunction`
5. **Response**: Results serialized and returned as JSON

### Frida Agent Features

The JavaScript agent (`girest/girest.js`) handles:

- **Function Calls**: Dynamic invocation via `NativeFunction`
- **Type Conversion**: Marshaling between JSON and native types
- **Memory Management**: Pointer allocation and cleanup
- **Callbacks**: Native callback registration and invocation
- **Reference Counting**: GObject ref/unref handling

### Callback Handling in Frida

#### SSE Mode

```javascript
// Create native callback
const cb_id = callbacks.size;
const cb = new NativeCallback((...args) => {
  // Serialize arguments
  const data = {};
  for (var cb_a of cb_def) {
    data[cb_a.name] = args[idx++];
  }
  
  // Send via SSE
  send({
    kind: "callback",
    data: { id: cb_id, data: data }
  });
}, "void", cb_sig);

callbacks.set(cb_id.toString(), cb);
return cb_id; // Return to client
```

#### URL Mode

```javascript
// Create native callback that POSTs to client URL
const cb = new NativeCallback((...args) => {
  // Serialize arguments
  const payload = {
    sessionId: session_id,
    callbackName: callback_name,
    args: serialize_args(args),
    invocationNumber: counter++,
    timestamp: new Date().toISOString()
  };
  
  // Sign with HMAC
  const signature = hmac_sha256(JSON.stringify(payload), secret);
  
  // POST to client's callback URL
  fetch(callback_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Callback-Signature': signature,
      'X-Callback-Timestamp': payload.timestamp
    },
    body: JSON.stringify(payload)
  });
}, return_type, cb_sig);
```

### Usage

```bash
# Attach by PID
python3 girest-frida.py --pid 12345 Gst 1.0

# Attach by name
python3 girest-frida.py --name gst-launch-1.0 Gst 1.0

# Custom port
python3 girest-frida.py --pid 12345 --port 8080 Gst 1.0

# SSE-only mode
python3 girest-frida.py --pid 12345 --sse-only Gst 1.0

# Access Swagger UI
# http://localhost:9000/ui
```

### Special Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/GIRest/callbacks` | SSE endpoint for callback events (SSE mode only) |
| `/ui` | Swagger UI for API exploration |

> **Note**: The `/GIRest/pipelines` endpoint is part of gstaudit-server, not the base GIRest framework.

---

## TypeScript Client Generator

The client generator (`girest-client-generator.py`) creates type-safe TypeScript bindings from OpenAPI schemas.

### Usage

```bash
# Generate TypeScript bindings
python3 girest-client-generator.py Gst 1.0 \
  --host localhost \
  --port 9000 \
  --output gst.ts

# With base path
python3 girest-client-generator.py Gst 1.0 \
  --base-path /api/v1 \
  --output gst.ts

# SSE mode
python3 girest-client-generator.py Gst 1.0 \
  --sse-only \
  --output gst-sse.ts
```

### Generated Code Structure

```typescript
// Configuration
const apiConfig = { host, port, basePath, ... };
export function setApiConfig(config) { ... }

// SSE mode: EventSource for callbacks
const callbackDispatcher = new Map<string, Function>();
const callbackSource = new EventSource('/GIRest/callbacks');

// OR

// URL mode: Callback handler interface
export interface ICallbackHandler {
  registerCallback(func, metadata): { callbackUrl, callbackId };
  unregisterCallback(callbackId): void;
}
export function setCallbackHandler(handler: ICallbackHandler): void;

// Generated classes and methods
export class GstElement {
  async set_state(state: GstState): Promise<GstStateChangeReturn> { ... }
  async query_position(format: GstFormat): Promise<{ return: boolean, cur: number }> { ... }
}

export namespace Gst {
  export function init(argv?: string[]): Promise<void> { ... }
  export function version(): Promise<{ major: number, minor: number, micro: number, nano: number }> { ... }
}
```

### Key Features

#### Callbacks (SSE Mode - EventSource-based)

**Generated Code**:

```typescript
export async function debug_add_log_function(
  func: GstLogFunction
): Promise<void> {
  const url = new URL('/Gst/debug_add_log_function', apiConfig.baseUrl);
  const response = await fetch(url.toString());
  const data = await response.json();
  
  // Automatically register callback with dispatcher
  if (data.func !== undefined) {
    callbackDispatcher.set(data.func.toString(), {
      converter: convertGstLogFunctionArgs,
      userFunction: func
    });
  }
}

// EventSource automatically dispatches callbacks
callbackSource.onmessage = (ev) => {
  const json = JSON.parse(ev.data);
  const callbackEntry = callbackDispatcher.get(json.id.toString());
  if (callbackEntry) {
    const args = callbackEntry.converter(json.data);
    callbackEntry.userFunction(...args);
  }
};
```

**Usage**:

```typescript
import { Gst } from './gst';

// Define callback
function onLog(category, level, file, func, line, obj, message) {
  console.log(`${file}:${line} - ${message}`);
}

// Register - that's it!
await Gst.debug_add_log_function(onLog);
```

#### Callbacks (URL Mode - Webhook-based)

**Generated Code**:

```typescript
export async function debug_add_log_function(
  session_id: string,
  callback_secret: string,
  func: GstLogFunction
): Promise<void> {
  const handler = getCallbackHandler();
  if (!handler) {
    throw new Error('Callback handler not configured');
  }
  
  // Register callback and get URL
  const { callbackUrl, callbackId } = handler.registerCallback(func, {
    methodName: 'debug_add_log_function',
    paramName: 'func'
  });
  
  // Pass callback URL to server
  const url = new URL('/Gst/debug_add_log_function', apiConfig.baseUrl);
  url.searchParams.append('func_url', callbackUrl);
  
  const headers = {
    'session-id': session_id,
    'callback-secret': callback_secret
  };
  
  await fetch(url.toString(), { headers });
}
```

**Simple Implementation Example**:

```typescript
import { Gst, setCallbackHandler, ICallbackHandler } from './gst';

// Implement callback handler
class SimpleCallbackHandler implements ICallbackHandler {
  private callbacks = new Map<string, Function>();
  private counter = 0;

  registerCallback(func: Function, metadata): { callbackUrl: string, callbackId: string } {
    const id = `cb_${++this.counter}`;
    this.callbacks.set(id, func);
    return {
      callbackUrl: `http://localhost:8888/callback?id=${id}`,
      callbackId: id
    };
  }

  unregisterCallback(id: string): void {
    this.callbacks.delete(id);
  }

  getCallback(id: string): Function | undefined {
    return this.callbacks.get(id);
  }
}

// Set up handler
const handler = new SimpleCallbackHandler();
setCallbackHandler(handler);

// Your callback server
app.post('/callback', async (req, res) => {
  const { id } = req.query;
  const { args } = req.body;
  
  const callback = handler.getCallback(id);
  if (callback) {
    const result = await callback(...args);
    res.json({ return: result });
  }
});

// Use it
await Gst.debug_add_log_function(
  'session-123',
  'my-secret',
  (category, level, file, func, line, obj, msg) => {
    console.log(`${file}:${line} - ${msg}`);
  }
);
```

> **Note**: For integration with existing callback infrastructure (like gstaudit's WebSocket system), see [examples/INTEGRATION_GUIDE.md](examples/INTEGRATION_GUIDE.md).

#### Type Safety

```typescript
// Enums are type-safe
const state: GstState = 'playing'; // ✅
const state: GstState = 'invalid'; // ❌ TypeScript error

// Return types preserve nullability
const result: GstCaps | null = await element.get_caps();

// Multiple return values as objects
const { return: success, cur } = await element.query_position('time');
```

#### Memory Management

```typescript
// Objects auto-managed with FinalizationRegistry
const element = await Gst.ElementFactory.make('identity', 'test');
// element.ptr automatically unref'd when garbage collected

// Manual control
await element.ref();   // Increment reference
await element.unref(); // Decrement reference

// Structs
const caps = await Gst.Caps.new_empty();
const copy = await caps.copy(); // Explicit copy
await caps.free(); // Explicit cleanup
```

#### Path and Query Parameters

```typescript
// Instance methods use path parameters
await element.set_state('playing');
// → GET /Gst/Element/ptr,0x12345678/set_state?state=playing

// Static methods
const element = await Gst.ElementFactory.make('identity', 'test');
// → GET /Gst/ElementFactory/make?factoryname=identity&name=test
```

### Configuration

```typescript
// Change API server at runtime
setApiConfig({
  host: 'api.example.com',
  port: 443,
  basePath: '/gstreamer/v1'
});

// Get current config
const config = getApiConfig();
```

---

## Installation

### Dependencies

```bash
# Install Poetry (if not already installed)
curl -sSL https://install.python-poetry.org | python3 -

# Install project dependencies
cd girest
poetry install
```

### Required System Packages

```bash
# Ubuntu/Debian
sudo apt-get install python3-gi python3-gi-cairo gir1.2-gstreamer-1.0

# macOS (with Homebrew)
brew install pygobject3 gstreamer
```

---

## Design Decisions

### Why not PyGObject for introspection?

PyGObject is not used to read introspection information because it "hides" implementation details like `struct` free functions and `unref` methods. These are managed internally by PyGObject, making it impossible to generate proper bindings. We use `GIRepository` directly through PyGObject instead.

### Why not FastAPI?

FastAPI lacks proper inheritance support for object types in schemas. Additionally, adding schema metadata (required for automatic TypeScript bindings) is difficult - you can only add it to endpoints, not fields. Workarounds exist but require generating and extending Pydantic models, which is too burdensome. We use `apispec` directly to generate valid OpenAPI schemas.

### Why vendor extensions?

Using `x-girest-callback-mode` vendor extensions instead of pattern detection provides:
- **Explicit configuration**: Mode is declared in schema, not inferred
- **Better maintainability**: No fragile pattern matching logic
- **Clarity**: Consumers know the exact API mode from schema metadata

### Why ICallbackHandler interface?

The interface-based design allows:
- **Implementation agnostic**: Client generator doesn't depend on specific callback infrastructure
- **Flexible integration**: Works with WebSockets, HTTP servers, or any custom solution
- **Clean separation**: Framework provides interface, applications provide implementation

---

## References

* [OpenAPI Specification](https://swagger.io/specification/)
* [OpenAPI to TypeScript](https://heyapi.dev/openapi-ts/output)
* [GIRepository Docs](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
* [Frida Documentation](https://frida.re/docs/home/)
* [OpenAPI to FastAPI](https://github.com/ioxiocom/openapi-to-fastapi/)

