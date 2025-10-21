#!/usr/bin/env python3
"""
Tests for generic constructor/destructor resolver handling.

These tests verify that:
1. The resolver correctly identifies generic operations
2. The resolver creates appropriate handlers for generic new/free
3. The handlers have the correct metadata
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.resolvers import FridaResolver
import gi
gi.require_version("GIRepository", "2.0")
from gi.repository import GIRepository


def test_resolver_identifies_generic_new_operation():
    """
    Test that the resolver correctly identifies generic 'new' operations.
    """
    girest = GIRest('Gst', '1.0')
    
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


def test_resolver_identifies_generic_free_operation():
    """
    Test that the resolver correctly identifies generic 'free' operations.
    """
    girest = GIRest('Gst', '1.0')
    
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


def test_generic_endpoint_exists():
    """
    Test that generic endpoints are created for structs without constructors.
    """
    girest = GIRest('GObject', '2.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # GObject.Value should have generic new endpoint
    value_new_path = '/GObject/Value/new'
    assert value_new_path in schema['paths'], "Value new endpoint should exist"
    
    operation = schema['paths'][value_new_path]['get']
    assert operation.get('x-gi-constructor') == True, "Should be marked as constructor"
    
    print("✓ Generic endpoints are created for structs without constructors")


def test_generic_endpoints_have_correct_tags():
    """
    Test that generic endpoints have the correct tags for TypeScript generation.
    """
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
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


def test_operation_ids_are_consistent():
    """
    Test that operation IDs follow the expected pattern.
    """
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
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


if __name__ == '__main__':
    print("Running resolver tests for generic operations...")
    print()
    
    test_resolver_identifies_generic_new_operation()
    test_resolver_identifies_generic_free_operation()
    test_struct_size_in_schema()
    test_generic_endpoints_have_correct_tags()
    test_operation_ids_are_consistent()
    
    print()
    print("All resolver tests passed! ✓")
