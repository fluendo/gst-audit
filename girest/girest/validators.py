"""
Custom validators for GIRest that properly handle allOf, anyOf, and oneOf schema combinations.

This module extends Connexion's default validators to support more complex JSON Schema
patterns used in the GIRest API, particularly for handling GObject introspection types.
"""

import logging
from typing import Any, Dict, Optional

from jsonschema import Draft4Validator, ValidationError, validators

from connexion.validators.parameter import ParameterValidator

logger = logging.getLogger("girest.validators")


class GIRestParameterValidator(ParameterValidator):
    """
    Enhanced parameter validator that properly handles allOf, anyOf, and oneOf schemas.
    
    This validator extends Connexion's ParameterValidator to support JSON Schema
    composition keywords (allOf, anyOf, oneOf) which are commonly used in the
    GIRest schema for representing GObject type hierarchies.
    """

    @staticmethod
    def _create_validator_with_defaults(schema: Dict) -> Draft4Validator:
        """
        Create a JSON Schema validator that properly handles composition keywords.
        
        :param schema: The JSON schema to validate against
        :return: A configured Draft4Validator instance
        """
        # Create a validator class that supports all composition keywords
        # The Draft4Validator already supports allOf, anyOf, and oneOf
        try:
            format_checker = Draft4Validator.FORMAT_CHECKER  # type: ignore
        except AttributeError:  # jsonschema < 4.5.0
            from jsonschema import draft4_format_checker
            format_checker = draft4_format_checker

        return Draft4Validator(schema, format_checker=format_checker)

    @staticmethod
    def validate_parameter(parameter_type, value, param, param_name=None):
        """
        Validate a parameter value against its schema, with support for allOf/anyOf/oneOf.
        
        :param parameter_type: Type of parameter (query, path, header, cookie)
        :param value: The value to validate
        :param param: The parameter definition from the spec
        :param param_name: Optional parameter name for error messages
        :return: Error message if validation fails, None otherwise
        """
        from connexion.utils import is_nullable, is_null
        
        if is_nullable(param) and is_null(value):
            return

        elif value is not None:
            import copy
            param = copy.deepcopy(param)
            param_schema = param.get("schema", param)
            
            try:
                # Use our enhanced validator that handles composition keywords
                validator = GIRestParameterValidator._create_validator_with_defaults(
                    param_schema
                )
                validator.validate(value)
            except ValidationError as exception:
                # Provide more detailed error messages for composition keywords
                if any(keyword in param_schema for keyword in ["allOf", "anyOf", "oneOf"]):
                    logger.debug(
                        f"Validation failed for {parameter_type} parameter with "
                        f"composition schema: {exception}"
                    )
                return str(exception)

        elif param.get("required"):
            return f"Missing {parameter_type} parameter '{param.get('name', param_name)}'"


def _handle_ref_in_schema(schema: Dict, spec_schemas: Dict) -> Dict:
    """
    Resolve $ref references in a schema recursively.
    
    This is a helper function to resolve schema references which is particularly
    useful when dealing with allOf/anyOf/oneOf that reference other schemas.
    
    :param schema: The schema that may contain $ref
    :param spec_schemas: The components/schemas section of the OpenAPI spec
    :return: Resolved schema
    """
    if "$ref" in schema:
        # Extract the reference path (e.g., "#/components/schemas/SomeType")
        ref_path = schema["$ref"]
        
        if ref_path.startswith("#/components/schemas/"):
            schema_name = ref_path.split("/")[-1]
            if schema_name in spec_schemas:
                return spec_schemas[schema_name]
        
        logger.warning(f"Could not resolve schema reference: {ref_path}")
        return schema
    
    # Recursively resolve refs in nested schemas
    if "allOf" in schema:
        schema["allOf"] = [
            _handle_ref_in_schema(s, spec_schemas) for s in schema["allOf"]
        ]
    if "anyOf" in schema:
        schema["anyOf"] = [
            _handle_ref_in_schema(s, spec_schemas) for s in schema["anyOf"]
        ]
    if "oneOf" in schema:
        schema["oneOf"] = [
            _handle_ref_in_schema(s, spec_schemas) for s in schema["oneOf"]
        ]
    
    return schema
