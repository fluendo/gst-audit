# girest-ts

TypeScript bindings generator for GIRest schemas.

## Overview

`girest-ts` is a command-line tool that generates TypeScript type definitions from GObject introspection data. It uses the GIRepository library to introspect GObject-based libraries and generates TypeScript interfaces and classes with proper inheritance and method signatures.

The tool can generate either:
1. **Type definitions only** - TypeScript interfaces and method signatures (default)
2. **Full implementations** - Complete TypeScript code with REST API calls (with `--base-url`)

## Features

- **Automatic TypeScript generation**: Converts GObject introspection data to TypeScript
- **Inheritance support**: Properly handles `allOf` schemas and generates TypeScript interfaces with `extends`
- **Class methods**: Methods are organized by their tag (class name) and generated as class methods
- **Constructor support**: Constructor methods (marked with `IS_CONSTRUCTOR` flag) are generated as static factory methods
- **Enum support**: Enumerations with methods are generated as namespaces with const values and static methods
- **REST API implementation**: When `--base-url` is provided, generates complete method implementations with fetch calls
- **Type safety**: All parameters and return types are properly typed
- **Schema output**: Can also output the OpenAPI schema in JSON format

## Usage

### Basic Usage

Generate TypeScript type definitions for a namespace:

```bash
python3 girest-ts.py <namespace> <version>
```

Generate with REST API implementation:

```bash
python3 girest-ts.py <namespace> <version> --base-url http://localhost:8000
```

### Examples

Generate TypeScript bindings for GLib 2.0:

```bash
python3 girest-ts.py GLib 2.0 > glib.d.ts
```

Generate TypeScript bindings for GStreamer with REST API implementation:

```bash
python3 girest-ts.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
```

Generate the OpenAPI schema instead of TypeScript:

```bash
python3 girest-ts.py GLib 2.0 --schema-only > glib-schema.json
```

### Command-line Options

```
usage: girest-ts.py [-h] [-o OUTPUT] [--schema-only] [--base-url BASE_URL] namespace version

positional arguments:
  namespace             GObject namespace (e.g., 'Gst', 'GLib', 'Gtk')
  version               Namespace version (e.g., '1.0', '2.0')

options:
  -h, --help            show this help message and exit
  -o OUTPUT, --output OUTPUT
                        Output file path (default: stdout)
  --schema-only         Output OpenAPI schema JSON instead of TypeScript
  --base-url BASE_URL   Base URL for REST API calls (e.g., 'http://localhost:8000').
                        If not provided, methods will return Promise types without implementation.
```

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

When `--base-url` is provided, methods include complete implementations with REST API calls:

```typescript
export class GstBus {
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

## Installation

No installation required. Just run the script directly:

```bash
cd /path/to/gst-audit/girest
python3 girest-ts.py <namespace> <version>
```

## How It Works

1. **Schema Generation**: Uses the `GIRest` class from `main.py` to generate an OpenAPI schema from GObject introspection data
2. **TypeScript Generation**: The `TypeScriptGenerator` class parses the OpenAPI schema and generates TypeScript definitions:
   - Schemas become interfaces
   - Operations are grouped by tags (class names)
   - Methods are generated for each class based on their tags
   - Inheritance is handled using `allOf` schemas
   - Types are converted from OpenAPI to TypeScript
   - When `--base-url` is provided, method implementations with fetch calls are generated

## Examples

### Example 1: Type Definitions Only

```bash
python3 girest-ts.py Gst 1.0 -o gst.d.ts
```

Generates type-safe definitions that can be used for IDE autocomplete and type checking, but without implementations.

### Example 2: Full Implementation

```bash
python3 girest-ts.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
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

## See Also

- [GIRepository Documentation](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
