import logging
import typing as t
import sys
import os

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

from main import GIRest

from resolvers import FridaResolver
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

class GIApp(AsyncApp):
    def __init__(
        self,
        import_name: str,
        namespace: str,
        version: str,
        #resolver: t.Optional[t.Union[Resolver, t.Callable]], # FIXME fix this
        pid: int, # FIXME fix this
        *,
        sse_buffer_size = 100,
        default_base_path = None
    ):
        # Generate the OpenAPI schema with specified buffer size
        girest = GIRest(namespace, version)
        spec = girest.generate()
        specd = spec.to_dict()

        # Create the resolver with Frida
        # TODO we can avoid passing the specd by using
        # resolve_operation_id which receives the operation and then get
        # the actual defition by calling, for example, operation.parameters
        resolver = FridaResolver(namespace, version, pid, sse_buffer_size=sse_buffer_size)
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
