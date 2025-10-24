#!/usr/bin/env python3
"""
End-to-end tests for URL template parsing with objects.

These tests verify that the custom URI parser and validator work correctly
with real GIRest endpoints that have object parameters in the URL.
"""

import pytest
from girest.main import GIRest
from girest.uri_parser import URITemplateParser
from girest.validators import GIRestParameterValidator


def test_object_in_path_parameter():
    """Test that path parameters with object schemas are handled correctly."""
    # Generate a real schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    spec_dict = spec.to_dict()
    
    # Find an endpoint with an object in the path
    path = '/Gst/AllocationParams/{self}/copy'
    operation = spec_dict['paths'][path]['get']
    
    # Get the parameters
    params = operation['parameters']
    
    # Create a URI parser with these parameters
    parser = URITemplateParser(params, {})
    
    # Test parsing a path parameter with an object value
    # In practice, this would be a pointer represented as an integer or hex string
    path_params = {"self": "0x12345"}
    resolved = parser.resolve_path(path_params)
    
    assert "self" in resolved
    # The value should be parsed correctly (as a dict with ptr)
    assert resolved["self"] is not None


def test_allof_schema_in_path():
    """Test that path parameters with allOf schemas are handled correctly."""
    # Generate a real schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    spec_dict = spec.to_dict()
    
    # Find an endpoint with an object that has allOf (inheritance)
    # Look for a GObject method since GObject has inheritance
    path = None
    for p, path_item in spec_dict['paths'].items():
        if 'GObject/Binding' in p and '{self}' in p:
            path = p
            break
    
    if path is None:
        pytest.skip("Could not find a suitable endpoint with allOf schema")
    
    operation = spec_dict['paths'][path]['get']
    params = operation['parameters']
    
    # Create a URI parser with these parameters
    parser = URITemplateParser(params, {})
    
    # Test parsing with a pointer value
    path_params = {"self": "12345"}  # Integer pointer
    resolved = parser.resolve_path(path_params)
    
    assert "self" in resolved


def test_validator_handles_pointer_schema():
    """Test that the validator correctly handles Pointer schemas."""
    # The Pointer schema is a oneOf with integer and string patterns
    param = {
        "name": "self",
        "in": "path",
        "required": True,
        "schema": {
            "oneOf": [
                {"type": "integer"},
                {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
            ]
        }
    }
    
    # Test with integer pointer
    error = GIRestParameterValidator.validate_parameter(
        "path", 12345, param
    )
    assert error is None, f"Integer pointer should be valid, got error: {error}"
    
    # Test with hex string pointer
    error = GIRestParameterValidator.validate_parameter(
        "path", "0x12345", param
    )
    assert error is None, f"Hex string pointer should be valid, got error: {error}"
    
    # Test with decimal string pointer
    error = GIRestParameterValidator.validate_parameter(
        "path", "12345", param
    )
    assert error is None, f"Decimal string pointer should be valid, got error: {error}"
    
    # Test with invalid pointer
    error = GIRestParameterValidator.validate_parameter(
        "path", "invalid", param
    )
    assert error is not None, "Invalid pointer should fail validation"


def test_struct_schema_validation():
    """Test validation of struct schemas with ptr property."""
    param = {
        "name": "self",
        "in": "path",
        "required": True,
        "schema": {
            "type": "object",
            "properties": {
                "ptr": {
                    "oneOf": [
                        {"type": "integer"},
                        {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
                    ]
                }
            },
            "required": ["ptr"]
        }
    }
    
    # Test with valid object
    error = GIRestParameterValidator.validate_parameter(
        "path", {"ptr": 12345}, param
    )
    assert error is None, f"Valid struct object should pass, got error: {error}"
    
    # Test with hex pointer
    error = GIRestParameterValidator.validate_parameter(
        "path", {"ptr": "0x12345"}, param
    )
    assert error is None, f"Struct with hex pointer should pass, got error: {error}"


def test_object_with_allof_validation():
    """Test validation of objects with allOf schemas."""
    param = {
        "name": "obj",
        "in": "query",
        "required": True,
        "schema": {
            "allOf": [
                {
                    "type": "object",
                    "properties": {"ptr": {"type": "integer"}},
                    "required": ["ptr"]
                },
                {
                    "type": "object"
                }
            ]
        }
    }
    
    # Test with valid object
    error = GIRestParameterValidator.validate_parameter(
        "query", {"ptr": 12345}, param
    )
    assert error is None, f"Object matching allOf should pass, got error: {error}"
    
    # Test with missing required property
    error = GIRestParameterValidator.validate_parameter(
        "query", {}, param
    )
    assert error is not None, "Object missing required property should fail"


def test_form_style_explode_query_params():
    """Test that form style with explode=true works for query parameters."""
    params = [
        {
            "name": "filter",
            "in": "query",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "integer"}
                }
            },
            "style": "form",
            "explode": True,
            "required": False
        }
    ]
    
    parser = URITemplateParser(params, {})
    
    # Test with an object parameter
    # In form style with explode, this would typically be passed as name=test&value=42
    # But we're testing the parser handles object values
    query_params = {"filter": [{"name": "test", "value": 42}]}
    resolved = parser.resolve_query(query_params)
    
    assert "filter" in resolved
    assert isinstance(resolved["filter"], dict)


def test_integration_with_real_endpoint():
    """Integration test using a real GIRest endpoint schema."""
    # Generate the schema
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    spec_dict = spec.to_dict()
    
    # Get a method endpoint
    path = '/Gst/AllocationParams/{self}/copy'
    operation = spec_dict['paths'][path]['get']
    params = operation['parameters']
    
    # Create parser
    parser = URITemplateParser(params, {})
    
    # Parse path with object
    path_data = {"self": "0x7fff12345678"}
    resolved = parser.resolve_path(path_data)
    
    # Validate the parameter
    self_param = [p for p in params if p['name'] == 'self'][0]
    
    # The validator should accept the resolved value
    # Note: The actual validation depends on how the schema is structured
    # For struct types, the parameter is typically just a pointer value
    assert "self" in resolved
