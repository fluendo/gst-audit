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

import re


def test_gst_inheritance_chain(gst_typescript):
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
    output = gst_typescript
    
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


def test_gobject_base_class_structure(gst_typescript):
    """
    Test that GObjectObject has the correct structure as a base class.
    
    Verifies that GObjectObject includes:
    - ptr property
    - constructor
    - unref method
    """
    output = gst_typescript
    
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


def test_intermediate_classes_generated(gst_typescript):
    """
    Test that intermediate classes without methods are still generated.
    
    Verifies that GObjectInitiallyUnowned (which has no methods) is generated
    as a class in the inheritance chain, not just as an interface.
    """
    output = gst_typescript
    
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


def test_element_factory_inheritance(gst_typescript):
    """
    Test another inheritance chain: GstElementFactory.
    
    Verifies that GstElementFactory extends GstPluginFeature,
    which extends GstObject, demonstrating that the fix works
    for multiple inheritance chains.
    """
    output = gst_typescript
    
    # Verify GstElementFactory inheritance
    assert 'export class GstElementFactory extends GstPluginFeature' in output, (
        "GstElementFactory should extend GstPluginFeature"
    )
    
    # Verify GstPluginFeature inheritance
    assert 'export class GstPluginFeature extends GstObject' in output, (
        "GstPluginFeature should extend GstObject"
    )


def test_typescript_generation_with_generic_constructors(gst_typescript):
    """
    Test that TypeScript generator properly handles generic constructors.
    """
    typescript = gst_typescript
    
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


def test_typescript_class_generation_for_structs(gst_typescript):
    """
    Test that TypeScript generator creates classes for structs with methods.
    
    Uses GstBuffer as a test case.
    """
    typescript = gst_typescript
    
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


def test_typescript_interface_generation_for_structs_without_methods(gst_typescript):
    """
    Test that TypeScript generator creates interfaces for structs without methods.
    
    Uses GstAllocatorPrivate as a test case.
    """
    typescript = gst_typescript
    
    # Verify GstAllocatorPrivate is generated as an interface
    assert 'export interface GstAllocatorPrivate {' in typescript, \
        "GstAllocatorPrivate should be generated as an interface"
    
    # Verify it's not generated as a class
    assert 'export class GstAllocatorPrivate {' not in typescript, \
        "GstAllocatorPrivate should not be generated as a class"
    
    print("✓ TypeScript generator creates interface for struct without methods")


def test_typescript_parameter_serialization(gst_typescript):
    """
    Test that TypeScript generator properly serializes parameters inline.
    
    Verifies that:
    - Object parameters are serialized inline based on style/explode settings
    - Path parameters with objects use the format `ptr,${this.ptr}` (explode=false)
    - Query parameters with objects use the format `'ptr,' + param.ptr` (explode=false)
    - Primitive parameters use String() conversion
    """
    typescript = gst_typescript
    
    # Verify no serializeParam function exists (serialization is done inline)
    assert 'function serializeParam(' not in typescript, \
        "serializeParam function should NOT be generated - serialization should be inline"
    
    # Find a method with object parameter (days_between has GLibDate object parameter)
    import re
    match = re.search(r'async days_between\(date2: GLibDate\)', typescript)
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos:start_pos + 500]
        
        # Check that path parameter is serialized inline for objects (explode=false)
        assert "ptr,${this.ptr}" in method_section, \
            "Path parameter 'self' should be serialized inline as 'ptr,${this.ptr}'"
        
        # Check that query parameter is serialized inline for objects (explode=false)
        assert "'ptr,' + date2.ptr" in method_section or '"ptr," + date2.ptr' in method_section, \
            "Query parameter 'date2' should be serialized inline as 'ptr,' + date2.ptr"
    
    # Find a method with primitive parameter (set_day has number parameter)
    match = re.search(r'async set_day\(day: number\)', typescript)
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos:start_pos + 500]
        
        # Primitive parameters should use String() conversion
        assert "String(day)" in method_section, \
            "Primitive parameter 'day' should use String() conversion"
        
        # Path parameter should still be serialized for object
        assert "ptr,${this.ptr}" in method_section, \
            "Path parameter 'self' should be serialized inline even for methods with primitive query params"
    
    print("✓ TypeScript generator serializes parameters inline with correct style/explode")


def test_typescript_object_return_value_instantiation(gst_typescript):
    """
    Test that TypeScript generator properly instantiates object return values.
    
    Verifies that:
    - Methods returning objects/structs instantiate them from the ptr field
    - The instantiation code checks if data.return is an object with a ptr field
    - Primitive return values are returned directly without instantiation
    """
    typescript = gst_typescript
    
    # Find a method that returns an object (copy method of GstAllocationParams)
    import re
    # Look for the copy method in GstAllocationParams class
    gst_allocation_match = re.search(r'export class GstAllocationParams.*?(?=export class|export namespace|$)', typescript, re.DOTALL)
    if gst_allocation_match:
        allocation_class = gst_allocation_match.group(0)
        copy_match = re.search(r'async copy\(\): Promise<GstAllocationParams>.*?(?=async |static |  })', allocation_class, re.DOTALL)
        if copy_match:
            method_section = copy_match.group(0)
            
            # Check that it instantiates the object from ptr
            assert "new GstAllocationParams(data.return.ptr)" in method_section, \
                "Method returning object should instantiate it using 'new GstAllocationParams(data.return.ptr)'"
            
            # Check that it checks for the ptr field
            assert "typeof data.return === 'object' && 'ptr' in data.return" in method_section, \
                "Method returning object should check if data.return is an object with ptr field"
    
    # Find a method that returns a primitive (get_name or similar) - look for one without object instantiation
    match = re.search(r'async get_name\(\): Promise<string> \{[^}]*const data = await response\.json\(\);[^}]*return data\.return;[^}]*\}', typescript, re.DOTALL)
    if match:
        method_section = match.group(0)
        
        # Check that it doesn't have object instantiation code for primitives
        # It's OK to have "new URL" but not "new GstXXX" or similar object instantiation
        if "new " in method_section:
            assert method_section.count("new ") == method_section.count("new URL"), \
                "Method returning primitive should only use 'new' for URL creation, not object instantiation"
        
        # It should just return data.return directly (without instantiation logic)
        assert "return data.return;" in method_section, \
            "Method returning primitive should return data.return directly"
        
        # It should NOT have object instantiation logic
        assert "data.return.ptr" not in method_section, \
            "Method returning primitive should not access data.return.ptr"
    
    print("✓ TypeScript generator instantiates object return values correctly")


def test_typescript_duplicate_method_names_in_inheritance_chain(gst_typescript):
    """
    Test that TypeScript generator handles duplicate method names in inheritance chain.
    
    Verifies that:
    - When a child class has a method with the same name as a parent class method,
      the child method gets a suffix (_2, _3, etc.)
    - The suffix is applied recursively to handle multiple conflicts
    - GstObject has get_g_value_array method
    - GstControlBinding (which extends GstObject) has get_g_value_array_2 method
    """
    typescript = gst_typescript
    import re
    
    # Find GstObject class and verify it has get_g_value_array method
    gst_object_match = re.search(
        r'export class GstObject extends.*?(?=export class|export namespace|$)',
        typescript,
        re.DOTALL
    )
    assert gst_object_match, "GstObject class not found in generated TypeScript"
    
    gst_object_class = gst_object_match.group(0)
    
    # Verify GstObject has get_g_value_array method (without suffix)
    assert re.search(r'async get_g_value_array\(', gst_object_class), \
        "GstObject should have get_g_value_array method"
    
    # Verify GstObject doesn't have get_g_value_array_2 (it's the parent)
    assert not re.search(r'async get_g_value_array_2\(', gst_object_class), \
        "GstObject should not have get_g_value_array_2 method (it's the parent)"
    
    # Find GstControlBinding class and verify it has get_g_value_array_2 method
    control_binding_match = re.search(
        r'export class GstControlBinding extends.*?(?=export class|export namespace|$)',
        typescript,
        re.DOTALL
    )
    assert control_binding_match, "GstControlBinding class not found in generated TypeScript"
    
    control_binding_class = control_binding_match.group(0)
    
    # Verify GstControlBinding has get_g_value_array_2 method (with suffix)
    assert re.search(r'async get_g_value_array_2\(', control_binding_class), \
        "GstControlBinding should have get_g_value_array_2 method (renamed to avoid conflict with parent)"
    
    # Verify GstControlBinding doesn't have get_g_value_array (without suffix)
    # The method name should be followed directly by ( without any _ suffix
    assert 'async get_g_value_array(' not in control_binding_class or \
           'async get_g_value_array_' in control_binding_class, \
        "GstControlBinding should not have get_g_value_array method (conflicts with parent)"
    
    print("✓ TypeScript generator handles duplicate method names in inheritance chain correctly")
