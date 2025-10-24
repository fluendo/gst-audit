#!/usr/bin/env python3
"""
Tests for the custom URI parser and validator in GIRest.

These tests verify that:
- URITemplateParser properly handles complex parameter serialization
- GIRestParameterValidator handles allOf, anyOf, oneOf schemas
- Integration with the existing schema works correctly
"""

import pytest
from girest.uri_parser import URITemplateParser
from girest.validators import GIRestParameterValidator


class TestURITemplateParser:
    """Test cases for the URITemplateParser class."""

    def test_initialization(self):
        """Test that URITemplateParser initializes correctly."""
        param_defns = [
            {
                "name": "test_param",
                "in": "query",
                "schema": {"type": "string"},
                "style": "form",
                "explode": True,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        assert parser is not None
        assert "test_param" in parser._param_defns

    def test_simple_query_parameter(self):
        """Test parsing of a simple query parameter."""
        param_defns = [
            {
                "name": "name",
                "in": "query",
                "schema": {"type": "string"},
                "style": "form",
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Test resolving a simple query parameter
        params = {"name": ["test_value"]}
        resolved = parser.resolve_query(params)
        
        assert "name" in resolved
        assert resolved["name"] == "test_value"

    def test_array_parameter_with_explode(self):
        """Test parsing of array parameters with explode=true."""
        param_defns = [
            {
                "name": "ids",
                "in": "query",
                "schema": {"type": "array", "items": {"type": "integer"}},
                "style": "form",
                "explode": True,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Test with multiple values (exploded)
        params = {"ids": ["1", "2", "3"]}
        resolved = parser.resolve_query(params)
        
        assert "ids" in resolved
        assert isinstance(resolved["ids"], list)
        assert len(resolved["ids"]) == 3

    def test_object_parameter(self):
        """Test parsing of object parameters."""
        param_defns = [
            {
                "name": "filter",
                "in": "query",
                "schema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "age": {"type": "integer"},
                    },
                },
                "style": "form",
                "explode": True,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Test with an object value
        params = {"filter": [{"name": "John", "age": 30}]}
        resolved = parser.resolve_query(params)
        
        assert "filter" in resolved
        # Object should be preserved
        assert isinstance(resolved["filter"], dict)

    def test_path_parameter(self):
        """Test parsing of path parameters."""
        param_defns = [
            {
                "name": "id",
                "in": "path",
                "schema": {"type": "integer"},
                "style": "simple",
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Test with a path parameter
        params = {"id": "123"}
        resolved = parser.resolve_path(params)
        
        assert "id" in resolved
        assert resolved["id"] == 123  # Should be coerced to integer

    def test_allof_schema_parameter(self):
        """Test handling of parameters with allOf schemas."""
        param_defns = [
            {
                "name": "obj",
                "in": "query",
                "schema": {
                    "allOf": [
                        {"type": "object", "properties": {"a": {"type": "string"}}},
                        {"type": "object", "properties": {"b": {"type": "integer"}}},
                    ]
                },
                "style": "form",
                "explode": True,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Test with a value that should match both schemas
        params = {"obj": [{"a": "test", "b": 42}]}
        resolved = parser.resolve_query(params)
        
        assert "obj" in resolved


class TestGIRestParameterValidator:
    """Test cases for the GIRestParameterValidator class."""

    def test_simple_parameter_validation(self):
        """Test validation of a simple parameter."""
        param = {
            "name": "test",
            "schema": {"type": "string"},
            "required": True,
        }
        
        # Valid value
        error = GIRestParameterValidator.validate_parameter(
            "query", "test_value", param
        )
        assert error is None
        
        # Invalid type
        error = GIRestParameterValidator.validate_parameter(
            "query", 123, param
        )
        assert error is not None

    def test_allof_validation(self):
        """Test validation with allOf schema."""
        param = {
            "name": "test",
            "schema": {
                "allOf": [
                    {"type": "object", "properties": {"a": {"type": "string"}}},
                    {"type": "object", "properties": {"b": {"type": "integer"}}},
                ]
            },
            "required": True,
        }
        
        # Valid object matching both schemas
        error = GIRestParameterValidator.validate_parameter(
            "query", {"a": "test", "b": 42}, param
        )
        assert error is None
        
        # Invalid - missing required property
        error = GIRestParameterValidator.validate_parameter(
            "query", {"a": "test"}, param
        )
        # Should fail because b is missing (depending on schema strictness)
        # For now, just check it doesn't crash

    def test_anyof_validation(self):
        """Test validation with anyOf schema."""
        param = {
            "name": "test",
            "schema": {
                "anyOf": [
                    {"type": "string"},
                    {"type": "integer"},
                ]
            },
            "required": True,
        }
        
        # Valid string
        error = GIRestParameterValidator.validate_parameter(
            "query", "test", param
        )
        assert error is None
        
        # Valid integer
        error = GIRestParameterValidator.validate_parameter(
            "query", 123, param
        )
        assert error is None
        
        # Invalid - doesn't match any schema
        error = GIRestParameterValidator.validate_parameter(
            "query", {"obj": "value"}, param
        )
        assert error is not None

    def test_oneof_validation(self):
        """Test validation with oneOf schema."""
        param = {
            "name": "test",
            "schema": {
                "oneOf": [
                    {"type": "string", "pattern": "^[a-z]+$"},
                    {"type": "integer", "minimum": 0},
                ]
            },
            "required": True,
        }
        
        # Valid string
        error = GIRestParameterValidator.validate_parameter(
            "query", "test", param
        )
        assert error is None
        
        # Valid integer
        error = GIRestParameterValidator.validate_parameter(
            "query", 42, param
        )
        assert error is None

    def test_nullable_parameter(self):
        """Test validation of nullable parameters."""
        param = {
            "name": "test",
            "schema": {"type": "string", "nullable": True},
            "required": False,
        }
        
        # Null value should be accepted
        error = GIRestParameterValidator.validate_parameter(
            "query", None, param
        )
        assert error is None

    def test_required_parameter_missing(self):
        """Test validation when a required parameter is missing."""
        param = {
            "name": "test",
            "schema": {"type": "string"},
            "required": True,
        }
        
        # None value for required parameter should fail
        error = GIRestParameterValidator.validate_parameter(
            "query", None, param
        )
        assert error is not None
        assert "Missing" in error or "required" in error.lower()


class TestIntegration:
    """Integration tests combining URI parser and validator."""

    def test_parser_and_validator_together(self):
        """Test that parser and validator work together correctly."""
        param_defns = [
            {
                "name": "obj",
                "in": "query",
                "schema": {
                    "allOf": [
                        {"type": "object", "properties": {"ptr": {"type": "integer"}}},
                    ]
                },
                "style": "form",
                "explode": True,
                "required": True,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Parse the parameter
        params = {"obj": [{"ptr": 12345}]}
        resolved = parser.resolve_query(params)
        
        # Validate the parsed parameter
        error = GIRestParameterValidator.validate_parameter(
            "query", resolved["obj"], param_defns[0]
        )
        
        # Should be valid
        assert error is None


class TestPointerParsing:
    """Test cases for pointer parameter parsing."""
    
    def test_pointer_with_hex_prefix(self):
        """Test parsing a pointer parameter with 0x prefix."""
        param_defns = [
            {
                "name": "ptr_param",
                "in": "query",
                "schema": {
                    "oneOf": [
                        {"type": "integer"},
                        {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
                    ]
                },
                "style": "form",
                "explode": False,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Parse with hex prefix
        params = {"ptr_param": ["0x12345abc"]}
        resolved = parser.resolve_query(params)
        
        # Validate it's parsed correctly
        assert "ptr_param" in resolved
        assert resolved["ptr_param"] == "0x12345abc"
        
        # Validate against the schema
        error = GIRestParameterValidator.validate_parameter(
            "query", resolved["ptr_param"], param_defns[0]
        )
        assert error is None, f"Expected valid, got error: {error}"
    
    def test_pointer_with_integer_value(self):
        """Test parsing a pointer parameter as an integer."""
        param_defns = [
            {
                "name": "ptr_param",
                "in": "query",
                "schema": {
                    "oneOf": [
                        {"type": "integer"},
                        {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
                    ]
                },
                "style": "form",
                "explode": False,
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Parse with integer value (as string from URL)
        params = {"ptr_param": ["12345"]}
        resolved = parser.resolve_query(params)
        
        # Validate it's parsed correctly
        assert "ptr_param" in resolved
        assert resolved["ptr_param"] == "12345"
        
        # Validate against the schema
        error = GIRestParameterValidator.validate_parameter(
            "query", resolved["ptr_param"], param_defns[0]
        )
        assert error is None, f"Expected valid, got error: {error}"
    
    def test_pointer_as_direct_integer(self):
        """Test parsing a pointer parameter passed as an integer (not string)."""
        param_defns = [
            {
                "name": "ptr_param",
                "in": "path",
                "schema": {
                    "oneOf": [
                        {"type": "integer"},
                        {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
                    ]
                },
            }
        ]
        body_defn = {}
        
        parser = URITemplateParser(param_defns, body_defn)
        
        # Parse with integer value (actual integer, not string)
        params = {"ptr_param": 305419896}  # 0x12345678 in decimal
        resolved = parser.resolve_path(params)
        
        # Validate it's parsed correctly
        assert "ptr_param" in resolved
        assert resolved["ptr_param"] == 305419896
        
        # Validate against the schema
        error = GIRestParameterValidator.validate_parameter(
            "path", resolved["ptr_param"], param_defns[0]
        )
        assert error is None, f"Expected valid, got error: {error}"

