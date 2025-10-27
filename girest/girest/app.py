import logging
import sys
import os

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

from main import GIRest
from resolvers import GIResolver
from uri_parser import URITemplateParser
from validators import GIRestParameterValidator
from connexion import AsyncApp
from connexion.resolver import Resolver
from connexion.datastructures import MediaTypeDict
from connexion.validators import (
    JSONRequestBodyValidator,
    FormDataValidator,
    MultiPartFormDataValidator,
    JSONResponseBodyValidator,
    TextResponseBodyValidator,
)

def patch_connexion_parameter_decorator():
    """
    Patch Connexion's _get_val_from_param to handle complex schemas.
    
    This patches the parameter decorator to handle schemas with allOf, anyOf, oneOf
    that don't have a direct "type" field. The patched function returns the validated
    parameter directly since our URI parser has already deserialized it.
    """
    from connexion.decorators import parameter
    from connexion.utils import is_null, is_nullable, make_type
    
    # Store the original function
    original_get_val_from_param = parameter._get_val_from_param
    
    def _get_val_from_param_girest(value, param_definitions):
        """
        Cast a value according to its definition, handling complex schemas.
        
        For schemas with allOf/anyOf/oneOf (no direct "type" field), return
        the value as-is since it's already been parsed by our URI parser.
        """
        param_schema = param_definitions.get("schema", param_definitions)

        if is_nullable(param_schema) and is_null(value):
            return None

        # Check if schema has a direct "type" field
        if "type" in param_schema:
            # Use original logic for schemas with type
            return original_get_val_from_param(value, param_definitions)
        
        # For complex schemas (allOf, anyOf, oneOf) or schemas with $ref,
        # the value has already been parsed by our custom URI parser
        # Return it as-is
        return value
    
    # Replace the function
    parameter._get_val_from_param = _get_val_from_param_girest


class GIApp(AsyncApp):
    def __init__(
        self,
        import_name: str,
        namespace: str,
        version: str,
        resolver: GIResolver,
        *,
        default_base_path = None
    ):
        # Generate the OpenAPI schema with specified buffer size
        girest = GIRest(namespace, version)
        spec = girest.generate()
        specd = spec.to_dict()

        super().__init__(import_name, resolver=resolver)
        
        # Create custom validator map with our enhanced parameter validator
        custom_validator_map = {
            "parameter": GIRestParameterValidator,
            "body": MediaTypeDict(
                {
                    "*/*json": JSONRequestBodyValidator,
                    "application/x-www-form-urlencoded": FormDataValidator,
                    "multipart/form-data": MultiPartFormDataValidator,
                }
            ),
            "response": MediaTypeDict(
                {
                    "*/*json": JSONResponseBodyValidator,
                    "text/plain": TextResponseBodyValidator,
                }
            ),
        }
        
        # Add the API with custom URI parser and validator
        self.add_api(
            specd,
            resolver=resolver,
            uri_parser_class=URITemplateParser,
            validator_map=custom_validator_map,
            base_path=default_base_path
        )


# Patch Connexion's parameter decorator to handle complex schemas
patch_connexion_parameter_decorator()
