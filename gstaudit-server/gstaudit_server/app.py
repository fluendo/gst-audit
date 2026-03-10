#!/usr/bin/env python3
import logging
import os
import argparse
import threading
import subprocess
import shlex
import ctypes
import signal
import time

from apispec import APISpec

from girest.uri_parser import URITemplateParser
from girest.app import GIApp
from girest.resolvers import FridaResolver
from connexion import AsyncApp

from uvicorn.config import LOGGING_CONFIG
from uvicorn.logging import DefaultFormatter

from connexion.datastructures import MediaTypeDict
from connexion.resolver import Resolver
from starlette.middleware.cors import CORSMiddleware

def create_stub():
    """
    Fork a child process with GStreamer libraries pre-loaded.
    
    The child process will:
    1. Load the GStreamer libraries
    2. Keep running to allow Frida to attach
    
    Returns:
        PID of the child process (from parent), or does not return (from child)
    """
    # GStreamer libraries to load
    lib_paths = [
        "libgstreamer-1.0.so.0",
        "libgobject-2.0.so.0",
        "libglib-2.0.so.0"
    ]
    
    pid = os.fork()
    
    if pid > 0:
        # PARENT: Return the PID to the caller
        return pid
    else:
        # CHILD: This is the process Frida will attach to
        child_pid = os.getpid()
        
        # 1. Map the libraries into memory
        for lib in lib_paths:
            try:
                ctypes.CDLL(lib)
            except OSError as e:
                # Silently continue if library fails to load
                pass
        
        # 2. Keep the process alive for Frida to attach
        # The process needs to be running (not stopped) for Frida to attach successfully
        while True:
            time.sleep(1)

class GstAuditResolver(Resolver):
    def resolve_function_from_operation_id(self, operation_id):
        async def get_pipelines(*args, **kwargs):
            """Endpoint for retrieving discovered GStreamer pipelines."""
            pipelines = _get_pipelines()
            return [p for p in pipelines if p["name"].isascii()]

        return get_pipelines

def _add_pipeline(pipeline_data: dict):
    """
    Add a pipeline to the list of discovered pipelines.
    
    This is thread-safe and can be called from any thread (e.g., Frida's message handler).
    
    Args:
        pipeline_data: Dictionary containing pipeline data (ptr, name, etc.)
    """
    with pipelines_lock:
        # Check if pipeline is already in the list (by ptr)
        ptr = pipeline_data.get("ptr")
        if ptr and not any(p.get("ptr") == ptr for p in pipelines):
            pipelines.append(pipeline_data)

def _get_pipelines() -> list:
    """
    Get the current list of discovered pipelines.
    
    Returns:
        List of pipeline dictionaries
    """
    with pipelines_lock:
        # Return a copy to avoid external modifications
        return list(pipelines)

def _on_log(level, message):
    """Handle the console from js"""
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
    }
    logger.log(levels[level], message)

def _on_message(message, data):
    """Handle messages from the Frida script"""
    if message["type"] != "send":
        return
    payload = message.get("payload", {})
    kind = payload.get("kind")
    
    # Handle pipeline discovery messages
    if kind == "pipeline":
        _add_pipeline(payload["data"])
    else:
        # For now, just log other messages
        logger.debug(f"Message from Frida: {message}")

# Parsing of arguments
parser = argparse.ArgumentParser(
    description="GstAudit server - Instrument and audit GStreamer pipelines"
)

# Common arguments shared by all subcommands
parser.add_argument(
    "--host",
    type=str,
    default="localhost",
    help="Host to bind the server to (default: localhost)"
)
parser.add_argument(
    "--port",
    type=int,
    default=9000,
    help="Port to run the server on (default: 9000)"
)

# Create subparsers for the three modes
subparsers = parser.add_subparsers(dest="mode", required=True, help="Operation mode")

# 1. Connect mode - attach to an existing process
connect_parser = subparsers.add_parser(
    "connect",
    help="Connect to an existing GStreamer process by PID"
)
connect_parser.add_argument(
    "pid",
    type=int,
    help="Process ID to instrument"
)

# 2. Create mode - create a new empty process (for manual pipeline creation)
create_parser = subparsers.add_parser(
    "create",
    help="Create a new GStreamer process (for manual pipeline creation via API)"
)

# 3. Launch mode - launch a pipeline using gst-launch syntax
launch_parser = subparsers.add_parser(
    "launch",
    help="Launch a GStreamer pipeline using gst-launch-1.0 syntax"
)
launch_parser.add_argument(
    "pipeline",
    type=str,
    help="GStreamer pipeline description (gst-launch-1.0 syntax)"
)

args = parser.parse_args()

# Setup the log
logger = logging.getLogger("gstaudit")
# Use the same logger Uvicorn uses
handler = logging.StreamHandler()
handler.setFormatter(DefaultFormatter(fmt=LOGGING_CONFIG["formatters"]["default"]["fmt"]))
logger = logging.getLogger("gstaudit")
logger.handlers = []  # Remove any existing handlers
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

# Pipeline tracking
pipelines = []  # List of discovered pipelines
pipelines_lock = threading.Lock()

# Process the mode and get the PID
pid = None
spawned_process = None

if args.mode == "connect":
    # Mode 1: Connect to existing process
    pid = args.pid
    logger.info(f"Connecting to existing process with PID: {pid}")

elif args.mode == "create":
    # Mode 2: Create a new empty process with GStreamer pre-loaded
    # Fork a child process with GStreamer libraries loaded
    pid = create_stub()
    logger.info(f"Created new GStreamer process with PID: {pid}")

elif args.mode == "launch":
    # Mode 3: Launch a pipeline from command line
    command = shlex.split(f"gst-launch-1.0 {args.pipeline}")
    spawned_process = subprocess.Popen(command)
    pid = spawned_process.pid
    logger.info(f"Launched pipeline '{args.pipeline}' with PID: {pid}")

# Create the resolver with Frida
script_path = os.path.join((os.path.dirname(__file__)), 'script.js')
resolver = FridaResolver("Gst", "1.0", pid, scripts=[script_path], on_message=_on_message, on_log=_on_log)

# Create the girest GIApp
app = GIApp(__name__, "Gst", "1.0", resolver, default_base_path="/girest")

# Add CORS middleware before exception handling to ensure it handles OPTIONS requests
from connexion.middleware import MiddlewarePosition
app.add_middleware(
    CORSMiddleware,
    position=MiddlewarePosition.BEFORE_EXCEPTION,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create our own API for fetching the pipelines
gstaudit_spec = APISpec(
    title="GstAudit REST API",
    version="0.1",
    openapi_version="3.0.2",
)

operation = {
    "summary": "",
    "description": "",
    "operationId": "get_pipelines",
    "tags": ["GstAudit"],
    "parameters": [],
    "responses": {
        "200": {
            "description": "Get the GstPipelines available in the process",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                }
            }
        }
    }
}

gstaudit_spec.path(path="/GstAudit/pipelines", operations={"get": operation})

app.add_api(gstaudit_spec.to_dict(), resolver=GstAuditResolver(), base_path="/gstaudit")

# Run the server
app.run(port=args.port)
