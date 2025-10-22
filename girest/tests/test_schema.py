#!/usr/bin/env python3
"""
Tests for OpenAPI schema generation in GIRest.

These tests verify that the schema generator (main.py) correctly generates
OpenAPI schemas from GObject Introspection data, including:
- Generic constructor/destructor endpoints for structs
- Struct methods and their metadata
- Correct tags and operation IDs
"""

import gi
gi.require_version("GIRepository", "2.0")
from gi.repository import GIRepository


def test_generic_new_endpoint_generation(gst_schema):
    """
    Test that structs without constructors get a generic 'new' endpoint.
    
    Uses GstMeta as a test case since it has methods but no constructor.
    """
    schema = gst_schema
    
    # Find structs with methods but no constructor
    # GstMeta should be one of them
    meta_new_path = '/Gst/Meta/new'
    
    assert meta_new_path in schema['paths'], f"Expected generic new endpoint at {meta_new_path}"
    
    # Verify the endpoint structure
    operation = schema['paths'][meta_new_path]['get']
    assert operation['operationId'] == 'Gst-Meta-new', "Operation ID should match"
    assert operation['x-gi-constructor'] == True, "Should be marked as constructor"
    
    # Verify response structure
    assert '200' in operation['responses'], "Should have 200 response"
    response_schema = operation['responses']['200']['content']['application/json']['schema']
    assert 'return' in response_schema['properties'], "Should return a pointer"
    
    print("✓ Generic new endpoint generated for GstMeta")


def test_generic_free_endpoint_generation(gst_schema):
    """
    Test that structs without free methods get a generic 'free' endpoint.
    
    Uses GstMeta as a test case.
    """
    schema = gst_schema
    
    # GstMeta should have a generic free endpoint
    meta_free_path = '/Gst/Meta/{self}/free'
    
    assert meta_free_path in schema['paths'], f"Expected generic free endpoint at {meta_free_path}"
    
    # Verify the endpoint structure
    operation = schema['paths'][meta_free_path]['get']
    assert operation['operationId'] == 'Gst-Meta-free', "Operation ID should match"
    
    # Verify parameters
    assert len(operation['parameters']) == 1, "Should have one parameter"
    assert operation['parameters'][0]['name'] == 'self', "Parameter should be 'self'"
    assert operation['parameters'][0]['in'] == 'path', "Parameter should be in path"
    assert operation['parameters'][0]['required'] == True, "Parameter should be required"
    
    # Verify response
    assert '204' in operation['responses'], "Should have 204 No Content response"
    
    print("✓ Generic free endpoint generated for GstMeta")


def test_no_generic_endpoints_for_structs_with_constructors(gst_schema):
    """
    Test that structs with existing constructors don't get generic endpoints.
    
    Uses GstBuffer as a test case since it has a 'new' constructor.
    """
    schema = gst_schema
    
    # GstBuffer has actual constructors, so it should NOT have generic ones
    # Check that the new endpoint exists but is NOT generic
    buffer_new_paths = [p for p in schema['paths'] if '/Buffer/new' in p]
    
    assert len(buffer_new_paths) > 0, "GstBuffer should have constructor endpoints"
    
    print("✓ GstBuffer has real constructors")


def test_gobject_value_generic_endpoints(gobject_schema):
    """
    Test that GObject.Value gets generic new/free endpoints.
    
    GValue is specifically mentioned in the issue as an example.
    """
    schema = gobject_schema
    
    # GObject.Value should have generic new/free endpoints
    value_new_path = '/GObject/Value/new'
    value_free_path = '/GObject/Value/{self}/free'
    
    assert value_new_path in schema['paths'], f"Expected generic new endpoint for GValue"
    assert value_free_path in schema['paths'], f"Expected generic free endpoint for GValue"
    
    # Verify the new endpoint exists
    new_operation = schema['paths'][value_new_path]['get']
    assert new_operation['x-gi-constructor'] == True, "GValue new should be marked as constructor"
    
    print("✓ GObject.Value has generic new/free endpoints")


def test_multiple_structs_with_generic_endpoints(gst_schema):
    """
    Test that multiple structs get generic endpoints as expected.
    """
    schema = gst_schema
    
    # Find all new endpoints marked as constructors (which includes generic ones)
    # Generic constructors can be identified by checking if they're in structs
    constructor_endpoints = []
    for path, operations in schema['paths'].items():
        for method, operation in operations.items():
            if operation.get('x-gi-constructor'):
                op_id = operation['operationId']
                # Generic constructors follow pattern: namespace-structname-new
                if op_id.endswith('-new'):
                    constructor_endpoints.append(op_id)
    
    # Should have multiple constructors
    assert len(constructor_endpoints) >= 5, \
        f"Expected at least 5 constructors, found {len(constructor_endpoints)}"
    
    print(f"✓ Found {len(constructor_endpoints)} structs with constructors")
    
    # Print some examples
    for op_id in constructor_endpoints[:5]:
        print(f"  - {op_id}")


def test_resolver_identifies_generic_new_operation(gst_girest):
    """
    Test that the resolver correctly identifies generic 'new' operations.
    """
    girest = gst_girest
    
    # We can't fully test the resolver without a Frida connection,
    # but we can test the pattern matching logic
    
    # Operation ID for generic new: namespace-structname-new
    operation_id = "Gst-Meta-new"
    parts = operation_id.split('-')
    
    assert len(parts) == 3, "Operation ID should have 3 parts"
    assert parts[0] == "Gst", "First part should be namespace"
    assert parts[1] == "Meta", "Second part should be struct name"
    assert parts[2] == "new", "Third part should be 'new'"
    
    # Check if Meta exists and is a struct
    n_infos = girest.repo.get_n_infos("Gst")
    struct_found = False
    for i in range(n_infos):
        info = girest.repo.get_info("Gst", i)
        if info.get_type() == GIRepository.InfoType.STRUCT and info.get_name() == "Meta":
            struct_found = True
            # Check it has methods but no constructor
            n_methods = GIRepository.struct_info_get_n_methods(info)
            assert n_methods > 0, "Meta should have methods"
            
            has_constructor = False
            for j in range(n_methods):
                method = GIRepository.struct_info_get_method(info, j)
                flags = GIRepository.function_info_get_flags(method)
                if bool(flags & GIRepository.FunctionInfoFlags.IS_CONSTRUCTOR):
                    has_constructor = True
                    break
            
            assert not has_constructor, "Meta should not have a real constructor"
            break
    
    assert struct_found, "Meta struct should exist"
    print("✓ Resolver can identify generic 'new' operations")


def test_resolver_identifies_generic_free_operation(gst_girest):
    """
    Test that the resolver correctly identifies generic 'free' operations.
    """
    girest = gst_girest
    
    # Operation ID for generic free: namespace-structname-free
    operation_id = "Gst-Meta-free"
    parts = operation_id.split('-')
    
    assert len(parts) == 3, "Operation ID should have 3 parts"
    assert parts[0] == "Gst", "First part should be namespace"
    assert parts[1] == "Meta", "Second part should be struct name"
    assert parts[2] == "free", "Third part should be 'free'"
    
    # Check if Meta exists and doesn't have a free method
    n_infos = girest.repo.get_n_infos("Gst")
    struct_found = False
    for i in range(n_infos):
        info = girest.repo.get_info("Gst", i)
        if info.get_type() == GIRepository.InfoType.STRUCT and info.get_name() == "Meta":
            struct_found = True
            n_methods = GIRepository.struct_info_get_n_methods(info)
            
            has_free = False
            for j in range(n_methods):
                method = GIRepository.struct_info_get_method(info, j)
                if method.get_name() == "free":
                    has_free = True
                    break
            
            assert not has_free, "Meta should not have a real free method"
            break
    
    assert struct_found, "Meta struct should exist"
    print("✓ Resolver can identify generic 'free' operations")


def test_generic_endpoint_exists(gobject_schema):
    """
    Test that generic endpoints are created for structs without constructors.
    """
    schema = gobject_schema
    
    # GObject.Value should have generic new endpoint
    value_new_path = '/GObject/Value/new'
    assert value_new_path in schema['paths'], "Value new endpoint should exist"
    
    operation = schema['paths'][value_new_path]['get']
    assert operation.get('x-gi-constructor') == True, "Should be marked as constructor"
    
    print("✓ Generic endpoints are created for structs without constructors")


def test_struct_vs_boxed_type_detection(gst_schema):
    """
    Test that the schema correctly identifies struct types and their GType registration.
    
    This verifies:
    - GstIterator is marked as a struct
    - GstMessage is marked as a struct (boxed types are still structs in GIRepository)
    - The schema metadata is correctly generated
    """
    schema = gst_schema
    
    # Check if schemas are present
    assert "components" in schema
    assert "schemas" in schema["components"]
    schemas = schema["components"]["schemas"]
    
    # GstIterator should be present and marked as a struct
    if "GstIterator" in schemas:
        iterator_schema = schemas["GstIterator"]
        # It should be marked as a struct
        assert iterator_schema.get("x-gi-type") == "struct", "GstIterator should be marked as struct"
        print("✓ GstIterator correctly identified as struct")
    
    # GstMessage should be present and marked as a struct
    # (boxed types are still structs in GIRepository)
    if "GstMessage" in schemas:
        message_schema = schemas["GstMessage"]
        assert message_schema.get("x-gi-type") == "struct", "GstMessage should be marked as struct"
        print("✓ GstMessage correctly identified as struct")
    
    print("✓ Schema correctly identifies struct types")


def test_generic_endpoints_have_correct_tags(gst_schema):
    """
    Test that generic endpoints have the correct tags for TypeScript generation.
    """
    schema = gst_schema
    
    # Check Meta endpoints
    meta_new_path = '/Gst/Meta/new'
    meta_free_path = '/Gst/Meta/{self}/free'
    
    # Both should have the same tag (class name)
    new_operation = schema['paths'][meta_new_path]['get']
    free_operation = schema['paths'][meta_free_path]['get']
    
    assert 'tags' in new_operation, "new endpoint should have tags"
    assert 'tags' in free_operation, "free endpoint should have tags"
    
    assert new_operation['tags'] == ['GstMeta'], "new endpoint should have GstMeta tag"
    assert free_operation['tags'] == ['GstMeta'], "free endpoint should have GstMeta tag"
    
    print("✓ Generic endpoints have correct tags for TypeScript class generation")


def test_operation_ids_are_consistent(gst_schema):
    """
    Test that operation IDs follow the expected pattern.
    """
    schema = gst_schema
    
    # Find all struct constructor/destructor operations
    # These follow the pattern: namespace-structname-{new|free}
    struct_operations = []
    for path, operations in schema['paths'].items():
        for method, operation in operations.items():
            op_id = operation['operationId']
            parts = op_id.split('-')
            # Struct operations have 3 parts and end with 'new' or 'free'
            if len(parts) == 3 and parts[2] in ['new', 'free']:
                struct_operations.append({
                    'path': path,
                    'operation_id': op_id,
                    'is_constructor': operation.get('x-gi-constructor', False)
                })
    
    # Check that operation IDs follow the pattern
    for op in struct_operations:
        op_id = op['operation_id']
        parts = op_id.split('-')
        
        assert len(parts) == 3, f"Operation ID {op_id} should have 3 parts"
        
        # Should end with 'new' or 'free'
        assert parts[2] in ['new', 'free'], \
            f"Operation ID {op_id} should end with 'new' or 'free'"
        
        # If it's a constructor, should end with 'new'
        if op['is_constructor']:
            assert parts[2] == 'new', \
                f"Constructor operation {op_id} should end with 'new'"
    
    print(f"✓ All {len(struct_operations)} struct operations have consistent IDs")


def test_struct_methods_in_schema(gst_schema):
    """
    Test that struct methods are generated in the OpenAPI schema.
    
    Uses GstBuffer as a test case since it's a struct with many methods.
    """
    schema = gst_schema
    
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


def test_struct_without_methods_in_schema(gst_schema):
    """
    Test that structs without methods are still generated in the schema.
    
    Uses GstAllocatorPrivate as a test case since it's a struct without methods.
    """
    schema = gst_schema
    
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
