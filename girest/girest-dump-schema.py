#!/usr/bin/env python3
"""
girest-dump-schema - OpenAPI schema dumper for GIRest.

This tool generates OpenAPI schema in JSON format from GObject introspection data.
"""
import argparse
import json
import sys
import os

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

from main import GIRest


def main():
    """Main entry point for girest-dump-schema tool."""
    parser = argparse.ArgumentParser(
        description="Generate OpenAPI schema from GObject introspection data"
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
        "--sse-only",
        action="store_true",
        help="Use SSE-only mode: hide callback URLs, return int IDs, skip sync callbacks"
    )
    
    args = parser.parse_args()
    
    try:
        # Generate the OpenAPI schema
        girest = GIRest(args.namespace, args.version, sse_only=args.sse_only)
        spec = girest.generate()
        openapi_schema = spec.to_dict()
        
        # Output the schema as JSON
        output = json.dumps(openapi_schema, indent=2)
        
        # Write to file or stdout
        if args.output:
            with open(args.output, 'w') as f:
                f.write(output)
            print(f"Successfully generated schema to {args.output}", file=sys.stderr)
        else:
            print(output)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
