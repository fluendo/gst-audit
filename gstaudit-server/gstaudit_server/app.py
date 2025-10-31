#!/usr/bin/env python3
import logging
import os

import argparse
import threading
from apispec import APISpec

from girest.uri_parser import URITemplateParser
from girest.app import GIApp
from girest.resolvers import FridaResolver
from connexion import AsyncApp

from connexion.datastructures import MediaTypeDict
from connexion.resolver import Resolver
from starlette.middleware.cors import CORSMiddleware

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
        "warn": logging.WARNING,
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
    description="GstAudit server"
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

# Logger
logger = logging.getLogger("gstaudit")

# Pipeline tracking
pipelines = []  # List of discovered pipelines
pipelines_lock = threading.Lock()

# Create the resolver with Frida
script_path = os.path.join((os.path.dirname(__file__)), 'script.js')
resolver = FridaResolver("Gst", "1.0", args.pid, scripts=[script_path], on_message=_on_message, on_log=_on_log)

# Create the girest GIApp
app = GIApp(__name__, "Gst", "1.0", resolver, default_base_path="/girest")
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

# Add the CORS middleware to let the React app connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run the server
app.run(port=args.port)
