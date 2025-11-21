# TODO
# We need to get rid of passing the namespace/version, it should be fetched
# based on the actual operation information

import logging
import json
import asyncio
import threading
from collections import deque

from connexion.resolver import Resolver, Resolution
import gi
gi.require_version("GIRepository", "2.0")
from gi.repository import GIRepository
from starlette.responses import StreamingResponse

# Import for type hints
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from main import GIRest

try:
    from .utils import parse_operation_id
except ImportError:
    # Fallback for when module is imported directly (e.g., in tests)
    from utils import parse_operation_id

logger = logging.getLogger("girest")


class GIResolver(Resolver):
    def __init__(self, sse_buffer_size: int = 100):
        # SSE event buffer (ring buffer using deque with maxlen)
        self.sse_buffer_size = sse_buffer_size
        self.sse_events: deque = deque(maxlen=sse_buffer_size)
        self.sse_event = None  # Will be created in event loop
        self._event_loop = None  # Reference to the event loop
        # Counter for assigning unique IDs to events
        # Lock protects both the counter and the deque during event push
        self._event_counter = 0
        self._buffer_lock = threading.Lock()
        super().__init__()

    def push_sse_event(self, event_data: dict):
        """
        Push an event to the SSE buffer. This is thread-safe and non-blocking.
        
        If the buffer is full, the oldest event will be discarded to make room.
        Can be safely called from any thread (e.g., Frida's message handler).
        
        Args:
            event_data: Dictionary containing event data to be sent to SSE clients
        """
        # Assign a unique sequential ID and append to buffer atomically
        # Lock protects both operations to ensure consistency
        with self._buffer_lock:
            event_id = self._event_counter
            self._event_counter += 1
            
            # Wrap the event data with an ID
            event_wrapper = {
                "_sse_id": event_id,
                "data": event_data
            }
            
            self.sse_events.append(event_wrapper)
        
        # Set the event to notify waiting clients (outside lock)
        # Use call_soon_threadsafe if called from a different thread
        if self.sse_event is not None and self._event_loop is not None:
            self._event_loop.call_soon_threadsafe(self.sse_event.set)
    
    async def sse_event_generator(self):
        """
        Async generator that yields SSE events from the buffer.
        
        Yields events from the current position in the buffer and then waits
        for new events to be pushed. Each generator instance tracks its own
        position independently using sequential event IDs.
        
        Note: If the buffer rotates (oldest events are discarded) while a client
        is connected, the client may miss events. This is acceptable for the
        use case as it prevents unbounded memory growth.
        """
        # Initialize event loop and event on first call
        if self.sse_event is None:
            self._event_loop = asyncio.get_running_loop()
            self.sse_event = asyncio.Event()
        
        # Track the last event ID we've sent
        last_sent_id = -1
        
        while True:
            has_new_events = False
            
            # Take an atomic snapshot to avoid mutation during iteration
            with self._buffer_lock:
                snapshot = list(self.sse_events)
            
            # Iterate over the snapshot
            for event_wrapper in snapshot:
                event_id = event_wrapper["_sse_id"]
                if event_id > last_sent_id:
                    last_sent_id = event_id
                    has_new_events = True
                    # Yield only the data, not the wrapper
                    yield event_wrapper["data"]
            
            # If we yielded events, check again for more before waiting
            if has_new_events:
                continue
            
            # Wait for new events
            await self.sse_event.wait()
            self.sse_event.clear()
    
    async def sse_callbacks_endpoint(self):
        """
        SSE endpoint that streams callback events.
        
        This endpoint is registered at /GIRest/callbacks and streams events
        in Server-Sent Events format.
        
        Returns:
            Async generator yielding SSE-formatted messages
        """
        async for event_data in self.sse_event_generator():
            # Format as SSE
            message = f'data: {json.dumps(event_data)}\n\n'
            yield message

    def resolve(self, operation):
        """We overwrite the resolve method to have access to the path schema"""
        return Resolution(
            self.get_function_from_operation(operation), operation.operation_id
        )

    def get_function_from_operation(self, operation):
        async def sse_callback():
            """SSE endpoint for callback events."""
            return StreamingResponse(
                self.sse_callbacks_endpoint(),
                media_type='text/event-stream',
                headers={
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no'
                }
            )
        operation_id = operation.operation_id

        if not operation_id:
            return None

        parsed = parse_operation_id(operation_id)
        if not parsed:
            return None

        namespace, class_name, method_name, operator = parsed
        if namespace == "GIRest" and method_name == "callbacks" and not class_name:
            return sse_callback


class FridaResolver(GIResolver):
    """
    Resolver for Connexion that uses Frida to call functions in a remote process.
    
    This resolver generates JSON representations of GIRepository function/method
    definitions that are compatible with the girest.js Frida script.
    
    The resolver:
    1. Connects to a target process via Frida
    2. Loads the girest.js script
    3. For each API operation, finds the corresponding GIRepository function
    4. Generates a JSON representation of the function signature
    5. Creates a handler that calls the Frida script with the JSON and arguments
    
    Example JSON format:
    {
        "arguments": [
            {
                "name": "this",
                "skipped": false,
                "closure": -1,
                "is_closure": false,
                "destroy": -1,
                "is_destroy": false,
                "direction": 0,
                "type": "pointer",
                "subtype": null
            }
        ],
        "is_method": true,
        "returns": "int32"
    }
    """
    def __init__(
            self,
            namespace: str,
            version: str,
            pid: int,
            *,
            scripts=None,
            on_log=None,
            on_message=None,
            sse_buffer_size=100
        ):
        # Load the corresponding Gir file
        self.repo = GIRepository.Repository()
        self.repo.require(namespace, version, 0)
        self.ns = namespace
        self.pid = pid
        self.session = None
        if not scripts:
            scripts = []
        self.scripts = []
        # Build enum value mappings for converting string names to integers
        self.enum_mappings = {}
        self._build_enum_mappings()
        # Connect to the corresponding process
        self._connect_frida(scripts, on_log, on_message)
        super().__init__(sse_buffer_size)
 
    def _build_enum_mappings(self):
        """Build mappings from enum string names to integer values"""
        for i in range(0, self.repo.get_n_infos(self.ns)):
            info = self.repo.get_info(self.ns, i)
            info_type = info.get_type()
            if info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
                full_name = f"{info.get_namespace()}{info.get_name()}"
                mapping = {}
                n_values = GIRepository.enum_info_get_n_values(info)
                for j in range(n_values):
                    value_info = GIRepository.enum_info_get_value(info, j)
                    mapping[value_info.get_name()] = GIRepository.value_info_get_value(value_info)
                self.enum_mappings[full_name] = mapping

    def _load_script(self, script_path, on_log, on_message):
        s = None
        with open(script_path, 'r') as f:
            s = self.session.create_script(f.read())
        
        # Set up message handler
        s.on('message', on_message)
        s.set_log_handler(on_log)
 
        # Load and initialize the script
        s.load()
        s.exports_sync.init()
        self.scripts.append(s)

    def _connect_frida(self, scripts, on_log, on_message):
        """Connect to the target process using Frida"""
        import frida
        import os

        # Attach to the process
        self.session = frida.attach(self.pid)
        
        # We need to find the girest.js file
        script_path = os.path.join(os.path.dirname((os.path.dirname(__file__))), 'girest.js')
        self._load_script(script_path, self._on_log, self._on_message)
        # Now load every passed in script and register the on_log and on_message
        for s in scripts:
            self._load_script(s, on_log, on_message)

    def _on_log(self, level, message):
        """Handle the console from js"""
        levels = {
            "debug": logging.DEBUG,
            "info": logging.INFO,
            "warning": logging.WARNING,
            "error": logging.ERROR,
        }
        logger.log(levels[level], message)

    def _on_message(self, message, data):
        """Handle messages from the Frida script"""
        if message["type"] != "send":
            return
        payload = message.get("payload", {})
        kind = payload.get("kind")
        
        # Handle callbacks by pushing them to the SSE buffer
        if kind == "callback":
            self.push_sse_event(payload["data"])
        else:
            # For now, just log other messages
            logger.debug(f"Message from Frida: {message}")
    
    def _type_to_json(self, t):
        """Convert GIRepository type to JSON type string"""
        # Get the type tag
        tag_enum = GIRepository.type_info_get_tag(t)
        tag = GIRepository.type_tag_to_string(tag_enum)
        
        # Check if it's an interface type
        if tag == "interface":
            interface = GIRepository.type_info_get_interface(t)
            if interface:
                info_type = interface.get_type()
                if info_type == GIRepository.InfoType.CALLBACK:
                    return "callback"
                elif info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
                    return "int32"
                elif info_type == GIRepository.InfoType.STRUCT:
                    # Check if this is a struct with a registered GType (boxed type)
                    gtype = GIRepository.registered_type_info_get_g_type(interface)
                    if gtype != 0:
                        return "gtype"
                    else:
                        return "struct"
        if tag == "void" and GIRepository.type_info_is_pointer(t):
            return "pointer"
        # Map GIRepository type tags to JSON type strings
        type_map = {
            "gboolean": "bool",
            "gint8": "int8",
            "guint8": "uint8",
            "gint16": "int16",
            "guint16": "uint16",
            "gint32": "int32",
            "guint32": "uint32",
            "gint64": "int64",
            "guint64": "uint64",
            "utf8": "string",
            "gfloat": "float",
            "gdouble": "double",
            "GType": "int64", # FIXME beware of this
            "void": "void"
        }

        return type_map.get(tag, "pointer")
    
    def _arg_to_json(self, arg):
        """Convert argument info to JSON representation"""
        arg_type = GIRepository.arg_info_get_type(arg)
        ret = {
            "name": arg.get_name(),
            "skipped": False,
            "closure": GIRepository.arg_info_get_closure(arg),
            "is_closure": False,
            "destroy": GIRepository.arg_info_get_destroy(arg),
            "is_destroy": False,
            "direction": GIRepository.arg_info_get_direction(arg),
            "type": self._type_to_json(arg_type),
            "subtype": None
        }
        
        # Handle callbacks
        if ret["type"] == "callback":
            callback = GIRepository.type_info_get_interface(arg_type)
            ret["subtype"] = self._callable_to_json(callback)

        # Handle structs
        if ret["type"] == "struct":
            struct_info = GIRepository.type_info_get_interface(arg_type)
            ret["struct_size"] = GIRepository.struct_info_get_size(struct_info)
            if ret["direction"] == GIRepository.Direction.OUT and GIRepository.arg_info_is_caller_allocates(arg):
                ret["direction"] = GIRepository.Direction.IN

        # Handle gtypes
        if ret["type"] == "gtype":
            struct_info = GIRepository.type_info_get_interface(arg_type)
            if ret["direction"] == GIRepository.Direction.OUT and GIRepository.arg_info_is_caller_allocates(arg):
                ret["direction"] = GIRepository.Direction.IN
        
        return ret
    
    def _callable_to_json(self, cb, is_method=False):
        """Convert callable info to JSON representation"""
        ret = {
            "arguments": [],
            "is_method": is_method,
            "returns": self._type_to_json(GIRepository.callable_info_get_return_type(cb))
        }
        
        if is_method:
            # Prepend self argument
            ra = {
                "name": "this",
                "skipped": False,
                "closure": -1,
                "is_closure": False,
                "destroy": -1,
                "is_destroy": False,
                "direction": GIRepository.Direction.IN,
                "type": "pointer",
                "subtype": None
            }
            ret["arguments"].append(ra)
        
        # Add all arguments
        n_args = GIRepository.callable_info_get_n_args(cb)
        for i in range(n_args):
            arg = GIRepository.callable_info_get_arg(cb, i)
            ra = self._arg_to_json(arg)
            ret["arguments"].append(ra)
        
        # Mark skipped arguments
        for r in ret["arguments"]:
            if r["closure"] >= 0:
                ret["arguments"][r["closure"]]["skipped"] = True
                ret["arguments"][r["closure"]]["is_closure"] = True
            if r["destroy"] >= 0:
                ret["arguments"][r["destroy"]]["skipped"] = True
                ret["arguments"][r["destroy"]]["is_destroy"] = True
            if r["direction"] == GIRepository.Direction.OUT:
                r["skipped"] = True

        return ret
    
    def _method_to_json(self, method):
        """Generate complete method JSON representation"""
        flags = GIRepository.function_info_get_flags(method)
        is_method = bool(flags & GIRepository.FunctionInfoFlags.IS_METHOD)
        return self._callable_to_json(method, is_method=is_method)
    
    def _find_function_info(self, namespace, class_name, method_name):
        """Find function info from operation_id"""
        # operation_id format: {namespace}_{object_name}_{method_name}
        # or {namespace}__{function_name} for standalone functions
        
        # Search through the repository
        n_infos = self.repo.get_n_infos(namespace)
        for i in range(n_infos):
            info = self.repo.get_info(namespace, i)
            info_type = info.get_type()
            
            if info_type == GIRepository.InfoType.FUNCTION:
                # Standalone function: namespace__function_name
                if class_name is None and info.get_name() == method_name:
                    return info
            elif info_type == GIRepository.InfoType.OBJECT:
                # Method: namespace_objectname_methodname
                if class_name and info.get_name() == class_name:
                    # Search for the method
                    n_methods = GIRepository.object_info_get_n_methods(info)
                    for j in range(n_methods):
                        method = GIRepository.object_info_get_method(info, j)
                        if method.get_name() == method_name:
                            return method
            elif info_type == GIRepository.InfoType.STRUCT:
                # Method: namespace_objectname_methodname
                if class_name and info.get_name() == class_name:
                    # Search for the method
                    n_methods = GIRepository.struct_info_get_n_methods(info)
                    for j in range(n_methods):
                        method = GIRepository.struct_info_get_method(info, j)
                        if method.get_name() == method_name:
                            return method
            elif info_type in [GIRepository.InfoType.ENUM, GIRepository.InfoType.FLAGS]:
                # Method: namespace_objectname_methodname
                if class_name and info.get_name() == class_name:
                    # Search for the method
                    n_methods = GIRepository.enum_info_get_n_methods(info)
                    for j in range(n_methods):
                        method = GIRepository.enum_info_get_method(info, j)
                        if method.get_name() == method_name:
                            return method
        
        return None

    def _create_get_type_handler(self, type_info):
        symbol = GIRepository.registered_type_info_get_type_init(type_info)
        _type = {
            "arguments": [],
            "is_method": False,
            "returns": "int64" # FIXME beware of this
        }

        async def get_type_handler(*args, **kwargs):
            # Call the Frida script's generic alloc function
            result = await asyncio.to_thread(
                self.scripts[0].exports_sync.call, symbol, _type
            )
            return result

        return get_type_handler

    def _create_generic_new_handler(self, type_info):
        """Create handler for generic struct allocation"""
        # Only structs have size, for other types we may need different handling
        if type_info.get_type() == GIRepository.InfoType.STRUCT:
            size = GIRepository.struct_info_get_size(type_info)
        else:
            # For non-struct types, we might need a different approach
            # For now, assume a default size or handle differently
            size = 0  # This might need specific handling per type
        
        async def generic_new_handler(*args, **kwargs):
            # Call the Frida script's generic alloc function
            result = await asyncio.to_thread(
                self.scripts[0].exports_sync.alloc, size
            )
            return {"return": {"ptr": result}}
        
        return generic_new_handler
    
    def _create_generic_free_handler(self, type_info):
        """Create handler for generic struct/object deallocation"""
        async def generic_free_handler(*args, **kwargs):
            # Extract the self parameter (pointer to free)
            obj = kwargs.get('self')
            if obj is None:
                raise ValueError("Missing 'self' parameter for free operation")
            if not "ptr" in obj:
                raise ValueError("Missing 'ptr' value")

            # Call the Frida script's generic free function
            await asyncio.to_thread(
                self.scripts[0].exports_sync.free, obj["ptr"]
            )
            return None
        
        return generic_free_handler

    def _parse_response(self, result, operation, field_type_info=None, method_info=None):
        """
        Parse and transform the response from Frida based on OpenAPI schema.
        
        Args:
            result: The raw result from Frida
            operation: The OpenAPI operation object
            field_type_info: Optional GITypeInfo for field operations
            method_info: Optional GICallableInfo for method operations (used for enum conversion)
            
        Returns:
            Transformed result with proper type conversions
        """
        if not result:
            return result
        
        # Ok, now we have a response, check the spec about the response type to see if
        # there are any structs or objects
        for k, v in result.items():
            responses = operation.responses
            # Take into account that the endpoint is already resolved
            k_def = responses["200"]["content"]["application/json"]["schema"]["properties"][k]
            if "x-gi-type" in k_def and k_def["x-gi-type"] in ["object", "struct", "gtype"]:
                result[k] = {"ptr": v}
            if "type" in k_def and k_def["type"] == "object":
                result[k] = {"ptr": v}
            # Convert enum integers back to strings for OpenAPI compliance
            if "x-gi-type" in k_def and k_def["x-gi-type"] in ["enum", "flags"]:
                # Determine which type info to use
                type_info = field_type_info
                if method_info and not field_type_info:
                    # For method calls, get return type from method info
                    type_info = GIRepository.callable_info_get_return_type(method_info)
                
                if type_info:
                    interface = GIRepository.type_info_get_interface(type_info)
                    full_name = f"{interface.get_namespace()}{interface.get_name()}"
                    enum_mapping = self.enum_mappings.get(full_name, {})
                    # Reverse lookup: find string name for integer value
                    for enum_name, enum_value in enum_mapping.items():
                        if enum_value == v:
                            result[k] = enum_name
                            break
        
        return result

    def _create_field_get_handler(self, offset, field_type_json, field_type_info, operation):
        """Create handler for reading a struct field"""
        async def field_get_handler(*args, **kwargs):
            # Extract the self parameter (struct pointer)
            obj = kwargs.get('self')
            if obj is None:
                raise ValueError("Missing 'self' parameter for field get")
            if not "ptr" in obj:
                raise ValueError("Missing 'ptr' value")
            
            # Call the Frida script's get function
            raw_result = await asyncio.to_thread(
                self.scripts[0].exports_sync.get_field, 
                obj["ptr"], 
                offset, 
                field_type_json
            )
            
            # Wrap in result dictionary
            result = {"return": raw_result}
            
            # Use common response parsing logic
            return self._parse_response(result, operation, field_type_info)
        
        return field_get_handler

    def _create_field_put_handler(self, offset, field_type_json, field_type_info, operation):
        """Create handler for writing a struct field"""
        async def field_put_handler(*args, **kwargs):
            # Extract the self parameter (struct pointer)
            obj = kwargs.get('self')
            if obj is None:
                raise ValueError("Missing 'self' parameter for field put")
            if not "ptr" in obj:
                raise ValueError("Missing 'ptr' value")
            
            # Extract the value to write
            value = kwargs.get('value')
            if value is None:
                raise ValueError("Missing 'value' parameter for field put")
            
            # Handle object/struct values (extract ptr)
            if isinstance(value, dict) and 'ptr' in value:
                value = value['ptr']
            
            # Call the Frida script's set function
            await asyncio.to_thread(
                self.scripts[0].exports_sync.set_field, 
                obj["ptr"], 
                offset, 
                field_type_json,
                value
            )
            
            return None
        
        return field_put_handler

    # TODO what to access here, the info from GI (_method) or the type info for Frida (_type)
    def create_frida_handler(self):
        """Create handler that calls Frida with the method JSON, converting enum strings to integers,
           objects to pointers, etc.
        """
        async def frida_resolver_handler(_method=None, _type=None, _endpoint=None, *args, **kwargs):
            """Call Frida to the actual call the symbol
               The method receives the GI's BaseInfo (_method)
               The JSON representation of the GI information (_type)
               The OpenAPI endpoint entry
            """
            # Get the symbol from the method info
            symbol = GIRepository.function_info_get_symbol(_method)
            
            # Convert enum string values to integers before calling Frida
            converted_kwargs = {}
            n_args = GIRepository.callable_info_get_n_args(_method)

            # Add 'self' as a parameter
            if _type["is_method"]:
                converted_kwargs["this"] = kwargs["self"]["ptr"]

            for i in range(n_args):
                arg = GIRepository.callable_info_get_arg(_method, i)
                arg_name = arg.get_name()
                
                if arg_name in kwargs:
                    arg_type = GIRepository.arg_info_get_type(arg)
                    tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(arg_type))
                    
                    # Check if this is an interface type
                    if tag == "interface":
                        interface = GIRepository.type_info_get_interface(arg_type)
                        if interface:
                            info_type = interface.get_type()
                            
                            if info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
                                # Convert string enum name to integer value
                                full_name = f"{interface.get_namespace()}{interface.get_name()}"
                                enum_mapping = self.enum_mappings.get(full_name, {})
                                value = kwargs[arg_name]
                                if isinstance(value, str) and value in enum_mapping:
                                    converted_kwargs[arg_name] = enum_mapping[value]
                                else:
                                    converted_kwargs[arg_name] = value
                            elif info_type in [GIRepository.InfoType.OBJECT, GIRepository.InfoType.STRUCT]:
                                # For GObject types, extract the 'ptr' field from the JSON object
                                # Our URI parser deserializes "ptr,value" into {"ptr": "value"}
                                # but Frida expects just the pointer value
                                value = kwargs[arg_name]
                                if isinstance(value, dict) and 'ptr' in value:
                                    converted_kwargs[arg_name] = value['ptr']
                                else:
                                    # If it's already a string/int pointer value, use it as-is
                                    converted_kwargs[arg_name] = value
                            else:
                                converted_kwargs[arg_name] = kwargs[arg_name]
                        else:
                            converted_kwargs[arg_name] = kwargs[arg_name]
                    else:
                        converted_kwargs[arg_name] = kwargs[arg_name]
            
            # Call the Frida script with the symbol and method JSON
            # Use asyncio.to_thread to avoid blocking the event loop with the sync Frida call
            result = await asyncio.to_thread(
                self.scripts[0].exports_sync.call, symbol, _type, *converted_kwargs.values()
            )

            if not result:
                return

            # Use common response parsing logic
            return self._parse_response(result, _endpoint, method_info=_method)

        return frida_resolver_handler

    def get_function_from_operation(self, operation):
        """Resolve function from operation_id and return handler"""
        ret = super().get_function_from_operation(operation)
        if ret:
            return ret

        operation_id = operation.operation_id

        if not operation_id:
            return None

        parsed = parse_operation_id(operation_id)
        if not parsed:
            return None

        namespace, class_name, method_name, operator = parsed
        
        # Check if this is a field operation based on the operator
        if operator in ['get', 'put']:
            # This is a field access operation
            field_name = method_name
            
            # Find the struct info
            struct_info = None
            n_infos = self.repo.get_n_infos(namespace)
            for i in range(n_infos):
                info = self.repo.get_info(namespace, i)
                if info.get_type() == GIRepository.InfoType.STRUCT and info.get_name() == class_name:
                    struct_info = info
                    break
            
            if struct_info:
                # Find the field info
                n_fields = GIRepository.struct_info_get_n_fields(struct_info)
                for i in range(n_fields):
                    field_info = GIRepository.struct_info_get_field(struct_info, i)
                    if field_info.get_name() == field_name:
                        # Extract field metadata
                        field_offset = GIRepository.field_info_get_offset(field_info)
                        field_flags = GIRepository.field_info_get_flags(field_info)
                        is_writable = bool(field_flags & GIRepository.FieldInfoFlags.WRITABLE)
                        field_type_info = GIRepository.field_info_get_type(field_info)
                        field_type_json = self._type_to_json(field_type_info)
                        
                        if operator == "get":
                            return self._create_field_get_handler(field_offset, field_type_json, field_type_info, operation)
                        elif operator == "put" and is_writable:
                            return self._create_field_put_handler(field_offset, field_type_json, field_type_info, operation)
                        
                        return None
        
        method_info = self._find_function_info(namespace, class_name, method_name)
        if method_info:
            # Generate the JSON representation
            method_json = self._method_to_json(method_info)

            # Create and return the handler with method_info and method_json as defaults
            ret = self.create_frida_handler()
            ret.__defaults__ = (method_info, method_json, operation)
            return ret
        # Check for the artificial methods
        elif method_name in ['new', 'free', "get_type"]:
            # Try to find the info (struct, object, enum, or flags)
            type_info = None
            n_infos = self.repo.get_n_infos(namespace)
            for i in range(n_infos):
                info = self.repo.get_info(namespace, i)
                info_type = info.get_type()
                # Check for struct, object, enum, or flags that match the class name
                if (info_type in [GIRepository.InfoType.STRUCT, 
                                  GIRepository.InfoType.OBJECT,
                                  GIRepository.InfoType.ENUM,
                                  GIRepository.InfoType.FLAGS] and 
                    info.get_name() == class_name):
                    type_info = info
                    break

            if type_info:
                if method_name == 'new':
                    return self._create_generic_new_handler(type_info)
                elif method_name == 'free':
                    return self._create_generic_free_handler(type_info)
                elif method_name == 'get_type':
                    return self._create_get_type_handler(type_info)
        
            return None
        else:
            return None
