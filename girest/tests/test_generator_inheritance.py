#!/usr/bin/env python3
"""
Tests for TypeScript generator inheritance handling.

These tests verify that the TypeScript generator correctly respects
the GObject inheritance chain when generating class definitions.
"""
import sys
import os
import re

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(os.path.dirname(current_dir), 'girest')
sys.path.insert(0, girest_dir)

from main import GIRest
from generator import TypeScriptGenerator


def test_gst_inheritance_chain():
    """
    Test that GStreamer classes have the correct inheritance chain.
    
    Verifies that:
    - GstPipeline extends GstBin
    - GstBin extends GstElement
    - GstElement extends GstObject
    - GstObject extends GObjectInitiallyUnowned
    - GObjectInitiallyUnowned extends GObjectObject
    - GObjectObject is the base class
    """
    # Generate the OpenAPI schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    openapi_schema = spec.to_dict()
    
    # Generate TypeScript bindings with base_url (full implementation)
    ts_gen = TypeScriptGenerator(openapi_schema, host='localhost', port=9000)
    output = ts_gen.generate()
    
    # Define expected inheritance relationships
    expected_classes = [
        ('GObjectObject', None),  # Base class with no parent
        ('GObjectInitiallyUnowned', 'GObjectObject'),
        ('GstObject', 'GObjectInitiallyUnowned'),
        ('GstElement', 'GstObject'),
        ('GstBin', 'GstElement'),
        ('GstPipeline', 'GstBin'),
    ]
    
    # Verify each class has the correct parent
    for class_name, expected_parent in expected_classes:
        if expected_parent:
            # Class should extend its parent
            pattern = f"export class {class_name} extends {expected_parent}"
            assert pattern in output, (
                f"Expected '{class_name}' to extend '{expected_parent}', "
                f"but pattern not found in generated TypeScript"
            )
        else:
            # Base class should not extend anything
            pattern = f"export class {class_name} {{"
            assert pattern in output, (
                f"Expected '{class_name}' to be a base class (no extends), "
                f"but pattern not found in generated TypeScript"
            )


def test_gobject_base_class_structure():
    """
    Test that GObjectObject has the correct structure as a base class.
    
    Verifies that GObjectObject includes:
    - ptr property
    - constructor
    - unref method
    """
    # Generate the OpenAPI schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    openapi_schema = spec.to_dict()
    
    # Generate TypeScript bindings with base_url
    ts_gen = TypeScriptGenerator(openapi_schema, host='localhost', port=9000)
    output = ts_gen.generate()
    
    # Find the GObjectObject class definition
    match = re.search(
        r'export class GObjectObject \{(.*?)(?=\nexport )',
        output,
        re.DOTALL
    )
    assert match, "GObjectObject class not found in generated TypeScript"
    
    gobject_class = match.group(0)
    
    # Verify it has the required structure
    assert 'ptr!: string;' in gobject_class, "GObjectObject should have ptr property"
    assert 'constructor(ptr?: string)' in gobject_class, "GObjectObject should have constructor"
    assert 'unref():' in gobject_class, "GObjectObject should have unref method"


def test_intermediate_classes_generated():
    """
    Test that intermediate classes without methods are still generated.
    
    Verifies that GObjectInitiallyUnowned (which has no methods) is generated
    as a class in the inheritance chain, not just as an interface.
    """
    # Generate the OpenAPI schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    openapi_schema = spec.to_dict()
    
    # Generate TypeScript bindings with base_url
    ts_gen = TypeScriptGenerator(openapi_schema, host='localhost', port=9000)
    output = ts_gen.generate()
    
    # GObjectInitiallyUnowned should be generated as a class
    assert 'export class GObjectInitiallyUnowned extends GObjectObject' in output, (
        "GObjectInitiallyUnowned should be generated as a class extending GObjectObject"
    )
    
    # It should be an empty class (no methods)
    match = re.search(
        r'export class GObjectInitiallyUnowned extends GObjectObject \{(.*?)\}',
        output,
        re.DOTALL
    )
    assert match, "GObjectInitiallyUnowned class structure not found"
    
    class_body = match.group(1).strip()
    # Class body should be empty or contain only whitespace
    assert len(class_body) == 0, (
        "GObjectInitiallyUnowned should be an empty class "
        f"(no methods or properties), but found: {class_body}"
    )


def test_element_factory_inheritance():
    """
    Test another inheritance chain: GstElementFactory.
    
    Verifies that GstElementFactory extends GstPluginFeature,
    which extends GstObject, demonstrating that the fix works
    for multiple inheritance chains.
    """
    # Generate the OpenAPI schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    openapi_schema = spec.to_dict()
    
    # Generate TypeScript bindings with base_url
    ts_gen = TypeScriptGenerator(openapi_schema, host='localhost', port=9000)
    output = ts_gen.generate()
    
    # Verify GstElementFactory inheritance
    assert 'export class GstElementFactory extends GstPluginFeature' in output, (
        "GstElementFactory should extend GstPluginFeature"
    )
    
    # Verify GstPluginFeature inheritance
    assert 'export class GstPluginFeature extends GstObject' in output, (
        "GstPluginFeature should extend GstObject"
    )


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])
