#!/usr/bin/env python3
"""
girest-frida - Development server for GIRest with Frida integration.

This tool creates a development server that uses Frida to instrument a running
process and expose its GObject introspection API as a REST API.
"""
import argparse
import sys
import os

from girest.app import GIApp
from girest.resolvers import FridaResolver

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

    try:
        
        # Create the resolver with Frida
        resolver = FridaResolver(args.namespace, args.version, args.pid, sse_buffer_size=args.sse_buffer_size)
        # Create the connexion AsyncApp
        # the actual defition by calling, for example, operation.parameters
        app = GIApp(__name__, args.namespace, args.version, resolver)
        app.run(port=args.port)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
