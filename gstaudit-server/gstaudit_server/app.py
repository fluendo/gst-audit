#!/usr/bin/env python3
from girest.main import GIRest
from girest.resolvers import FridaResolver
from connexion import AsyncApp

def add_pipeline(self, pipeline_data: dict):
    """
    Add a pipeline to the list of discovered pipelines.
    
    This is thread-safe and can be called from any thread (e.g., Frida's message handler).
    
    Args:
        pipeline_data: Dictionary containing pipeline data (ptr, name, etc.)
    """
    with self._pipelines_lock:
        # Check if pipeline is already in the list (by ptr)
        ptr = pipeline_data.get("ptr")
        if ptr and not any(p.get("ptr") == ptr for p in self.pipelines):
            self.pipelines.append(pipeline_data)

def get_pipelines(self) -> list:
    """
    Get the current list of discovered pipelines.
    
    Returns:
        List of pipeline dictionaries
    """
    with self._pipelines_lock:
        # Return a copy to avoid external modifications
        return list(self.pipelines)

def _on_log(self, level, message):
    """Handle the console from js"""
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warn": logging.WARNING,
        "error": logging.ERROR,
    }
    logger.log(levels[level], message)

def _on_message(self, message, data):
    """Handle messages from the Frida script"""
    if message["type"] != "send":
        return
    payload = message.get("payload", {})
    kind = payload.get("kind")
    
    # Handle pipeline discovery messages
    if kind == "pipeline":
        self.girest.add_pipeline(payload["data"])
    else:
        # For now, just log other messages
        logger.debug(f"Message from Frida: {message}")


# Pipeline tracking
self.pipelines: list = []  # List of discovered pipelines
self._pipelines_lock = threading.Lock()

girest = GIRest("Gst", "1.0")
spec = girest.generate()
   
# Create the connexion AsyncApp
app = connexion.AsyncApp(__name__)
specd = spec.to_dict()

# Create the resolver with Frida
resolver = FridaResolver(scripts=[], specd, girest, args.pid)
# Add the API with custom URI parser and validator
app.add_api(
    specd,
    resolver=resolver,
    uri_parser_class=URITemplateParser,
    validator_map=custom_validator_map,
)

# Register the pipelines endpoint at /GIRest/pipelines
@app.route('/GstAudit/pipelines', methods=['GET'])
async def get_pipelines(arg):
    """Endpoint for retrieving discovered GStreamer pipelines."""
    pipelines = girest.get_pipelines()
    return pipelines

# Run the server
app.run(port=args.port)
