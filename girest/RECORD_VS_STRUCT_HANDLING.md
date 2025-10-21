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

The resolver now provides additional metadata for out/inout parameters:

```python
{
    "name": "elem",
    "direction": 1,  # OUT
    "type": "pointer",
    "struct_size": 24,  # Size of GValue structure
    "is_registered_gtype": True  # GValue has a registered GType
}
```

### 2. Frida Script Changes (gstaudit.js)

The Frida script now uses the `struct_size` metadata when allocating memory:

```javascript
} else if ([1, 2].includes(a["direction"])) {
  /* For output arguments, allocate memory */
  var alloc_size = base_type_to_size(a["type"]);
  if (a["struct_size"]) {
    /* Use struct size for struct out parameters */
    alloc_size = a["struct_size"];
  }
  tx_args.push(Memory.alloc(alloc_size));
}
```

For reading out parameters:

```javascript
} else if ([1, 2].includes(a["direction"])) {
  if (a["struct_size"]) {
    /* For struct out parameters, return the pointer to the struct */
    ret[a["name"]] = tx_args[idx];
  } else {
    /* For scalar out parameters, dereference and read the value */
    ret[a["name"]] = base_type_read(a["type"], tx_args[idx]);
  }
}
```

## Implications

### Memory Allocation

- **Before**: All out parameters of type "pointer" allocated 8 bytes (pointer size)
- **After**: Struct out parameters allocate the full struct size (e.g., 24 bytes for GValue)

### Return Values

- **Before**: Out parameters were dereferenced and the pointer value was returned
- **After**: Struct out parameters return the pointer to the allocated memory

### API Usage

When calling a method with struct out parameters via the REST API, the response will contain a pointer to the filled struct. The caller can then use this pointer to access the struct data in subsequent calls.

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
