#!/usr/bin/env python3
"""
girest-client-generator - TypeScript client generator for GIRest schemas.

This tool generates TypeScript client bindings from GObject introspection data,
creating proper class hierarchies with methods organized by their tags.
"""
import argparse
import json
import sys
import os

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

import gi
gi.require_version("GIRepository", "2.0")
from gi.repository import GIRepository
from apispec import APISpec

# Import GIRest and TypeScriptGenerator
from main import GIRest
from generator import TypeScriptGenerator


def main():
    """Main entry point for girest-ts tool."""
    parser = argparse.ArgumentParser(
        description="Generate TypeScript bindings from GObject introspection data"
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
        "-o", "--output",
        help="Output file path (default: stdout)",
        default=None
    )
    parser.add_argument(
        "--host",
        default="localhost",
        help="Host for REST API calls (default: localhost)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=9000,
        help="Port for REST API calls (default: 9000)"
    )
    
    args = parser.parse_args()
    
    try:
        # Generate the OpenAPI schema
        girest = GIRest(args.namespace, args.version)
        spec = girest.generate()
        openapi_schema = spec.to_dict()
        
        # Generate TypeScript bindings using Jinja2-based generator
        ts_gen = TypeScriptGenerator(openapi_schema, host=args.host, port=args.port)
        output = ts_gen.generate()
        
        # Write to file or stdout
        if args.output:
            with open(args.output, 'w') as f:
                f.write(output)
            print(f"Successfully generated bindings to {args.output}", file=sys.stderr)
        else:
            print(output)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
