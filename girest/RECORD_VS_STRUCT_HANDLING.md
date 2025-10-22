# Record vs Struct Parameter Handling in GIRest

## Overview

This document describes the handling of out/inout parameters for structs and boxed types (records) in GIRest.

## Background

In GObject Introspection, there are two main categories of structured types:

1. **Regular Structs** (GI_INFO_TYPE_STRUCT without registered GType)
   - Plain C structures without GObject type system integration
   - Example: Some simple data structures

2. **Registered Structs/Boxed Types** (GI_INFO_TYPE_STRUCT with registered GType)
   - Structures registered in the GObject type system
   - May be ref-counted or have copy/free functions
   - Examples: GValue, GstMessage, GstIterator, etc.

## The Problem

When a struct is used as an out/inout parameter in a C function signature, the caller must provide storage for the structure. The key issue is determining how much memory to allocate:

### Example: GstIterator::next

```c
GstIteratorResult gst_iterator_next (GstIterator *it, GValue *elem);
```

The `elem` parameter is marked as OUT in GI annotations. In C, you would call it like:

```c
GValue value = G_VALUE_INIT;
GstIteratorResult result = gst_iterator_next(it, &value);
```

The Frida script needs to allocate memory for the GValue structure (24 bytes), not just a pointer (8 bytes).

## Solution

### 1. Resolver Changes (girest/girest/resolvers.py)

The resolver now detects structs with registered GTypes and assigns them the "gtype" type instead of "pointer":

```python
# In _type_to_json method
if tag == "interface":
    interface = GIRepository.type_info_get_interface(t)
    if interface:
        info_type = interface.get_type()
        if info_type == GIRepository.InfoType.CALLBACK:
            return "callback"
        elif info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
            return "int32"
        elif info_type == GIRepository.InfoType.STRUCT:
            # Check if this is a struct with a registered GType (boxed type)
            gtype = GIRepository.registered_type_info_get_g_type(interface)
            if gtype != 0:
                return "gtype"
```

This means for a GValue out parameter, the JSON representation is:

```python
{
    "name": "elem",
    "direction": 1,  # OUT
    "type": "gtype"  # Indicates a registered GType struct
}
```

### 2. Frida Script Changes (gstaudit.js)

The Frida script handles the "gtype" type for memory allocation and dereferencing:

**Type Signature:**
```javascript
function type_signature(type)
{
    if (type == "callback") {
      return "pointer";
    } else if (type == "string") {
      return "pointer";
    } else if (type == "gtype") {
      return "pointer";
    } else {
     return type;
    }
}
```

**Memory Allocation:**
```javascript
function base_type_to_size(t)
{
  switch (t) {
    case "string":
    case "pointer":
    case "callback":
    case "gtype":
      return Process.pointerSize;  // 8 bytes on 64-bit
    // ... other types
  }
}
```

**Reading Out Parameters:**
```javascript
function base_type_read(t, p)
{
  switch (t) {
    case "string":
      return p.readCString();
    case "gtype":
      return p.readPointer();  // Dereference the pointer
    // ... other types
  }
}
```

For out parameters with direction 1 or 2 (OUT/INOUT):
```javascript
} else if ([1, 2].includes(a["direction"])) {
  /* Allocate memory for the output parameter */
  tx_args.push(Memory.alloc(base_type_to_size(a["type"])));
}

// Later, when reading results:
} else if ([1, 2].includes(a["direction"])) {
  ret[a["name"]] = base_type_read(a["type"], tx_args[idx]);
}
```

## Implications

### Type Distinction

- **Before**: All interface types (structs, objects, etc.) were uniformly treated as "pointer" type
- **After**: Registered GType structs (boxed types) are identified as "gtype" type, distinguishing them from regular structs and objects

### Memory Allocation

- **All pointer-like types**: Allocate `Process.pointerSize` bytes (8 bytes on 64-bit systems)
- This includes: "pointer", "string", "callback", and "gtype"

### Return Values for Out Parameters

- **Regular types**: Read using appropriate method (e.g., `readS32()` for int32)
- **String types**: Read using `readCString()`
- **GType types**: Read using `readPointer()` to dereference the pointer stored in the allocated memory

### API Usage

For registered GType out parameters (like GValue in `gst_iterator_next`):
1. Frida allocates 8 bytes (pointer size) for the out parameter
2. The C function fills this memory with a pointer to the actual GValue struct
3. Frida reads this pointer using `readPointer()`
4. The REST API returns this pointer value, which can be used in subsequent calls

## Testing

The test suite (`tests/test_record_vs_struct_params.py`) validates:

1. Basic object creation with registered GTypes (GstBin)
2. Schema generation includes proper type markers
3. Infrastructure is in place for future out parameter tests

## Future Work

- Extend REST API to support calling methods with out parameters
- Add tests that actually exercise out parameter functionality
- Consider how to expose struct data to REST API clients (possibly by expanding structs to JSON)

## Related Issues

- Issue: Create a girest test for testing record vs. struct inout/out parameters
- Fixes standalone function resolution bug (buffer_get_max_memory)
