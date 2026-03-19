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

from .conftest import find_class_in_files


def test_gst_pipeline_inheritance(gst_typescript):
    """Test that GstPipeline extends GstBin."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GstPipeline")
    assert output, "GstPipeline class not found"
    assert "export class GstPipeline extends GstBin" in output, "GstPipeline should extend GstBin"


def test_gst_bin_inheritance(gst_typescript):
    """Test that GstBin extends GstElement."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GstBin")
    assert output, "GstBin class not found"
    assert "export class GstBin extends GstElement" in output, "GstBin should extend GstElement"


def test_gst_element_inheritance(gst_typescript):
    """Test that GstElement extends GstObject."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GstElement")
    assert output, "GstElement class not found"
    assert "export class GstElement extends GstObject" in output, "GstElement should extend GstObject"


def test_gst_object_inheritance(gst_typescript):
    """Test that GstObject extends GObjectInitiallyUnowned."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GstObject")
    assert output, "GstObject class not found"
    assert (
        "export class GstObject extends GObjectInitiallyUnowned" in output
    ), "GstObject should extend GObjectInitiallyUnowned"


def test_gobject_initially_unowned_inheritance(gst_typescript):
    """Test that GObjectInitiallyUnowned extends GObjectObject."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GObjectInitiallyUnowned")
    assert output, "GObjectInitiallyUnowned class not found"
    assert (
        "export class GObjectInitiallyUnowned extends GObjectObject" in output
    ), "GObjectInitiallyUnowned should extend GObjectObject"


def test_gobject_object_inheritance(gst_typescript):
    """Test that GObjectObject extends GObjectTypeInstance."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GObjectObject")
    assert output, "GObjectObject class not found"
    assert (
        "export class GObjectObject extends GObjectTypeInstance" in output
    ), "GObjectObject should extend GObjectTypeInstance"


def test_gobject_type_instance_is_base_class(gst_typescript):
    """Test that GObjectTypeInstance is a base class with no parent."""
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GObjectTypeInstance")
    assert output, "GObjectTypeInstance class not found"
    # Should have "export class GObjectTypeInstance {" without "extends"
    assert "export class GObjectTypeInstance {" in output, "GObjectTypeInstance should be a base class"
    assert "export class GObjectTypeInstance extends" not in output, "GObjectTypeInstance should not extend anything"


def test_gobject_base_class_structure(gst_typescript):
    """
    Test that GObjectObject has the correct structure.

    Verifies that GObjectObject includes:
    - Extends GObjectTypeInstance
    - constructor with super() call
    - castTo method
    - Does NOT have unref method (destructors are excluded from API)
    """
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GObjectObject")
    assert output, "GObjectObject class not found in any generated file"

    # Find the GObjectObject class definition
    match = re.search(r"export class GObjectObject extends GObjectTypeInstance \{(.*?)$", output, re.DOTALL)
    assert match, "GObjectObject class extending GObjectTypeInstance not found in generated TypeScript"

    gobject_class = match.group(0)

    # Verify it has the required structure
    assert (
        "protected constructor(ptr: string, transferType: transferType)" in gobject_class
    ), "GObjectObject should have constructor with transferType parameter"
    assert "super(ptr, 'none')" in gobject_class, "GObjectObject constructor should call super(ptr, 'none')"
    assert (
        "static async create(ptr: string, transferType: transferType): Promise<GObjectObject>" in gobject_class
    ), "GObjectObject should have static create method"
    # Verify that unref method is NOT present (destructors should be excluded from API)
    assert (
        "unref():" not in gobject_class
    ), "GObjectObject should NOT have unref method (destructors are excluded from API)"


def test_intermediate_classes_generated(gst_typescript):
    """
    Test that intermediate classes without instance methods are still generated.

    Verifies that GObjectInitiallyUnowned is generated as a class in the
    inheritance chain with only a static get_type method.
    """
    files_dict = gst_typescript
    output = find_class_in_files(files_dict, "GObjectInitiallyUnowned")

    # GObjectInitiallyUnowned should be generated as a class
    assert (
        "export class GObjectInitiallyUnowned extends GObjectObject" in output
    ), "GObjectInitiallyUnowned should be generated as a class extending GObjectObject"

    # It should be a class with only static methods (like get_type)
    match = re.search(r"export class GObjectInitiallyUnowned extends GObjectObject \{(.*?)$", output, re.DOTALL)
    assert match, "GObjectInitiallyUnowned class structure not found"

    class_body = match.group(1).strip()
    # Class body should contain only static methods, no instance methods
    assert "static async get_type():" in class_body, "GObjectInitiallyUnowned should have static get_type method"
    # Should not have instance methods (no 'async ' without 'static async')
    lines = class_body.split("\n")
    instance_methods = [line for line in lines if "async " in line and "static async" not in line]
    assert (
        len(instance_methods) == 0
    ), f"GObjectInitiallyUnowned should not have instance methods, but found: {instance_methods}"


def test_element_factory_inheritance(gst_typescript):
    """
    Test another inheritance chain: GstElementFactory.

    Verifies that GstElementFactory extends GstPluginFeature,
    which extends GstObject, demonstrating that the fix works
    for multiple inheritance chains.
    """
    files_dict = gst_typescript
    factory_content = find_class_in_files(files_dict, "GstElementFactory")
    assert factory_content, "GstElementFactory class not found"

    # Verify GstElementFactory inheritance
    assert (
        "export class GstElementFactory extends GstPluginFeature" in factory_content
    ), "GstElementFactory should extend GstPluginFeature"


def test_plugin_feature_inheritance(gst_typescript):
    """Test that GstPluginFeature extends GstObject."""
    files_dict = gst_typescript
    feature_content = find_class_in_files(files_dict, "GstPluginFeature")
    assert feature_content, "GstPluginFeature class not found"

    # Verify GstPluginFeature inheritance
    assert (
        "export class GstPluginFeature extends GstObject" in feature_content
    ), "GstPluginFeature should extend GstObject"


def test_typescript_generation_with_generic_constructors(gst_typescript):
    """
    Test that TypeScript generator properly handles generic constructors.
    """
    files_dict = gst_typescript
    typescript = find_class_in_files(files_dict, "GstMeta")

    # GstMeta should have a static new method in the TypeScript class
    assert "export class GstMeta {" in typescript, "GstMeta should be generated as a class"

    # The class should have a static new() method
    assert (
        "static async new():" in typescript or "static async new(" in typescript
    ), "GstMeta should have a static new() constructor method"

    # The class should have instance methods
    assert "async " in typescript, "GstMeta should have async methods"

    print("✓ TypeScript generator creates classes with generic constructors")


def test_typescript_class_generation_for_structs(gst_typescript):
    """
    Test that TypeScript generator creates classes for structs with methods.

    Uses GstBuffer as a test case.
    """
    files_dict = gst_typescript
    typescript = find_class_in_files(files_dict, "GstBuffer")

    # Verify GstBuffer is generated as a class, not an interface
    # It extends GstMiniObject
    assert (
        "export class GstBuffer extends GstMiniObject {" in typescript
    ), "GstBuffer should be generated as a class extending GstMiniObject"

    # Verify it's not also generated as an interface (avoid duplication)
    # Count occurrences - should only be the class definition
    interface_count = typescript.count("export interface GstBuffer {")
    assert interface_count == 0, f"GstBuffer should not be generated as interface, found {interface_count} occurrences"

    # Verify the class has methods
    # Check for at least one constructor
    assert (
        "static async new():" in typescript or "static async new(" in typescript
    ), "GstBuffer class should have constructor methods"

    # Check for at least one instance method
    assert "async add_meta(" in typescript, "GstBuffer class should have instance methods"

    print("✓ TypeScript generator creates class for struct with methods")


def test_typescript_class_generation_for_structs_without_methods(gst_typescript):
    """
    Test that TypeScript generator creates classes for structs without methods.

    Uses GstAllocatorPrivate as a test case.
    """
    files_dict = gst_typescript
    typescript = find_class_in_files(files_dict, "GstAllocatorPrivate")

    # Verify GstAllocatorPrivate is generated as a class
    assert "export class GstAllocatorPrivate {" in typescript, "GstAllocatorPrivate should be generated as a class"

    print("✓ TypeScript generator creates class for struct without methods")


def test_typescript_parameter_serialization(gst_typescript):
    """
    Test that TypeScript generator properly serializes parameters inline.

    Verifies that:
    - Object parameters are serialized inline based on style/explode settings
    - Path parameters with objects use the format `ptr,${this.ptr}` (explode=false)
    - Query parameters with objects use the format `'ptr,' + param.ptr` (explode=false)
    - Primitive parameters use String() conversion
    """
    files_dict = gst_typescript
    typescript = find_class_in_files(files_dict, "GLibDate")

    # Verify no serializeParam function exists (serialization is done inline)
    assert (
        "function serializeParam(" not in typescript
    ), "serializeParam function should NOT be generated - serialization should be inline"

    # Find a method with object parameter (days_between has GLibDate object parameter)
    import re

    match = re.search(r"async days_between\(date2: GLibDate\)", typescript)
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos : start_pos + 500]

        # Check that path parameter is serialized inline for objects (explode=false)
        assert (
            "ptr,${this.ptr}" in method_section
        ), "Path parameter 'self' should be serialized inline as 'ptr,${this.ptr}'"

        # Check that query parameter is serialized inline for objects (explode=false)
        assert (
            "'ptr,' + date2.ptr" in method_section or '"ptr," + date2.ptr' in method_section
        ), "Query parameter 'date2' should be serialized inline as 'ptr,' + date2.ptr"

    # Find a method with primitive parameter (set_day has number parameter)
    match = re.search(r"async set_day\(day: number\)", typescript)
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos : start_pos + 500]

        # Primitive parameters should use String() conversion
        assert "String(day)" in method_section, "Primitive parameter 'day' should use String() conversion"

        # Path parameter should still be serialized for object
        assert (
            "ptr,${this.ptr}" in method_section
        ), "Path parameter 'self' should be serialized inline even for methods with primitive query params"

    print("✓ TypeScript generator serializes parameters inline with correct style/explode")


def test_typescript_object_return_value_instantiation(gst_typescript):
    """
    Test that TypeScript generator properly instantiates object return values.

    Verifies that:
    - Methods returning objects/structs instantiate them from the ptr field
    - The instantiation code checks if data.return is an object with a ptr field
    - Primitive return values are returned directly without instantiation
    """
    files_dict = gst_typescript
    typescript = find_class_in_files(files_dict, "GstAllocationParams")

    # Find a method that returns an object (copy method of GstAllocationParams)
    import re

    # Look for the copy method in GstAllocationParams class
    gst_allocation_match = re.search(r"export class GstAllocationParams.*?$", typescript, re.DOTALL)
    if gst_allocation_match:
        allocation_class = gst_allocation_match.group(0)
        copy_match = re.search(
            r"async copy\(\): Promise<GstAllocationParams>.*?(?=\n  async |\n  static |\n})",
            allocation_class,
            re.DOTALL,
        )
        if copy_match:
            method_section = copy_match.group(0)

            # Check that it instantiates the object from ptr
            assert (
                "new GstAllocationParams(data.return.ptr)" in method_section
            ), "Method returning object should instantiate it using 'new GstAllocationParams(data.return.ptr)'"

            # Check that it checks for the ptr field
            assert (
                "typeof data.return === 'object' && 'ptr' in data.return" in method_section
            ), "Method returning object should check if data.return is an object with ptr field"

    print("✓ TypeScript generator instantiates object return values correctly")


def test_typescript_primitive_return_values(gst_typescript):
    """
    Test that methods returning primitives don't try to instantiate objects.

    Verifies that primitive return values are returned directly without instantiation.
    """
    files_dict = gst_typescript

    # Specifically check Gst.version_string for correct primitive return handling
    gst_file = None
    for file_path in files_dict:
        if file_path.endswith("/Gst.ts") or file_path.endswith("/Gst/Gst.ts"):
            gst_file = file_path
            break
    assert gst_file, "Gst.ts file not found in generated files"
    content = files_dict[gst_file]

    # Find the version_string method
    match = re.search(
        r"export async function version_string\([^)]*\): Promise<string> \{(.*?)^\}", content, re.DOTALL | re.MULTILINE
    )
    assert match, "version_string() method not found in Gst.ts"
    method_section = match.group(0)

    # It should return data.return directly
    assert (
        "return data.return;" in method_section
    ), "version_string() should return data.return directly for primitive return value"

    # It should NOT have object instantiation logic
    assert (
        "new " not in method_section or "new URL" in method_section
    ), "version_string() should not instantiate objects for primitive return value (except new URL)"
    assert (
        "data.return.ptr" not in method_section
    ), "version_string() should not access data.return.ptr for primitive return value"

    print("\u2713 TypeScript generator handles primitive return values correctly for Gst.version_string()")


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
    files_dict = gst_typescript
    import re

    # Find GstObject class and verify it has get_g_value_array method
    gst_object_content = find_class_in_files(files_dict, "GstObject")
    assert gst_object_content, "GstObject class not found in generated TypeScript"

    gst_object_match = re.search(r"export class GstObject extends.*?$", gst_object_content, re.DOTALL)
    assert gst_object_match, "GstObject class pattern not found"
    gst_object_class = gst_object_match.group(0)

    # Verify GstObject has get_g_value_array method (without suffix)
    assert re.search(r"async get_g_value_array\(", gst_object_class), "GstObject should have get_g_value_array method"

    # Verify GstObject doesn't have get_g_value_array_2 (it's the parent)
    assert not re.search(
        r"async get_g_value_array_2\(", gst_object_class
    ), "GstObject should not have get_g_value_array_2 method (it's the parent)"

    # Find GstControlBinding class and verify it has get_g_value_array_2 method
    control_binding_content = find_class_in_files(files_dict, "GstControlBinding")
    assert control_binding_content, "GstControlBinding class not found in generated TypeScript"

    control_binding_match = re.search(r"export class GstControlBinding extends.*?$", control_binding_content, re.DOTALL)
    assert control_binding_match, "GstControlBinding class pattern not found"
    control_binding_class = control_binding_match.group(0)

    # Verify GstControlBinding has get_g_value_array_2 method (with suffix)
    assert re.search(
        r"async get_g_value_array_2\(", control_binding_class
    ), "GstControlBinding should have get_g_value_array_2 method (renamed to avoid conflict with parent)"

    # Verify GstControlBinding doesn't have get_g_value_array (without suffix)
    # The method name should be followed directly by ( without any _ suffix
    assert (
        "async get_g_value_array(" not in control_binding_class or "async get_g_value_array_" in control_binding_class
    ), "GstControlBinding should not have get_g_value_array method (conflicts with parent)"

    print("✓ TypeScript generator handles duplicate method names in inheritance chain correctly")


def test_typescript_destructors_included_in_api(gst_typescript):
    """
    Test that methods marked as x-gi-destructor are included in the TypeScript API.

    Verifies that:
    - Destructors like 'free' and 'unref' are generated as callable methods
    - They are needed for proper memory management when API calls fail
    - The FinalizationRegistry system is still generated for automatic cleanup
    - Struct registries are properly generated for cleanup
    """
    files_dict = gst_typescript
    import re

    # Test 1: GObjectTypeInterface should have a callable 'free' method
    type_interface_content = find_class_in_files(files_dict, "GObjectTypeInterface")
    assert type_interface_content, "GObjectTypeInterface class not found in generated TypeScript"

    type_interface_match = re.search(r"export class GObjectTypeInterface.*?$", type_interface_content, re.DOTALL)
    assert type_interface_match, "GObjectTypeInterface class pattern not found"
    class_content = type_interface_match.group(0)

    # Should have a callable free method for manual cleanup
    assert "async free(" in class_content, "GObjectTypeInterface should have a callable free method for manual cleanup"

    # Test 2: GObjectObject should have a callable 'unref' method
    gobject_content = find_class_in_files(files_dict, "GObjectObject")
    assert gobject_content, "GObjectObject class not found in generated TypeScript"

    gobject_match = re.search(r"export class GObjectObject.*?$", gobject_content, re.DOTALL)
    assert gobject_match, "GObjectObject class pattern not found"
    gobject_class_content = gobject_match.group(0)

    # Should have a callable unref method for manual cleanup
    assert (
        "async unref(" in gobject_class_content
    ), "GObjectObject should have a callable unref method for manual cleanup"

    # Test 3: Static create() method should conditionally register with FinalizationRegistry
    assert (
        "static async create(ptr: string, transferType: transferType)" in class_content
    ), "GObjectTypeInterface should have static create() method"
    assert (
        "gobjecttypeinterfaceRegistry.register(instance, ptr)" in class_content
    ), "Static create() method should register objects with FinalizationRegistry based on transferType"

    print("✓ TypeScript generator includes destructors in API for proper memory management")


def test_finalization_registry_present(gst_typescript):
    """Test that FinalizationRegistry is present for automatic memory management."""
    files_dict = gst_typescript

    # Check a few files for FinalizationRegistry
    found_finalization = False
    found_registry = False

    for file_path, content in files_dict.items():
        if "FinalizationRegistry" in content:
            found_finalization = True
        if "gobjecttypeinterfaceRegistry" in content:
            found_registry = True
        if found_finalization and found_registry:
            break

    assert found_finalization, "FinalizationRegistry should be present for automatic memory management"
    assert found_registry, "gobjecttypeinterfaceRegistry should be present for GObjectTypeInterface cleanup"

    print("✓ Finalization registry system is properly generated")


def test_param_class():
    """Test the new Param class functionality with Type class."""
    from girest.generator import Param, Type, TypeScriptGenerator

    # Create a minimal generator for testing
    schema = {"info": {"title": "Test", "version": "1.0"}, "components": {"schemas": {}}, "paths": {}}
    generator = TypeScriptGenerator(schema)

    # Test basic parameter parsing
    param_def = {
        "name": "test_param",
        "schema": {"type": "string"},
        "required": True,
        "in": "query",
        "description": "A test parameter",
    }

    param = Param(param_def, generator)

    assert param.name == "test_param"
    assert param.required
    assert param.location == "query"
    assert param.description == "A test parameter"
    assert param.type.lang_type == "string"
    assert param.type.type == "string"

    # Test parameter with reference type
    ref_param_def = {
        "name": "object_param",
        "schema": {"$ref": "#/components/schemas/GstElement"},
        "required": False,
        "in": "query",
    }

    # Create a mock GstElement schema
    class MockGstElement:
        def __init__(self):
            self.name = "GstElement"
            self.valid_name = "GstElement"

    generator.schema_objects_cache["GstElement"] = MockGstElement()

    ref_param = Param(ref_param_def, generator)

    assert ref_param.name == "object_param"
    assert not ref_param.required
    assert ref_param.type.ref_schema.name == "GstElement"
    assert ref_param.type.is_ref
    assert ref_param.type.lang_type == "GstElement"

    # Test Type class directly
    type_obj = Type({"type": "number"}, generator)
    assert type_obj.lang_type == "number"

    # Create a proper mock schema for TestType
    class MockTestType:
        def __init__(self):
            self.name = "TestType"
            self.valid_name = "TestType"

    generator.schema_objects_cache["TestType"] = MockTestType()

    ref_type_obj = Type({"$ref": "#/components/schemas/TestType"}, generator)
    assert ref_type_obj.ref_schema.name == "TestType"
    assert ref_type_obj.lang_type == "TestType"

    print("✓ Param class correctly parses parameter definitions and handles types with new Type class")
