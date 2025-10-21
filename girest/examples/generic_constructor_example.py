#!/usr/bin/env python3
"""
Example demonstrating generic constructors for structs without native constructors.

This example shows how to use the REST API to:
1. Allocate a GValue (GObject.Value) using the generic constructor
2. Use its methods
3. Free the allocated memory

Note: This requires a running GIRest server attached to a process.
For this demo, we just show the generated schema and TypeScript.
"""

import sys
import os
import json

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.generator import TypeScriptGenerator


def show_gvalue_example():
    """Show GValue (GObject.Value) example with generic constructor."""
    print("=" * 80)
    print("EXAMPLE: Using Generic Constructor for GObject.Value")
    print("=" * 80)
    print()
    
    # Generate schema
    girest = GIRest('GObject', '2.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Show the endpoints
    print("1. Generic Constructor Endpoint")
    print("-" * 80)
    new_path = '/GObject/Value/new'
    operation = schema['paths'][new_path]['get']
    
    print(f"Endpoint: GET {new_path}")
    print(f"Operation ID: {operation['operationId']}")
    print(f"Struct size: {operation['x-gi-struct-size']} bytes")
    print(f"Returns: pointer to allocated GValue")
    print()
    print("Example curl command:")
    print(f"  curl http://localhost:9000{new_path}")
    print('  # Returns: {"return": "0x7f1234567890"}')
    print()
    
    print("2. Generic Destructor Endpoint")
    print("-" * 80)
    free_path = '/GObject/Value/{self}/free'
    operation = schema['paths'][free_path]['get']
    
    print(f"Endpoint: GET {free_path}")
    print(f"Operation ID: {operation['operationId']}")
    print(f"Parameter: self (pointer to free)")
    print(f"Returns: 204 No Content")
    print()
    print("Example curl command:")
    print('  curl http://localhost:9000/GObject/Value/0x7f1234567890/free')
    print()
    
    print("3. Using GValue Methods")
    print("-" * 80)
    # Find some GValue methods
    value_methods = [p for p in schema['paths'] if '/Value/' in p and p != new_path and p != free_path]
    print(f"GValue has {len(value_methods)} methods available")
    print("Examples:")
    for path in value_methods[:5]:
        method_name = path.split('/')[-1]
        print(f"  - {method_name}")
    print()
    
    print("4. Complete Usage Flow")
    print("-" * 80)
    print("""
# Step 1: Allocate a new GValue
$ curl http://localhost:9000/GObject/Value/new
{"return": "0x7f1234567890"}

# Step 2: Initialize it as an integer type
$ curl "http://localhost:9000/GObject/Value/0x7f1234567890/init?type=G_TYPE_INT"

# Step 3: Set the value
$ curl "http://localhost:9000/GObject/Value/0x7f1234567890/set_int?value=42"

# Step 4: Get the value
$ curl "http://localhost:9000/GObject/Value/0x7f1234567890/get_int"
{"return": 42}

# Step 5: Free the memory
$ curl http://localhost:9000/GObject/Value/0x7f1234567890/free
    """)
    
    print("5. TypeScript Usage")
    print("-" * 80)
    print("""
// The TypeScript bindings make this even easier:

import { GObjectValue } from './api';

async function useGValue() {
  // Allocate a new GValue
  const value = await GObjectValue.new();
  
  try {
    // Initialize and use it
    await value.init(GObjectType.INT);
    await value.set_int(42);
    const result = await value.get_int();
    console.log(`Value: ${result}`); // Value: 42
  } finally {
    // Clean up
    await value.free();
  }
}
    """)


def show_gst_meta_example():
    """Show GstMeta example with generic constructor."""
    print()
    print("=" * 80)
    print("EXAMPLE: Using Generic Constructor for Gst.Meta")
    print("=" * 80)
    print()
    
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Show the endpoints
    new_path = '/Gst/Meta/new'
    operation = schema['paths'][new_path]['get']
    
    print("1. GstMeta Allocation")
    print("-" * 80)
    print(f"Endpoint: GET {new_path}")
    print(f"Struct size: {operation['x-gi-struct-size']} bytes")
    print()
    
    # Find GstMeta methods
    meta_methods = [p for p in schema['paths'] if '/Meta/' in p and '/new' not in p and '/free' not in p]
    print(f"2. Available GstMeta Methods ({len(meta_methods)} total)")
    print("-" * 80)
    for path in meta_methods:
        method_name = path.split('/')[-1]
        operation = list(schema['paths'][path].values())[0]
        print(f"  - {method_name:30} {operation.get('summary', '')}")
    print()
    
    print("3. TypeScript Example")
    print("-" * 80)
    print("""
// Working with GstMeta in TypeScript

import { GstMeta } from './api';

async function compareMetas(buffer1: GstBuffer, buffer2: GstBuffer) {
  const meta1 = await GstMeta.new();
  const meta2 = await GstMeta.new();
  
  try {
    // Use the metas with buffer operations
    const seqnum1 = await meta1.get_seqnum();
    const seqnum2 = await meta2.get_seqnum();
    
    const comparison = await meta1.compare_seqnum(meta2);
    console.log(`Sequence number comparison: ${comparison}`);
  } finally {
    // Clean up both
    await meta1.free();
    await meta2.free();
  }
}
    """)


def show_summary():
    """Show summary of all structs with generic constructors."""
    print()
    print("=" * 80)
    print("SUMMARY: All Structs with Generic Constructors")
    print("=" * 80)
    print()
    
    # Collect from multiple namespaces
    all_structs = []
    
    for namespace, version in [('GObject', '2.0'), ('Gst', '1.0')]:
        girest = GIRest(namespace, version)
        spec = girest.generate()
        schema = spec.to_dict()
        
        for path, operations in schema['paths'].items():
            for method, operation in operations.items():
                if operation.get('x-gi-generic') and operation.get('x-gi-constructor'):
                    op_id = operation['operationId']
                    size = operation.get('x-gi-struct-size', 0)
                    struct_name = op_id.replace(f'{namespace}-', '').replace('-new', '')
                    all_structs.append((namespace, struct_name, size))
    
    # Group by namespace
    by_namespace = {}
    for ns, name, size in all_structs:
        if ns not in by_namespace:
            by_namespace[ns] = []
        by_namespace[ns].append((name, size))
    
    for ns, structs in sorted(by_namespace.items()):
        print(f"{ns} Namespace ({len(structs)} structs):")
        print("-" * 80)
        for name, size in sorted(structs):
            print(f"  - {name:35} {size:4} bytes")
        print()
    
    total = sum(len(s) for s in by_namespace.values())
    print(f"Total: {total} structs with generic constructors")


if __name__ == '__main__':
    show_gvalue_example()
    show_gst_meta_example()
    show_summary()
