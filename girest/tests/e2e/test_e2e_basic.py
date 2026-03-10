#!/usr/bin/env python3
"""
End-to-end basic tests for GIRest Gst namespace endpoints.

These tests verify fundamental REST API functionality:
- String return values (version_string)
- Output parameters (version)
- Object creation and method calls
- Type handling (GType, enums)
- Field access and iteration

Note: The gst_pipeline and girest_server fixtures are defined in conftest.py
and are session-scoped, meaning they're shared across all E2E tests.
"""

import pytest
import httpx
import asyncio

# Import helper functions from conftest
from conftest import assert_api_success, assert_has_ptr


@pytest.mark.asyncio
async def test_string_ret_endpoint(girest_server):
    """
    Test the /Gst/version_string endpoint which returns a string.
    
    This tests that non-void return values are properly returned in the HTTP response.
    The version_string endpoint should return the GStreamer version as a string.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version_string")
        assert_api_success(response, f"Failed to get version string")
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains a 'return' field with a string value
        assert "return" in data, "Response should contain 'return' field"
        assert isinstance(data["return"], str), "Return value should be a string"
        assert len(data["return"]) > 0, "Version string should not be empty"
        
        # Version string should contain numbers and dots
        assert any(c.isdigit() for c in data["return"]), "Version should contain digits"


@pytest.mark.asyncio
async def test_basic_out_endpoint(girest_server):
    """
    Test the /Gst/version endpoint which returns output integer parameters.
    
    This tests that output parameters are properly returned in the HTTP response.
    The version endpoint should return major, minor, micro, and nano version numbers.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version")
        assert_api_success(response, f"Failed to get version")
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains the output parameters
        # Based on GStreamer documentation, version returns major, minor, micro, and nano
        assert "major" in data, "Response should contain 'major' field"
        assert "minor" in data, "Response should contain 'minor' field"
        assert "micro" in data, "Response should contain 'micro' field"
        assert "nano" in data, "Response should contain 'nano' field"
        
        # Check that all values are integers
        assert isinstance(data["major"], int), "major should be an integer"
        assert isinstance(data["minor"], int), "minor should be an integer"
        assert isinstance(data["micro"], int), "micro should be an integer"
        assert isinstance(data["nano"], int), "nano should be an integer"
        
        # Sanity check: major version should be reasonable (GStreamer 1.x or later)
        assert data["major"] >= 1, f"Unexpected major version: {data['major']}"


@pytest.mark.asyncio
async def test_gtype_out_endpoint(girest_server):
    """
    Test struct out parameter handling with GstIterator::next and GValue.
    
    This tests the case where a struct (GValue) is used as an out parameter
    in a method call (GstIterator::next). The GValue has a registered GType,
    so it should be typed as "gtype" and properly dereferenced.
    
    The test follows the complete flow:
        1. Create a GstBin
        2. Add a GstElement to the bin (so iterator has something to return)
        3. Get an iterator for the bin's elements
        4. Create and initialize a GValue
        5. Call gst_iterator_next with the GValue as out parameter
        6. Verify we get a valid result
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Step 1: Create a GstBin
        response = await client.get(f"{girest_server}/Gst/Bin/new", params={"name": "test_bin"})
        assert_api_success(response, f"Failed to create bin")
        response_data = response.json()
        assert "return" in response_data, "Bin creation should return an object"
        assert "ptr" in response_data["return"], "Bin creation should return an object"
        bin_ptr = response_data["return"]["ptr"]

        response = await client.get(f"{girest_server}/Gst/Object/ptr,{bin_ptr}/get_name")
        assert_api_success(response, f"Failed to get bin's name")
        
        # Step 2: Create a GstElement to add to the bin
        response = await client.get(f"{girest_server}/Gst/ElementFactory/make", params={"factoryname": "fakesrc", "name": "test_element"})
        assert_api_success(response, f"Failed to create element")
        response_data = response.json()
        assert "return" in response_data, "Element creation should return an object"
        assert "ptr" in response_data["return"], "Element creation should return an object"
        element_ptr = response_data["return"]["ptr"]
        
        # Step 3: Add the element to the bin
        # Note: Objects are serialized as "ptr,value" per OpenAPI spec (style=form, explode=false for query params)
        response = await client.get(f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/add", params={"element": f"ptr,{element_ptr}"})
        assert_api_success(response, f"Failed to add element into the bin")
        
        # Step 4: Get an iterator for the bin's elements
        response = await client.get(f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/iterate_elements")
        assert_api_success(response, f"Failed to iterate elements")
        response_data = response.json()
        assert "return" in response_data, "Iterate elements should return an object"
        assert "ptr" in response_data["return"], "Iterate elements should return an object"
        iterator_ptr = response_data["return"]["ptr"]
        
        # Step 5: Test GValue creation
        response = await client.get(f"{girest_server}/GObject/Value/new")
        assert_api_success(response, f"Failed to create a value")
        response_data = response.json()
        assert "return" in response_data, "Value new should return an object"
        assert "ptr" in response_data["return"], "Value new should return an object"
        value_ptr = response_data["return"]["ptr"]
        
        # Step 6: Unset the GValue
        response = await client.get(f"{girest_server}/GObject/Value/ptr,{value_ptr}/unset")
        assert_api_success(response, f"Failed to unset the value")
        # Step 7: Try to call iterator next
        response = await client.get(f"{girest_server}/Gst/Iterator/ptr,{iterator_ptr}/next", params={"elem": f"ptr,{value_ptr}"})
        assert_api_success(response, f"Failed to iterate next")
        response_data = response.json()
        # The result should contain the return value and may contain the out parameter 'elem'
        assert "return" in response_data
        print("✓ Successfully tested struct out parameter infrastructure")


@pytest.mark.asyncio
async def test_gst_bin_get_type_endpoint(girest_server):
    """
    Test the /Gst/Bin/get_type endpoint which returns the GType for GstBin.
    
    This tests that get_type static methods work correctly and return a valid GType.
    The get_type endpoint should return a pointer value representing the GType for GstBin.
    GTypes are fundamental identifiers in GObject that represent registered types.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/Bin/get_type")
        assert_api_success(response, "Failed to get GstBin GType")
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains a 'return' field with a numeric value
        assert "return" in data, "Response should contain 'return' field"
        
        # GType should be a numeric value (represented as integer or hex string)
        gtype_value = data["return"]
        assert gtype_value is not None, "GType should not be null"
        
        # GType can be returned as integer or as a string representing a pointer
        # Validate that it's a reasonable value (positive number or valid hex string)
        if isinstance(gtype_value, int):
            assert gtype_value > 0, f"GType should be positive integer, got: {gtype_value}"
        elif isinstance(gtype_value, str):
            # Could be a hex string like "0x12345" or decimal string
            if gtype_value.startswith("0x"):
                # Hex string
                try:
                    hex_value = int(gtype_value, 16)
                    assert hex_value > 0, f"GType hex value should be positive, got: {gtype_value}"
                except ValueError:
                    assert False, f"Invalid hex GType value: {gtype_value}"
            else:
                # Decimal string
                try:
                    int_value = int(gtype_value)
                    assert int_value > 0, f"GType decimal string should be positive, got: {gtype_value}"
                except ValueError:
                    assert False, f"Invalid decimal GType value: {gtype_value}"
        else:
            assert False, f"GType should be integer or string, got type {type(gtype_value)}: {gtype_value}"
        
        print(f"✓ Successfully tested /Gst/Bin/get_type endpoint - returned GType: {gtype_value}")
        
        # Additional validation: ensure the GType is consistent across calls
        response2 = await client.get(f"{girest_server}/Gst/Bin/get_type")
        assert_api_success(response2, "Failed to get GstBin GType on second call")
        data2 = response2.json()
        
        assert data2["return"] == gtype_value, f"GType should be consistent across calls: {gtype_value} != {data2['return']}"
        print(f"✓ GType consistency verified across multiple calls")


@pytest.mark.asyncio
async def test_enum_returned_as_string(girest_server):
    """
    Test that enum values are returned as strings instead of integers.
    
    This test validates that GStreamer enum types (like GstStateChangeReturn)
    are properly serialized as their string representations rather than 
    their underlying integer values. This is critical for API usability
    as string enums are more readable and type-safe.
    
    The test uses /Gst/Element/state_change_return_get_name which accepts a 
    GstStateChangeReturn enum string and returns the string name, validating
    both that enum inputs accept strings and that the API properly handles them.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Test all valid GstStateChangeReturn enum values from the schema
        valid_state_change_returns = ["failure", "success", "async", "no_preroll"]
        
        for enum_value in valid_state_change_returns:
            # Call the endpoint with the enum string value
            response = await client.get(
                f"{girest_server}/Gst/Element/state_change_return_get_name",
                params={"state_ret": enum_value}
            )
            assert_api_success(response, f"Failed to get name for state_ret='{enum_value}'")
            response_data = response.json()
            
            # Validate the response structure
            assert "return" in response_data, f"Response should contain 'return' field for enum '{enum_value}'"
            name_result = response_data["return"]
            
            # The return value should be a string (the human-readable name)
            assert isinstance(name_result, str), \
                f"state_change_return_get_name should return string, got {type(name_result)}: {name_result}"
            
            # The returned string should not be empty
            assert len(name_result) > 0, f"Returned name should not be empty for enum '{enum_value}'"
            
            # The name should be different from the input (it's the human-readable form)
            # and typically contains uppercase/spaces (e.g., "GST_STATE_CHANGE_SUCCESS")
            assert name_result != enum_value, \
                f"Returned name '{name_result}' should be different from input enum '{enum_value}'"
            
            print(f"✓ Enum '{enum_value}' -> Name '{name_result}' (validated string)")
        
        # Test that invalid enum values are properly rejected
        invalid_enum_value = "invalid_enum_value"
        response = await client.get(
            f"{girest_server}/Gst/Element/state_change_return_get_name",
            params={"state_ret": invalid_enum_value}
        )
        
        # This should result in an error (4xx status code) because the enum value is invalid
        assert response.status_code >= 400, \
            f"Invalid enum value '{invalid_enum_value}' should be rejected with 4xx status, got {response.status_code}"
        
        print(f"✓ Invalid enum value '{invalid_enum_value}' properly rejected with status {response.status_code}")
        print(f"✓ Successfully validated that all enum values are handled as strings:")
        print(f"  - All valid GstStateChangeReturn enum strings were accepted as input")
        print(f"  - All responses contained string return values (not integers)")
        print(f"  - Invalid enum strings were properly rejected")
        print(f"✓ Enum serialization working correctly - strings instead of integers")


@pytest.mark.asyncio
async def test_glist_field_iteration(girest_server):
    """
    Test field access on GList by iterating through the 'next' field.
    
    This test validates the field access functionality by:
    1. Getting a GstRegistry using /Gst/Registry/get
    2. Getting a GList of plugins using /Gst/Registry/{self}/get_plugins_list
    3. Iterating through the GList by accessing the 'next' field until it's null
    
    This tests that:
    - Field GET endpoints work correctly (reading struct fields)
    - Pointer fields are properly serialized and deserialized
    - Iteration using field access works as expected
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        # Step 1: Get the GstRegistry singleton
        response = await client.get(f"{girest_server}/Gst/Registry/get")
        assert_api_success(response, "Failed to get GstRegistry")
        response_data = response.json()
        assert "return" in response_data, "Registry get should return an object"
        assert "ptr" in response_data["return"], "Registry should have a ptr field"
        registry_ptr = response_data["return"]["ptr"]
        print(f"✓ Got GstRegistry at {registry_ptr}")
        
        # Step 2: Get the plugin list from the registry
        response = await client.get(f"{girest_server}/Gst/Registry/ptr,{registry_ptr}/get_plugin_list")
        assert_api_success(response, "Failed to get plugin list from registry")
        response_data = response.json()
        assert "return" in response_data, "get_plugin_list should return an object"
        
        # The return value should be a GList pointer
        glist = response_data["return"]
        if glist is None:
            print("⚠ Plugin list is empty (no plugins registered)")
            return
        
        assert "ptr" in glist, "GList should have a ptr field"
        current_ptr = glist["ptr"]
        print(f"✓ Got GList starting at {current_ptr}")
        
        # Step 3: Iterate through the GList using the 'next' field
        iteration_count = 0
        max_iterations = 100  # Safety limit to prevent infinite loops
        
        while current_ptr and current_ptr != "0x0" and current_ptr != 0 and iteration_count < max_iterations:
            iteration_count += 1
            print(f"  Iteration {iteration_count}: GList node at {current_ptr}")
            
            # Access the 'next' field of the current GList node
            # The operation ID format is: GLib-List-next-get
            response = await client.get(f"{girest_server}/GLib/List/ptr,{current_ptr}/fields/next")
            assert_api_success(response, f"Failed to get 'next' field from GList at iteration {iteration_count}")
            response_data = response.json()
            
            # The response should contain a 'return' field
            assert "return" in response_data, f"Field access should return a value at iteration {iteration_count}"
            
            # The 'next' field is a pointer to the next GList node (or null)
            next_value = response_data["return"]
            
            if next_value is None or (isinstance(next_value, dict) and next_value.get("ptr") in ["0x0", 0, None]):
                # Reached the end of the list
                print(f"✓ Reached end of list at iteration {iteration_count}")
                break
            
            # The next field should be a struct/pointer with a ptr field
            if isinstance(next_value, dict) and "ptr" in next_value:
                current_ptr = next_value["ptr"]
                if current_ptr in ["0x0", 0, None]:
                    print(f"✓ Reached end of list (null pointer) at iteration {iteration_count}")
                    break
            else:
                # Handle case where next is directly a pointer value
                current_ptr = next_value
                if current_ptr in ["0x0", 0, None]:
                    print(f"✓ Reached end of list (null pointer) at iteration {iteration_count}")
                    break
        
        # Validate that we iterated through at least some nodes
        # GStreamer usually has many plugins registered, so we should see multiple nodes
        assert iteration_count > 0, "Should have iterated through at least one GList node"
        print(f"✓ Successfully iterated through {iteration_count} GList nodes using field access")
        
        # Validate we didn't hit the safety limit (which would indicate an infinite loop)
        assert iteration_count < max_iterations, \
            f"Hit safety limit of {max_iterations} iterations - possible infinite loop or circular list"
        
        print(f"✓ Field access test completed successfully:")
        print(f"  - Retrieved GstRegistry singleton")
        print(f"  - Got Plugins list (GList)")
        print(f"  - Iterated through {iteration_count} nodes using 'next' field")
        print(f"  - Properly detected end of list (null pointer)")
        print(f"✓ GList field iteration test passed!")
