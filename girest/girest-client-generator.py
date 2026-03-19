#!/usr/bin/env python3
"""
girest-client-generator - TypeScript client generator for GIRest schemas.

This tool generates TypeScript client bindings from GObject introspection data,
creating proper class hierarchies with methods organized by their tags.
"""

import argparse
import os
import sys

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, "girest")
sys.path.insert(0, girest_dir)

import gi  # noqa: E402

gi.require_version("GIRepository", "2.0")

from generator import TypeScriptGenerator  # noqa: E402
from main import GIRest  # noqa: E402


def main():
    """Main entry point for girest-ts tool."""
    parser = argparse.ArgumentParser(description="Generate TypeScript bindings from GObject introspection data")
    parser.add_argument("namespace", help="GObject namespace (e.g., 'Gst', 'GLib', 'Gtk')")
    parser.add_argument("version", help="Namespace version (e.g., '1.0', '2.0')")
    parser.add_argument("-o", "--output", required=True, help="Output directory path")
    parser.add_argument("--host", default="localhost", help="Host for REST API calls (default: localhost)")
    parser.add_argument("--port", type=int, default=9000, help="Port for REST API calls (default: 9000)")
    parser.add_argument("--base-path", default="", help="Base path for REST API calls (default: '')")

    args = parser.parse_args()

    try:
        # Generate the OpenAPI schema
        girest = GIRest(args.namespace, args.version)
        spec = girest.generate()
        openapi_schema = spec.to_dict()

        # Generate TypeScript bindings using Jinja2-based generator
        ts_gen = TypeScriptGenerator(openapi_schema, host=args.host, port=args.port, base_path=args.base_path)

        # Multi-file generation (always)
        files = ts_gen.generate(args.output)

        # Write all files
        for file_path, content in files.items():
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            with open(file_path, "w") as f:
                f.write(content)
            print(f"Generated: {file_path}", file=sys.stderr)

        print(f"\nSuccessfully generated {len(files)} files to {args.output}", file=sys.stderr)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback

        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
