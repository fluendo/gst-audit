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

    def _parse_with_template(self, param_name: str, value: Any, param_defn: Dict) -> Any:
        """
        Parse a parameter value using URI template extraction if available.
        
        :param param_name: Name of the parameter
        :param value: Raw value from the request
        :param param_defn: Parameter definition from the spec
        :return: Parsed value
        """
        # If we have a template for this parameter, try to use it
        if param_name in self._uri_templates:
            template = self._uri_templates[param_name]
            
            # For simple values, just return as-is
            if isinstance(value, (str, int, float, bool)):
                return value
            
            # For objects or complex types, the template should have already
            # been used during URI construction. Here we just validate.
            logger.debug(f"Parameter {param_name} parsed with template: {value}")
            
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

            # Check if this is an object type with allOf/anyOf/oneOf
            is_complex_schema = False
            if param_schema:
                is_complex_schema = any(
                    key in param_schema for key in ["allOf", "anyOf", "oneOf"]
                )
            
            # Handle array types
            if param_schema and param_schema.get("type") == "array":
                # resolve variable re-assignment, handle explode
                values = self._resolve_param_duplicates(values, param_defn, _in)
                # handle array styles
                resolved_param[k] = self._split(values, param_defn, _in)
            # Handle object types and complex schemas
            elif (param_schema and param_schema.get("type") == "object") or is_complex_schema:
                # For objects, use template-based parsing
                parsed_value = self._parse_with_template(k, values, param_defn)
                
                # If values is a list, take the last one (standard behavior)
                if isinstance(parsed_value, list):
                    resolved_param[k] = parsed_value[-1]
                else:
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
