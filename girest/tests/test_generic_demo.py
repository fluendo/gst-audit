#!/usr/bin/env python3
"""
Demonstration of generic struct constructors/destructors.

This script shows how the generic new/free endpoints work for structs
that don't have their own constructors.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest


def demonstrate_generic_endpoints():
    """Show examples of generic endpoints being generated."""
    print("=" * 80)
    print("DEMONSTRATION: Generic Struct Constructors and Destructors")
    print("=" * 80)
    print()
    
    # Example 1: GObject.Value (specifically mentioned in the issue)
    print("Example 1: GObject.Value")
    print("-" * 80)
    girest = GIRest('GObject', '2.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Show the new endpoint
    new_path = '/GObject/Value/new'
    if new_path in schema['paths']:
        operation = schema['paths'][new_path]['get']
        print(f"✓ Generic constructor endpoint: {new_path}")
        print(f"  - Operation ID: {operation['operationId']}")
        print(f"  - Is constructor: {operation['x-gi-constructor']}")
        print()
    
    # Show the free endpoint
    free_path = '/GObject/Value/{self}/free'
    if free_path in schema['paths']:
        operation = schema['paths'][free_path]['get']
        print(f"✓ Generic destructor endpoint: {free_path}")
        print(f"  - Operation ID: {operation['operationId']}")
        print()
    
    # Example 2: Multiple Gst structs
    print("Example 2: GStreamer Structs")
    print("-" * 80)
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Find all generic endpoints
    generic_structs = []
    for path, operations in schema['paths'].items():
        for method, operation in operations.items():
            if operation.get('x-gi-constructor') and operation['operationId'].endswith('-new'):
                op_id = operation['operationId']
                struct_name = op_id.replace('Gst-', '').replace('-new', '')
                generic_structs.append(struct_name)
    
    print(f"Found {len(generic_structs)} structs with generic constructors:")
    for i, name in enumerate(sorted(generic_structs)[:10], 1):
        print(f"  {i:2}. {name}")
    
    if len(generic_structs) > 10:
        print(f"  ... and {len(generic_structs) - 10} more")
    print()
    
    # Example 3: Show that structs with real constructors don't get generic ones
    print("Example 3: Structs with Real Constructors (no generic endpoints)")
    print("-" * 80)
    
    # GstBuffer has real constructors
    buffer_new_paths = [p for p in schema['paths'] if '/Buffer/new' in p]
    print(f"GstBuffer has {len(buffer_new_paths)} constructor endpoints:")
    for path in buffer_new_paths:
        operation = schema['paths'][path]['get']
        op_id = operation['operationId']
        print(f"  - {op_id}")
    
    print()
    print("=" * 80)
    print("How it works:")
    print("=" * 80)
    print("""
1. Python side (main.py):
   - Checks each struct during schema generation
   - If struct doesn't have a constructor -> adds generic /new endpoint
   - If struct doesn't have a free method -> adds generic /free endpoint

2. Python resolver (resolvers.py):
   - Detects generic operations by operation_id pattern
   - For generic 'new': calls Frida's alloc(size) function
   - For generic 'free': calls Frida's free(ptr) function

3. Frida side (gstaudit.js):
   - alloc(size): allocates memory using Memory.alloc(size)
   - Stores pointer in a map to prevent garbage collection
   - free(ptr): removes pointer from map

4. TypeScript generator:
   - Automatically generates static new() methods for generic constructors
   - Generates instance free() methods for generic destructors
   - Works seamlessly with existing TypeScript bindings
    """)


if __name__ == '__main__':
    demonstrate_generic_endpoints()
