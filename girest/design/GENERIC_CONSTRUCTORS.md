# Generic Constructors and Destructors for Structs

## Overview

In a client/server system like GIRest, memory allocated on the client side cannot be used on the server. For structs that have methods but no explicit constructors or destructors (like `GObject.Value`), we need a way to allocate and manage memory on the server side.

This document describes the implementation of generic `new` and `free` methods for such structs.

## Problem

Many GObject-based structs have methods but no constructor or destructor functions:
- `GObject.Value` (GValue) - 24 bytes, 65+ methods, no constructor
- `Gst.Meta` - 16 bytes, 11 methods, no constructor/destructor
- `Gst.MiniObject` - 64 bytes, 10 methods, no constructor/destructor
- And many others...

Without constructors, clients cannot create instances of these structs to use with their methods.

## Solution

### 1. Schema Generation (Python - `main.py`)

During schema generation, for each struct that has methods:
- Check if it has any real constructor methods (marked with `IS_CONSTRUCTOR` flag)
- Check if it has a `free` method
- If no constructor exists: generate a generic `/{namespace}/{name}/new` endpoint
- If no free method exists: generate a generic `/{namespace}/{name}/{self}/free` endpoint

The generic `new` endpoint includes:
- Metadata: `x-gi-generic: true`, `x-gi-constructor: true`
- Struct size: `x-gi-struct-size: <size in bytes>`
- Returns a pointer to the allocated memory

The generic `free` endpoint includes:
- Metadata: `x-gi-generic: true`
- Path parameter: `self` (pointer to free)
- No return value (204 No Content)

### 2. Resolver Logic (Python - `resolvers.py`)

The resolver handles generic operations by:
1. Checking the operation ID pattern: `{namespace}-{name}-{new|free}`
2. If the operation matches and no real method exists, create a generic handler
3. For `new`: calls Frida's `alloc(size)` with the struct size
4. For `free`: calls Frida's `free(ptr)` with the pointer

### 3. Frida Script (`gstaudit.js`)

Implements two exported functions:

```javascript
function alloc(size)
{
  console.info(`Allocating ${size} bytes`);
  const ptr = Memory.alloc(size);
  // Store in map to prevent garbage collection
  allocatedPointers.set(ptr.toString(), ptr);
  console.info(`Allocated ${size} bytes at ${ptr}`);
  return ptr.toString();
}

function free(ptr)
{
  console.info(`Freeing pointer ${ptr}`);
  // Remove from map to allow garbage collection
  const ptrStr = ptr.toString();
  if (allocatedPointers.has(ptrStr)) {
    allocatedPointers.delete(ptrStr);
    console.info(`Freed pointer ${ptr}`);
  }
}
```

Key points:
- Uses Frida's `Memory.alloc()` for allocation
- Maintains a map of allocated pointers to prevent GC
- Memory is freed when removed from the map or when script unloads
- Does not call system `free()` - Frida manages the memory

### 4. TypeScript Generation

The TypeScript generator automatically:
- Creates a static `new()` method for generic constructors
- Creates an instance `free()` method for generic destructors
- Maintains the same API as structs with real constructors

Example generated code:

```typescript
export class GObjectValue {
  ptr!: Pointer;

  static async new(): Promise<GObjectValue> {
    const url = new URL(`/GObject/Value/new`, apiConfig.baseUrl);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const instance = new GObjectValue();
    Object.assign(instance, data.return || data);
    return instance;
  }

  async free(): Promise<void> {
    const url = new URL(`/GObject/Value/${this.ptr}/free`, apiConfig.baseUrl);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }

  // ... other methods
}
```

## Usage Example

### TypeScript Client

```typescript
// Create a new GValue instance
const value = await GObjectValue.new();

// Use the value with its methods
await value.set_int(42);
const num = await value.get_int();

// Clean up
await value.free();
```

### REST API

```bash
# Allocate a new GValue (24 bytes)
curl http://localhost:9000/GObject/Value/new
# Returns: {"return": "0x7f1234567890"}

# Use it with methods
curl "http://localhost:9000/GObject/Value/0x7f1234567890/set_int?value=42"

# Free the memory
curl http://localhost:9000/GObject/Value/0x7f1234567890/free
```

## Statistics

After implementing generic constructors, the following structs gained allocation capabilities:

### GObject namespace:
- `GObject.Value` (24 bytes, 65 methods)
- `GObject.TypeInterface` (16 bytes)
- `GObject.TypeClass` (8 bytes)
- `GObject.TypeInstance` (8 bytes)

### Gst namespace (22 structs):
- `Gst.CustomMeta` (24 bytes, 2 methods)
- `Gst.DebugCategory` (24 bytes)
- `Gst.DebugMessage` (0 bytes, 2 methods)
- `Gst.Meta` (16 bytes, 11 methods)
- `Gst.MetaInfo` (72 bytes, 2 methods)
- `Gst.MiniObject` (64 bytes, 10 methods)
- `Gst.PadProbeInfo` (40 bytes, 4 methods)
- And many more...

Total: 67 generic operations across all tested namespaces.

## Testing

Comprehensive test coverage includes:

1. **Schema Generation Tests** (`test_generic_constructors.py`):
   - Verify generic endpoints are created for structs without constructors
   - Verify real constructors are not replaced by generic ones
   - Test multiple namespaces (Gst, GObject)

2. **Resolver Tests** (`test_resolver_generic.py`):
   - Operation ID pattern matching
   - Struct size metadata
   - Tag consistency for TypeScript generation

3. **TypeScript Generation Tests**:
   - Classes with static `new()` methods
   - Instance `free()` methods
   - Integration with existing methods

4. **Demonstration** (`test_generic_demo.py`):
   - Shows examples of generated endpoints
   - Explains the implementation details

## Benefits

1. **Complete API Coverage**: All structs with methods can now be instantiated
2. **Type Safety**: TypeScript bindings maintain full type safety
3. **Consistent API**: Generic constructors work the same as real ones
4. **Memory Management**: Prevents GC issues with pointer tracking
5. **Zero Overhead**: Only generated for structs that need it

## Limitations

1. **Uninitialized Memory**: Generic `new` only allocates memory, doesn't initialize fields
2. **No Custom Logic**: Can't run struct-specific initialization code
3. **Frida-Only**: Memory is managed by Frida's allocator
4. **No System Free**: Relies on Frida's memory management, not system `free()`

## Future Enhancements

Potential improvements:
1. Add initialization parameters to generic constructors
2. Support for struct-specific free functions (if defined in GI)
3. Memory pool for frequently allocated structs
4. Automatic memory lifetime management
5. Integration with GC on the client side

## References

- [GObject Introspection Documentation](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
- [Frida Memory API](https://frida.re/docs/javascript-api/#memory)
- Issue: "Create generic constructor and destructors for structs"
