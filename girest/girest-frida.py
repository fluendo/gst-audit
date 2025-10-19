#!/usr/bin/env python3
"""
girest-frida - Development server for GIRest with Frida integration.

This tool creates a development server that uses Frida to instrument a running
process and expose its GObject introspection API as a REST API.
"""
import argparse
import connexion
import sys
import os

# Add the girest module to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
girest_dir = os.path.join(current_dir, 'girest')
sys.path.insert(0, girest_dir)

from main import GIRest
from resolvers import FridaResolver


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
    
    args = parser.parse_args()
    
    try:
        # Generate the OpenAPI schema
        girest = GIRest(args.namespace, args.version)
        spec = girest.generate()
        
        # Create the connexion app
        app = connexion.App(__name__)
        specd = spec.to_dict()
        
        # Create the resolver with Frida
        resolver = FridaResolver(girest, args.pid)
        
        # Add the API without naming it
        app.add_api(specd, resolver=resolver)
        
        # Run the server
        app.run(port=args.port)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
