#!/usr/bin/env python3
"""
Tests for TypeScript generator in GIRest.

These tests verify that the TypeScript generator (generator.py) correctly
generates TypeScript client bindings from OpenAPI schemas, including:
- Proper inheritance handling
- Class vs interface generation
- Generic constructor handling
- Method generation
"""

import sys
import os
import re

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.generator import TypeScriptGenerator


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
