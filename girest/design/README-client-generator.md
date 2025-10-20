# girest-client-generator

TypeScript bindings generator for GIRest schemas.

## Overview

`girest-client-generator` is a command-line tool that generates TypeScript type definitions from GObject introspection data. It uses the GIRepository library to introspect GObject-based libraries and generates TypeScript interfaces and classes with proper inheritance and method signatures.

## Features

- **Automatic TypeScript generation**: Converts GObject introspection data to TypeScript
- **Inheritance support**: Properly handles `allOf` schemas and generates TypeScript interfaces with `extends`
- **Class methods**: Methods are organized by their tag (class name) and generated as class methods
- **Constructor support**: Constructor methods (marked with `IS_CONSTRUCTOR` flag) are generated as static factory methods
- **Automatic memory management**: When `--base-url` is provided, GObject-derived classes use FinalizationRegistry for automatic cleanup via `g_object_unref`
- **Manual cleanup**: All GObject-based classes have an `unref()` method for explicit cleanup
- **Transfer ownership handling**: Automatically manages reference counting for parameters with full transfer ownership
- **Callback support**: Functions with callback parameters automatically register callbacks and dispatch events via EventSource
- **Enum support**: Enumerations with methods are generated as namespaces with const values and static methods
- **REST API implementation**: When `--base-url` is provided, generates complete method implementations with fetch calls
- **Template-based generation**: Uses Jinja2 templates for cleaner and more maintainable code generation
- **Type safety**: All parameters and return types are properly typed

## Usage

### Basic Usage

Generate TypeScript client bindings for a namespace (requires --base-url):

```bash
python3 girest-client-generator.py <namespace> <version> --base-url <url>
```

### Examples

Generate TypeScript client bindings for GLib 2.0:

```bash
python3 girest-client-generator.py GLib 2.0 --base-url http://localhost:8000 > glib.ts
```

Generate TypeScript client bindings for GStreamer:

```bash
python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
```

### Command-line Options

```
usage: girest-client-generator.py [-h] [-o OUTPUT] --base-url BASE_URL namespace version

positional arguments:
  namespace             GObject namespace (e.g., 'Gst', 'GLib', 'Gtk')
  version               Namespace version (e.g., '1.0', '2.0')

options:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        Output file path (default: stdout)
  --base-url BASE_URL   Base URL for REST API calls (e.g., 'http://localhost:8000') [required]
```

### Dumping OpenAPI Schema

To dump the OpenAPI schema in JSON format, use the `girest-dump-schema` tool:

```bash
python3 girest-dump-schema.py GLib 2.0 -o glib-schema.json
```

See the main README for more information about the `girest-dump-schema` tool.

## Generated TypeScript

The tool generates TypeScript definitions with the following structure:

### Interfaces

For each schema in the OpenAPI specification, a TypeScript interface is generated:

```typescript
export interface GstDateTime {
  ptr: Pointer;
}
```

Interfaces with inheritance use `extends`:

```typescript
export interface GstElement extends GstObject {
}
```

### Classes (without --base-url)

For schemas that have associated methods (identified by tags in the OpenAPI operations), a class is generated with method signatures:

```typescript
export class GstElement {
  add_pad(pad: GstPad): Promise<boolean>;
  set_state(state: GstState): Promise<GstStateChangeReturn>;
  abort_state(): Promise<void>;
}
```

### Constructor Methods

Constructor methods (marked with the `IS_CONSTRUCTOR` flag in GObject Introspection) are generated as static factory methods:

```typescript
export class GstBus {
  static new(): Promise<GstBus>;
  
  add_signal_watch(): Promise<void>;
  // ... other methods
}

export class GstGhostPad {
  static new(name?: string, target: GstPad): Promise<GstGhostPad>;
  static new_from_template(name?: string, target: GstPad, templ: GstPadTemplate): Promise<GstGhostPad>;
  
  // ... other methods
}
```

Usage:
```typescript
// Create a new instance using the static factory method
const bus = await GstBus.new();
await bus.add_signal_watch();
```

### Classes (with --base-url)

When `--base-url` is provided, methods include complete implementations with REST API calls. Additionally, GObject-derived classes automatically extend `GObjectBase` which provides:

1. **Automatic cleanup** via FinalizationRegistry - objects are automatically unreferenced when garbage collected
2. **Manual cleanup** via the `unref()` method for explicit resource management

```typescript
// FinalizationRegistry for automatic cleanup of GObject instances
const objectRegistry = new FinalizationRegistry((ptr: string) => {
  fetch('http://localhost:8000/GObject/Object/' + ptr + '/unref')
    .catch(err => console.error('Failed to unref object:', ptr, err));
});

// Base class for all GObject-based classes
class GObjectBase {
  ptr!: string;
  
  constructor(ptr?: string) {
    if (ptr) {
      this.ptr = ptr;
      objectRegistry.register(this, ptr);
    }
  }
  
  // Manual cleanup method
  unref(): Promise<void> {
    if (!this.ptr) return Promise.resolve();
    objectRegistry.unregister(this);
    return fetch('http://localhost:8000/GObject/Object/' + this.ptr + '/unref')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      });
  }
}

export class GstBus extends GObjectBase {
  static async new(): Promise<GstBus> {
    const url = new URL(`/Gst/Bus/new`, 'http://localhost:8000');
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const instance = new GstBus();
    Object.assign(instance, data.return || data);
    return instance;
  }

  async add_signal_watch(): Promise<void> {
    const url = new URL(`/Gst/Bus/${this.ptr}/add_signal_watch`, 'http://localhost:8000');
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }
}
```

Usage with automatic cleanup:
```typescript
async function processWithAutoCleanup() {
  const bus = await GstBus.new();
  await bus.add_signal_watch();
  // bus will be automatically unreferenced when garbage collected
}
```

Usage with manual cleanup:
```typescript
async function processWithManualCleanup() {
  const bus = await GstBus.new();
  try {
    await bus.add_signal_watch();
  } finally {
    await bus.unref();  // Explicit cleanup
  }
}
```

### Enums

Enumerations without methods are generated as type aliases:

```typescript
export type GstState = "void_pending" | "null" | "ready" | "paused" | "playing";
```

Enumerations with methods are generated as namespaces with const values and static methods:

```typescript
export namespace GstStateChange {
  export const NULL_TO_READY: 'null_to_ready' = 'null_to_ready';
  export const READY_TO_PAUSED: 'ready_to_paused' = 'ready_to_paused';
  // ... more values
  
  static get_name(transition: GstStateChange): Promise<string>;
}
export type GstStateChangeValue = "null_to_ready" | "ready_to_paused" | ...;
```

With `--base-url`, enum methods include implementations:

```typescript
export namespace GstStateChange {
  export const NULL_TO_READY: 'null_to_ready' = 'null_to_ready';
  // ... more values
  
  static async get_name(transition: GstStateChange): Promise<string> {
    const url = new URL(`/Gst/StateChange/get_name`, 'http://localhost:8000');
    url.searchParams.append('transition', String(transition));
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.return;
  }
}
```

## Requirements

- Python 3.10+
- PyGObject with GIRepository 2.0
- apispec
- jinja2

## Installation

No installation required. Just run the script directly:

```bash
cd /path/to/gst-audit/girest
python3 girest-client-generator.py <namespace> <version>
```

## OpenAPI Schema Enhancements

The tool adds vendor extensions to the OpenAPI schema to preserve GObject Introspection semantics:

**Type Classification** - `x-gi-type` on schemas identifies the GObject type:
- `object` - GObject-derived class types
- `enum` - Enumeration types
- `flags` - Flag types (bitfield enumerations)
- `struct` - Structure types

This allows generators to intelligently decide whether to generate interfaces, classes, or type aliases based on the actual type semantics.

**Constructor Identification** - `x-gi-constructor: true` marks constructor methods, allowing generators to create appropriate static factory methods.

**Transfer Ownership** - `x-gi-transfer` on parameters indicates ownership transfer:
- `none` - Caller retains ownership (default)
- `container` - Transfer container ownership, not contents  
- `full` - Full ownership transfer to callee

When `--base-url` is provided and a parameter has `full` transfer with a GObject type, the generated code:
1. Increments the ref count before the call (`g_object_ref`)
2. On failure, decrements the ref count to maintain correct refcounting
3. On success, ownership transfers and the object is not unreferenced

Example with full transfer:
```typescript
async register(name: string, allocator: GstAllocator): Promise<void> {
  // Increment ref for full transfer parameter
  if (allocator && typeof allocator === 'object' && 'ptr' in allocator) {
    await fetch('http://localhost:8000/GObject/Object/' + allocator.ptr + '/ref').catch(() => {});
  }
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      // Unref on failure
      if (allocator && typeof allocator === 'object' && 'ptr' in allocator) {
        await fetch('http://localhost:8000/GObject/Object/' + allocator.ptr + '/unref').catch(() => {});
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // On success, ownership transferred - no unref needed
  } catch (error) {
    // Unref on error
    if (allocator && typeof allocator === 'object' && 'ptr' in allocator) {
      await fetch('http://localhost:8000/GObject/Object/' + allocator.ptr + '/unref').catch(() => {});
    }
    throw error;
  }
}
```

## How It Works

1. **Schema Generation**: Uses the `GIRest` class from `main.py` to generate an OpenAPI schema from GObject introspection data
2. **TypeScript Generation**: The `TypeScriptGenerator` class (using Jinja2 templates) parses the OpenAPI schema and generates TypeScript definitions:
   - Schemas become interfaces
   - Operations are grouped by tags (class names)
   - Methods are generated for each class based on their tags
   - Inheritance is handled using `allOf` schemas
   - Types are converted from OpenAPI to TypeScript
   - When `--base-url` is provided, method implementations with fetch calls are generated
   - GObject-derived types extend `GObjectBase` for automatic memory management via FinalizationRegistry
   - The `g_object_unref` endpoint is called automatically when objects are garbage collected or manually via `unref()`
   - Parameter transfer ownership is respected with automatic ref counting

## Examples

### Example 1: Type Definitions Only

```bash
python3 girest-client-generator.py Gst 1.0 -o gst.d.ts
```

Generates type-safe definitions that can be used for IDE autocomplete and type checking, but without implementations.

### Example 2: Full Implementation

```bash
python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
```

Generates a complete TypeScript module with working REST API calls. Use this in your client application:

```typescript
import { GstBus, GstElement, GstState } from './gst';

// Create a new instance using constructor
const bus = await GstBus.new();
await bus.add_signal_watch();

// Or use an existing element
const element = new GstElement();
element.ptr = "0x12345678"; // Set from server response

// Call methods with full implementation
await element.set_state(GstState.PLAYING);
await element.abort_state();
```

### Example 3: Using Constructors

```typescript
import { GstGhostPad, GstPad } from './gst';

// Create instances using static factory methods
const pad = await GstPad.new('sink', GstPadDirection.SINK);
const ghostPad = await GstGhostPad.new('ghost', pad);

// Use the created instances
await ghostPad.set_active(true);
```

### Example 4: Using Enums

```typescript
import { GstStateChange } from './gst';

// Use enum constants
const transition = GstStateChange.NULL_TO_READY;

// Call static enum methods
const name = await GstStateChange.get_name(transition);
console.log(name); // "null_to_ready"
```

### Example 5: Using Callbacks

The generated TypeScript bindings automatically handle callback registration and dispatching:

```typescript
import { Gst } from './gst';

// Define your callback function with proper type signature
function onLog(
  category: any,
  level: any,
  file: string,
  func: string,
  line: number,
  obj: any,
  message: any
) {
  console.log(`${file}:${line} ${func}() - ${message}`);
}

// Register the callback - the binding handles everything automatically
await Gst.debug_add_log_function(onLog);

// The generated code will:
// 1. Call the REST endpoint /Gst/debug_add_log_function
// 2. Receive a callback ID from the server
// 3. Register your callback in the internal dispatcher map
// 4. Listen for callback events via EventSource on /GIRest/callbacks
// 5. Automatically dispatch events to your callback function

// Compare this to the manual approach in girest/examples/log.js:
// - No need to manually create EventSource
// - No need to manually manage the callback dispatcher map
// - No need to manually parse event data
// All of this is handled automatically by the generated bindings!
```

The callback dispatcher is initialized automatically in the generated code:

```typescript
// Generated code includes:
const callbackDispatcher = new Map<string, Function>();

const callbackSource = new EventSource('http://localhost:8000/GIRest/callbacks');
callbackSource.onmessage = (ev) => {
  const json = JSON.parse(ev.data);
  const cb = callbackDispatcher.get(json.id.toString());
  if (cb) {
    cb(...Object.values(json.data));
  }
};
```

When you call a function that takes a callback, the generated method implementation automatically registers it:

```typescript
// Generated method implementation:
static async debug_add_log_function(func: (category, level, ...) => void): Promise<...> {
  const response = await fetch(url);
  const data = await response.json();
  // Automatically register the callback
  if (data.func !== undefined) {
    callbackDispatcher.set(data.func.toString(), func);
  }
  return data;
}
```

## See Also

- [GIRepository Documentation](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
