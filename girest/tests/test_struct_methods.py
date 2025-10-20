#!/usr/bin/env python3
"""
Tests for struct method generation in GIRest.

These tests verify that:
1. Struct schemas are generated with methods in the OpenAPI schema
2. TypeScript generator creates classes for structs with methods
3. Structs without methods remain as interfaces
"""

import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.generator import TypeScriptGenerator


def test_struct_methods_in_schema():
    """
    Test that struct methods are generated in the OpenAPI schema.
    
    Uses GstBuffer as a test case since it's a struct with many methods.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Verify GstBuffer schema exists
    assert 'GstBuffer' in schema['components']['schemas'], "GstBuffer schema should exist"
    
    # Verify it's marked as a struct
    buffer_schema = schema['components']['schemas']['GstBuffer']
    assert buffer_schema.get('x-gi-type') == 'struct', "GstBuffer should be marked as struct"
    
    # Find paths with /Buffer/ in them (struct methods)
    buffer_paths = [p for p in schema['paths'] if '/Buffer/' in p]
    
    # GstBuffer should have methods (it has 58+ methods)
    assert len(buffer_paths) > 0, f"Expected Buffer methods, found {len(buffer_paths)}"
    assert len(buffer_paths) >= 50, f"Expected at least 50 Buffer methods, found {len(buffer_paths)}"
    
    # Check that at least one constructor exists
    constructor_paths = [p for p in buffer_paths if '/Buffer/new' in p]
    assert len(constructor_paths) > 0, "Expected at least one constructor for Buffer"
    
    # Verify operation structure for one method
    sample_path = buffer_paths[0]
    method = list(schema['paths'][sample_path].keys())[0]
    operation = schema['paths'][sample_path][method]
    
    assert 'operationId' in operation, "Operation should have operationId"
    assert 'tags' in operation, "Operation should have tags"
    assert operation['tags'] == ['GstBuffer'], f"Expected tag GstBuffer, got {operation['tags']}"
    
    print(f"✓ Found {len(buffer_paths)} methods for GstBuffer struct")


def test_struct_without_methods_in_schema():
    """
    Test that structs without methods are still generated in the schema.
    
    Uses GstAllocatorPrivate as a test case since it's a struct without methods.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Verify GstAllocatorPrivate schema exists
    assert 'GstAllocatorPrivate' in schema['components']['schemas'], \
        "GstAllocatorPrivate schema should exist"
    
    # Verify it's marked as a struct
    private_schema = schema['components']['schemas']['GstAllocatorPrivate']
    assert private_schema.get('x-gi-type') == 'struct', \
        "GstAllocatorPrivate should be marked as struct"
    
    # Should not have any methods (paths)
    private_paths = [p for p in schema['paths'] if '/AllocatorPrivate/' in p]
    assert len(private_paths) == 0, \
        f"GstAllocatorPrivate should have no methods, found {len(private_paths)}"
    
    print("✓ Struct without methods has schema but no endpoints")


def test_typescript_class_generation_for_structs():
    """
    Test that TypeScript generator creates classes for structs with methods.
    
    Uses GstBuffer as a test case.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Generate TypeScript
    generator = TypeScriptGenerator(schema, host='localhost', port=9000)
    typescript = generator.generate()
    
    # Verify GstBuffer is generated as a class, not an interface
    assert 'export class GstBuffer {' in typescript, \
        "GstBuffer should be generated as a class"
    
    # Verify it's not also generated as an interface (avoid duplication)
    # Count occurrences - should only be the class definition
    interface_count = typescript.count('export interface GstBuffer {')
    assert interface_count == 0, \
        f"GstBuffer should not be generated as interface, found {interface_count} occurrences"
    
    # Verify the class has methods
    # Check for at least one constructor
    assert 'static async new():' in typescript or 'static async new(' in typescript, \
        "GstBuffer class should have constructor methods"
    
    # Check for at least one instance method
    assert 'async add_meta(' in typescript, \
        "GstBuffer class should have instance methods"
    
    print("✓ TypeScript generator creates class for struct with methods")


def test_typescript_interface_generation_for_structs_without_methods():
    """
    Test that TypeScript generator creates interfaces for structs without methods.
    
    Uses GstAllocatorPrivate as a test case.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Generate TypeScript
    generator = TypeScriptGenerator(schema, host='localhost', port=9000)
    typescript = generator.generate()
    
    # Verify GstAllocatorPrivate is generated as an interface
    assert 'export interface GstAllocatorPrivate {' in typescript, \
        "GstAllocatorPrivate should be generated as an interface"
    
    # Verify it's not generated as a class
    assert 'export class GstAllocatorPrivate {' not in typescript, \
        "GstAllocatorPrivate should not be generated as a class"
    
    print("✓ TypeScript generator creates interface for struct without methods")


if __name__ == '__main__':
    print("Running struct method tests...")
    print()
    
    test_struct_methods_in_schema()
    test_struct_without_methods_in_schema()
    test_typescript_class_generation_for_structs()
    test_typescript_interface_generation_for_structs_without_methods()
    
    print()
    print("All tests passed! ✓")
