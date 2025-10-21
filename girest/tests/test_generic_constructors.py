#!/usr/bin/env python3
"""
Tests for generic struct constructor/destructor generation in GIRest.

These tests verify that:
1. Structs with methods but no constructor get generic new/free endpoints
2. The OpenAPI schema includes the correct metadata for generic operations
3. TypeScript generator handles generic constructors correctly
"""

import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.generator import TypeScriptGenerator


def test_generic_new_endpoint_generation():
    """
    Test that structs without constructors get a generic 'new' endpoint.
    
    Uses GstMeta as a test case since it has methods but no constructor.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Find structs with methods but no constructor
    # GstMeta should be one of them
    meta_new_path = '/Gst/Meta/new'
    
    assert meta_new_path in schema['paths'], f"Expected generic new endpoint at {meta_new_path}"
    
    # Verify the endpoint structure
    operation = schema['paths'][meta_new_path]['get']
    assert operation['operationId'] == 'Gst-Meta-new', "Operation ID should match"
    assert operation['x-gi-constructor'] == True, "Should be marked as constructor"
    assert operation['x-gi-generic'] == True, "Should be marked as generic"
    
    # Verify response structure
    assert '200' in operation['responses'], "Should have 200 response"
    response_schema = operation['responses']['200']['content']['application/json']['schema']
    assert 'return' in response_schema['properties'], "Should return a pointer"
    
    print("✓ Generic new endpoint generated for GstMeta")


def test_generic_free_endpoint_generation():
    """
    Test that structs without free methods get a generic 'free' endpoint.
    
    Uses GstMeta as a test case.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # GstMeta should have a generic free endpoint
    meta_free_path = '/Gst/Meta/{self}/free'
    
    assert meta_free_path in schema['paths'], f"Expected generic free endpoint at {meta_free_path}"
    
    # Verify the endpoint structure
    operation = schema['paths'][meta_free_path]['get']
    assert operation['operationId'] == 'Gst-Meta-free', "Operation ID should match"
    assert operation['x-gi-generic'] == True, "Should be marked as generic"
    
    # Verify parameters
    assert len(operation['parameters']) == 1, "Should have one parameter"
    assert operation['parameters'][0]['name'] == 'self', "Parameter should be 'self'"
    assert operation['parameters'][0]['in'] == 'path', "Parameter should be in path"
    assert operation['parameters'][0]['required'] == True, "Parameter should be required"
    
    # Verify response
    assert '204' in operation['responses'], "Should have 204 No Content response"
    
    print("✓ Generic free endpoint generated for GstMeta")


def test_no_generic_endpoints_for_structs_with_constructors():
    """
    Test that structs with existing constructors don't get generic endpoints.
    
    Uses GstBuffer as a test case since it has a 'new' constructor.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # GstBuffer has actual constructors, so it should NOT have generic ones
    # Check that the new endpoint exists but is NOT generic
    buffer_new_paths = [p for p in schema['paths'] if '/Buffer/new' in p]
    
    assert len(buffer_new_paths) > 0, "GstBuffer should have constructor endpoints"
    
    # Check that none of them are generic
    for path in buffer_new_paths:
        operation = schema['paths'][path]['get']
        is_generic = operation.get('x-gi-generic', False)
        assert not is_generic, f"GstBuffer's {path} should not be generic"
    
    print("✓ GstBuffer does not have generic endpoints (has real constructors)")


def test_gobject_value_generic_endpoints():
    """
    Test that GObject.Value gets generic new/free endpoints.
    
    GValue is specifically mentioned in the issue as an example.
    """
    # Generate schema for GObject
    girest = GIRest('GObject', '2.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # GObject.Value should have generic new/free endpoints
    value_new_path = '/GObject/Value/new'
    value_free_path = '/GObject/Value/{self}/free'
    
    assert value_new_path in schema['paths'], f"Expected generic new endpoint for GValue"
    assert value_free_path in schema['paths'], f"Expected generic free endpoint for GValue"
    
    # Verify the new endpoint
    new_operation = schema['paths'][value_new_path]['get']
    assert new_operation['x-gi-generic'] == True, "GValue new should be generic"
    
    print("✓ GObject.Value has generic new/free endpoints")


def test_multiple_structs_with_generic_endpoints():
    """
    Test that multiple structs get generic endpoints as expected.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Find all generic new endpoints
    generic_new_endpoints = []
    for path, operations in schema['paths'].items():
        for method, operation in operations.items():
            if operation.get('x-gi-generic') and operation.get('x-gi-constructor'):
                generic_new_endpoints.append(operation['operationId'])
    
    # Should have multiple generic constructors
    assert len(generic_new_endpoints) >= 5, \
        f"Expected at least 5 generic constructors, found {len(generic_new_endpoints)}"
    
    print(f"✓ Found {len(generic_new_endpoints)} structs with generic constructors")
    
    # Print some examples
    for op_id in generic_new_endpoints[:5]:
        print(f"  - {op_id}")


def test_typescript_generation_with_generic_constructors():
    """
    Test that TypeScript generator properly handles generic constructors.
    """
    # Generate schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Generate TypeScript
    generator = TypeScriptGenerator(schema, host='localhost', port=9000)
    typescript = generator.generate()
    
    # GstMeta should have a static new method in the TypeScript class
    assert 'export class GstMeta {' in typescript, \
        "GstMeta should be generated as a class"
    
    # The class should have a static new() method
    assert 'static async new():' in typescript or 'static async new(' in typescript, \
        "GstMeta should have a static new() constructor method"
    
    # The class should have instance methods
    assert 'async ' in typescript, \
        "GstMeta should have async methods"
    
    print("✓ TypeScript generator creates classes with generic constructors")


if __name__ == '__main__':
    print("Running generic constructor tests...")
    print()
    
    test_generic_new_endpoint_generation()
    test_generic_free_endpoint_generation()
    test_no_generic_endpoints_for_structs_with_constructors()
    test_gobject_value_generic_endpoints()
    test_multiple_structs_with_generic_endpoints()
    test_typescript_generation_with_generic_constructors()
    
    print()
    print("All tests passed! ✓")
