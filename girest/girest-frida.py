#!/usr/bin/env python3
"""
girest-frida - Development server for GIRest with Frida integration.

This tool creates a development server that uses Frida to instrument a running
process and expose its GObject introspection API as a REST API.
"""
import logging

import argparse
import sys
import os

import connexion
from uvicorn.config import LOGGING_CONFIG
from uvicorn.logging import DefaultFormatter
from starlette.responses import StreamingResponse

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

from app import GIApp


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


def main():
    """Main entry point for girest-frida tool."""
    parser = argparse.ArgumentParser(
        description="GIRest development server with Frida integration"
    )
    parser.add_argument(
        "namespace",
        help="GObject namespace (e.g., 'Gst', 'GLib', 'Gtk')"
    )
    parser.add_argument(
        "version",
        help="Namespace version (e.g., '1.0', '2.0')"
    )
    parser.add_argument(
        "--pid",
        type=int,
        required=True,
        help="Process ID to instrument"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=9000,
        help="Port to run the server on (default: 9000)"
    )
    parser.add_argument(
        "--sse-buffer-size",
        type=int,
        default=100,
        help="Size of the SSE event ring buffer (default: 100)"
    )
    
    args = parser.parse_args()

    # Setup the log
    # Use the same logger Uvicorn uses
    handler = logging.StreamHandler()
    handler.setFormatter(DefaultFormatter(fmt=LOGGING_CONFIG["formatters"]["default"]["fmt"]))
    logger = logging.getLogger("girest")
    logger.handlers = []  # Remove any existing handlers
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)

    # Patch Connexion's parameter decorator to handle complex schemas
    patch_connexion_parameter_decorator()
    
    try:
        
        # Create the connexion AsyncApp
        app = GIApp(__name__, args.namespace, args.version, args.pid, sse_buffer_size=args.sse_buffer_size)
        
        
        app.run(port=args.port)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
