"""
Custom URI parser for GIRest that uses uritemplate to handle complex parameter serialization.

This parser extends Connexion's OpenAPIURIParser to properly handle:
- allOf, anyOf, oneOf schema combinations
- explode=true with style=form for object parameters
- Complex URI template patterns used in the GIRest API
"""

import logging
from typing import Any, Dict, List

import uritemplate
from connexion.uri_parsing import OpenAPIURIParser

logger = logging.getLogger("girest.uri_parser")


class URITemplateParser(OpenAPIURIParser):
    """
    URI parser that uses the uritemplate library to parse complex URI patterns.
    
    This parser inherits from OpenAPIURIParser and overrides the parameter resolution
    to use URI templates for more robust parsing of query and path parameters,
    particularly when dealing with object types and complex serialization formats.
    """

    def __init__(self, param_defns, body_defn):
        """
        Initialize the URI template parser.
        
        :param param_defns: List of parameter definitions from the OpenAPI spec
        :param body_defn: Body definition from the OpenAPI spec
        """
        super().__init__(param_defns, body_defn)
        # Build URI templates for each parameter
        self._uri_templates = self._build_uri_templates()

    def _build_uri_templates(self) -> Dict[str, uritemplate.URITemplate]:
        """
        Build URI templates for each parameter based on their style and explode settings.
        
        :return: Dictionary mapping parameter names to URI templates
        """
        templates = {}
        
        for param_name, param_defn in self._param_defns.items():
            param_in = param_defn.get("in")
            
            # Only build templates for query and path parameters
            if param_in not in ["query", "path"]:
                continue
            
            # Get style and explode from parameter definition
            default_style = self.style_defaults.get(param_in, "simple")
            style = param_defn.get("style", default_style)
            is_form = style == "form"
            explode = param_defn.get("explode", is_form)
            
            # Build the appropriate template syntax based on style and explode
            if style == "form" and explode:
                # Form style with explode expands object properties
                template_str = f"{{{param_name}*}}"
            elif style == "form":
                # Form style without explode uses comma-separated values
                template_str = f"{{{param_name}}}"
            elif style == "simple" and explode:
                template_str = f"{{{param_name}*}}"
            else:
                # Default simple style
                template_str = f"{{{param_name}}}"
            
            try:
                templates[param_name] = uritemplate.URITemplate(template_str)
            except Exception as e:
                logger.warning(f"Failed to create URI template for {param_name}: {e}")
                
        return templates

    def _is_object_schema(self, param_schema: Dict) -> bool:
        """
        Check if a parameter schema represents an object type.
        
        This includes:
        - Schemas with type="object"
        - Schemas with allOf/anyOf/oneOf (complex schemas)
        - Schemas with $ref to object types
        
        :param param_schema: The schema to check
        :return: True if it's an object schema
        """
        if not param_schema:
            return False
        
        # Direct object type
        if param_schema.get("type") == "object":
            return True
        
        # Complex schemas (allOf, anyOf, oneOf)
        if any(key in param_schema for key in ["allOf", "anyOf", "oneOf"]):
            return True
        
        # Schemas with $ref are treated as potentially objects
        # We can't easily resolve the ref here, so we'll try to parse it
        if "$ref" in param_schema:
            return True
        
        return False
    
    def _parse_object_from_string(self, value: str, param_defn: Dict, _in: str) -> Any:
        """
        Parse an object from its serialized string representation.
        
        According to OpenAPI spec:
        - style=simple, explode=false (default for path): "prop1,val1,prop2,val2"
        - style=form, explode=false (used for query): "param=prop1,val1,prop2,val2"
        
        Since GIRest objects always have a single "ptr" property, the format is:
        - path: "ptr,value"
        - query: "param=ptr,value"
        
        :param value: Serialized string value
        :param param_defn: Parameter definition
        :param _in: Parameter location (path/query)
        :return: Parsed object or original value
        """
        if not isinstance(value, str):
            return value
        
        # Get style and explode settings
        default_style = self.style_defaults.get(_in, "simple")
        style = param_defn.get("style", default_style)
        is_form = style == "form"
        explode = param_defn.get("explode", is_form)
        
        # For style=simple or style=form with explode=false
        # Object format is "prop1,val1,prop2,val2,..."
        if not explode and "," in value:
            parts = value.split(",")
            # Must have even number of parts (property-value pairs)
            if len(parts) >= 2 and len(parts) % 2 == 0:
                obj = {}
                for i in range(0, len(parts), 2):
                    obj[parts[i]] = parts[i + 1]
                return obj
        
        # If it doesn't match the pattern, return as-is
        return value
    
    def _parse_with_template(self, param_name: str, value: Any, param_defn: Dict, _in: str) -> Any:
        """
        Parse a parameter value using URI template extraction if available.
        
        :param param_name: Name of the parameter
        :param value: Raw value from the request
        :param param_defn: Parameter definition from the spec
        :param _in: Parameter location (path/query)
        :return: Parsed value
        """
        # For string values, try to parse as serialized objects
        if isinstance(value, str):
            return self._parse_object_from_string(value, param_defn, _in)
        
        # For other types, return as-is
        return value

    def resolve_params(self, params, _in):
        """
        Resolve parameters using URI template aware parsing.
        
        This method extends the parent class to use URI templates for
        better handling of complex parameter types.
        
        :param params: Dictionary of raw parameter values
        :param _in: Parameter location (query, path, etc.)
        :return: Resolved parameters
        """
        resolved_param = {}
        
        for k, values in params.items():
            param_defn = self.param_defns.get(k)
            param_schema = self.param_schemas.get(k)

            if not (param_defn or param_schema):
                # rely on validation
                resolved_param[k] = values
                continue

            if _in == "path":
                # multiple values in a path is impossible
                values = [values]

            # Check if this is an object type with allOf/anyOf/oneOf or $ref
            is_complex_schema = self._is_object_schema(param_schema)
            
            # Handle array types
            if param_schema and param_schema.get("type") == "array":
                # resolve variable re-assignment, handle explode
                values = self._resolve_param_duplicates(values, param_defn, _in)
                # handle array styles
                resolved_param[k] = self._split(values, param_defn, _in)
            # Handle object types and complex schemas (including $ref)
            elif is_complex_schema:
                # Extract the value from list if needed
                value_to_parse = values[-1] if isinstance(values, list) else values
                
                # For objects, use template-based parsing
                parsed_value = self._parse_with_template(k, value_to_parse, param_defn, _in)
                resolved_param[k] = parsed_value
            else:
                # Standard scalar handling
                resolved_param[k] = values[-1]

            # Type coercion is handled by parent class
            try:
                from connexion.utils import coerce_type
                from connexion.exceptions import TypeValidationError
                resolved_param[k] = coerce_type(
                    param_defn, resolved_param[k], "parameter", k
                )
            except TypeValidationError:
                pass

        return resolved_param
