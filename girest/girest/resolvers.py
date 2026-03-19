# TODO
# We need to get rid of passing the namespace/version, it should be fetched
# based on the actual operation information

import asyncio
import json
import logging
import queue
import threading
from typing import Any, Dict

import connexion
import gi
from connexion.resolver import Resolution, Resolver

gi.require_version("GIRepository", "2.0")

from gi.repository import GIRepository  # noqa: E402

try:
    from .utils import parse_operation_id
except ImportError:
    # Fallback for when module is imported directly (e.g., in tests)
    from utils import parse_operation_id  # noqa: E402

from .callbacks import CallbackHandler  # noqa: E402

logger = logging.getLogger("girest")


# ============================================================================
# Helper Classes for Frida Communication
# ============================================================================


class FridaCommandSerializer:
    """Serializes Python API calls into Frida command format."""

    @staticmethod
    def serialize_call(symbol: str, method_info: dict, args: list) -> dict:
        """
        Serialize a function/method call.

        Args:
            symbol: Native function symbol name
            method_info: GI method metadata (JSON representation)
            args: List of arguments

        Returns:
            Command dictionary for Frida
        """
        return {"type": "call", "symbol": symbol, "method_info": method_info, "args": args}

    @staticmethod
    def serialize_get_field(struct_ptr: str, offset: int, field_type: dict, struct_type_info: dict = None) -> dict:
        """
        Serialize a get_field operation.

        Args:
            struct_ptr: Pointer to struct
            offset: Field offset in bytes
            field_type: Field type metadata
            struct_type_info: Optional struct metadata (for array length lookups)

        Returns:
            Command dictionary for Frida
        """
        return {
            "type": "get_field",
            "ptr": struct_ptr,
            "offset": offset,
            "field_type": field_type,
            "struct_type_info": struct_type_info,
        }

    @staticmethod
    def serialize_set_field(struct_ptr: str, offset: int, field_type: dict, value: Any) -> dict:
        """
        Serialize a set_field operation.

        Args:
            struct_ptr: Pointer to struct
            offset: Field offset in bytes
            field_type: Field type metadata
            value: Value to set

        Returns:
            Command dictionary for Frida
        """
        return {
            "type": "set_field",
            "ptr": struct_ptr,  # Changed from "struct_ptr" to match run() dispatcher
            "offset": offset,
            "field_type": field_type,
            "value": value,
        }

    @staticmethod
    def serialize_alloc(size: int) -> dict:
        """
        Serialize a memory allocation.

        Args:
            size: Number of bytes to allocate

        Returns:
            Command dictionary for Frida
        """
        return {"type": "alloc", "size": size}

    @staticmethod
    def serialize_free(ptr: str) -> dict:
        """
        Serialize a memory free.

        Args:
            ptr: Pointer to free

        Returns:
            Command dictionary for Frida
        """
        return {"type": "free", "ptr": ptr}


class FridaMessageBus:
    """
    Manages bidirectional communication with Frida script.

    Handles two communication patterns:
    1. RPC calls: Direct synchronous calls via exports_sync.run()
    2. Queued calls: Asynchronous message-based calls with correlation IDs
       (used for reentrant calls from callback context)
    """

    def __init__(self, script):
        """
        Initialize the message bus.

        Args:
            script: Frida script instance
        """
        self.script = script
        self._queued_responses: Dict[str, queue.Queue] = {}
        self._response_lock = threading.Lock()

    def execute(self, command: dict, headers: dict, is_async: bool = False, timeout: float = 30.0) -> Any:
        """
        Execute command via appropriate channel based on headers.

        Checks for X-Correlation-Id header to determine execution path:
        - If present: Uses queued execution (for callback context/thread affinity)
        - If absent: Uses direct RPC execution

        Args:
            command: Serialized command dictionary
            headers: HTTP request headers (should be connexion.request.headers or dict-like)
            is_async: If True with correlation_id, fire-and-forget (don't wait for response)
            timeout: Timeout in seconds

        Returns:
            Result from Frida (None if is_async=True)

        Raises:
            TimeoutError: If response not received within timeout
            Exception: If Frida reports an error
        """
        correlation_id = headers.get("X-Correlation-Id")

        if correlation_id:
            return self._execute_queued(command, correlation_id, is_async, timeout)
        else:
            return self._execute_direct(command, timeout)

    def _execute_direct(self, command: dict, timeout: float = 30.0) -> Any:
        """
        Execute command directly via RPC (blocking).
        Used for normal API calls without correlation ID.

        Args:
            command: Serialized command dictionary
            timeout: Timeout in seconds (currently not enforced for RPC)

        Returns:
            Result from Frida
        """
        command_json = json.dumps(command)
        return self.script.exports_sync.run(command_json)

    def _execute_queued(self, command: dict, correlation_id: str, is_async: bool = False, timeout: float = 30.0) -> Any:
        """
        Execute command via message queue (for callback context).
        Sends command to Frida and waits for response via on_message.

        This is used for reentrant API calls from within callbacks, ensuring
        the command executes on the correct Frida thread (the callback thread).

        Args:
            command: Serialized command dictionary
            correlation_id: Correlation ID for routing to callback thread
            is_async: If True, fire-and-forget (don't wait for response)
            timeout: Timeout in seconds

        Returns:
            Result from Frida (None if is_async=True)

        Raises:
            TimeoutError: If response not received within timeout
            Exception: If Frida reports an error
        """
        # Serialize command to JSON string
        command_json = json.dumps(command)

        # Send queued-call message to Frida using callback-specific type
        # The Frida callback's recv() loop will receive this on the correct thread
        self.script.post(
            {
                "type": f"callback-{correlation_id}",
                "kind": "queued-call",
                "correlation_id": correlation_id,
                "command": command_json,
                "is_async": is_async,
            }
        )

        # If async, don't wait for response
        if is_async:
            logger.debug(f"Async queued call sent for correlation_id={correlation_id} (fire-and-forget)")
            return None

        # For synchronous calls, create response queue and wait
        response_queue = queue.Queue(maxsize=1)

        with self._response_lock:
            self._queued_responses[correlation_id] = response_queue

        try:
            # Wait for response (blocks until message arrives)
            try:
                response = response_queue.get(timeout=timeout)
            except queue.Empty:
                raise TimeoutError(f"Queued call timed out after {timeout}s for correlation_id={correlation_id}")

            # Check for errors from Frida
            if not response.get("success", True):
                error = response.get("error", "Unknown error")
                raise Exception(f"Frida execution failed: {error}")

            return response.get("result")

        finally:
            # Cleanup: remove queue to prevent memory leaks
            with self._response_lock:
                self._queued_responses.pop(correlation_id, None)

    def handle_response_message(self, correlation_id: str, response: dict):
        """
        Called from on_message when a queued-call-response arrives.
        Wakes up the thread waiting in execute_queued().

        Args:
            correlation_id: Correlation ID of the response
            response: Response payload from Frida
        """
        with self._response_lock:
            if correlation_id in self._queued_responses:
                response_queue = self._queued_responses[correlation_id]
                response_queue.put(response)
            else:
                logger.warning(f"Received queued-call-response for unknown correlation_id: {correlation_id}")


class GIResolver(Resolver):
    def __init__(self):
        super().__init__()

    def resolve(self, operation):
        """We overwrite the resolve method to have access to the path schema"""
        return Resolution(self.get_function_from_operation(operation), operation.operation_id)

    def get_function_from_operation(self, operation):
        operation_id = operation.operation_id

        if not operation_id:
            return None

        parsed = parse_operation_id(operation_id)
        if not parsed:
            return None

        # No special handling needed for standard operations
        return None


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
                "skip_in": false,
                "skip_out": false,
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
        # Callback ID counter for URL-based callbacks
        self._callback_id_counter = 0
        # Callback metadata registry: callback_id -> {url, session_id, secret, scope}
        self._callback_registry = {}

        # Initialize helper classes for Frida communication
        self.command_serializer = FridaCommandSerializer()
        self.message_bus = None  # Will be initialized after Frida connection

        # Connect to the corresponding process
        self._connect_frida(scripts, on_log, on_message)

        # Initialize message bus with the Frida script
        self.message_bus = FridaMessageBus(self.scripts[0])

        super().__init__()

    def _build_enum_mappings(self):
        """Build mappings from enum string names to integer values"""
        # Build list of namespaces to process (main namespace + dependencies)
        namespaces_to_process = [self.ns]
        dependencies = self.repo.get_dependencies(self.ns)
        if dependencies:
            for dep in dependencies:
                # Parse namespace from dependency string (format: "Namespace-Version")
                dep_ns = dep.split("-")[0]
                namespaces_to_process.append(dep_ns)

        # Process enums from all namespaces
        for ns in namespaces_to_process:
            for i in range(0, self.repo.get_n_infos(ns)):
                info = self.repo.get_info(ns, i)
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
        with open(script_path, "r") as f:
            s = self.session.create_script(f.read())

        # Set up message handler
        s.on("message", on_message)
        s.set_log_handler(on_log)

        # Load and initialize the script
        s.load()
        s.exports_sync.init()
        self.scripts.append(s)

    def _connect_frida(self, scripts, on_log, on_message):
        """Connect to the target process using Frida"""
        import os

        import frida

        # Attach to the process
        self.session = frida.attach(self.pid)

        # We need to find the girest.js file
        script_path = os.path.join(os.path.dirname((os.path.dirname(__file__))), "girest.js")
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

        # Handle queued call responses (for reentrant calls from callbacks)
        if kind == "queued-call-response":
            correlation_id = payload.get("correlation_id")
            self.message_bus.handle_response_message(correlation_id, payload)
            return

        # Handle callbacks
        if kind == "callback":
            callback_data = payload["data"]
            callback_id = callback_data.get("callback_id")

            # URL mode: make HTTP callback and unlock Frida
            if callback_id is None:
                logger.error("Callback invocation missing callback_id")
                return

            # Look up callback metadata
            metadata = self._callback_registry.get(callback_id)
            if not metadata:
                logger.error(f"Callback {callback_id} not found in registry")
                # Still need to unlock Frida with a null result
                self.scripts[0].post(
                    {
                        "type": f"callback-{callback_id}",
                        "kind": "callback-response",
                        "callback_id": callback_id,
                        "result": None,
                    }
                )
                return

            # Get the handler instance from the registry (created during registration)
            handler = metadata.get("handler")
            if not handler:
                logger.error(f"Callback {callback_id} does not have a handler")
                # Still need to unlock Frida with a null result
                self.scripts[0].post(
                    {
                        "type": f"callback-{callback_id}",
                        "kind": "callback-response",
                        "callback_id": callback_id,
                        "result": None,
                    }
                )
                return

            # Get raw args and convert enums to strings
            raw_args = callback_data["args"]
            callback_name = metadata["name"]

            # Convert callback arguments (especially enum integers to strings)
            args = self._convert_callback_args(raw_args, metadata["callback_type"])

            # Note: GI scope (call/async/notified/forever) only affects WHEN the
            # callback is invoked, not HOW we handle it. All callbacks:
            # - Make synchronous HTTP requests
            # - Wait for response
            # - May or may not have return values (depends on callback signature)
            result = None

            # IMPORTANT: Handle callback in a separate thread to allow reentrancy
            # This allows the main thread to continue processing HTTP requests
            # while we wait for the callback response
            def handle_callback_in_thread():
                nonlocal result
                # All callbacks handled uniformly
                # Pass callback_id for correlation tracking (thread affinity)
                result = handler.invoke(callback_name, callback_id, args)

                # Unlock Frida thread with the result
                self.scripts[0].post(
                    {
                        "type": f"callback-{callback_id}",
                        "kind": "callback-response",
                        "callback_id": callback_id,
                        "result": result,
                    }
                )

            # Run callback handling in a daemon thread
            # This allows the main thread to keep processing HTTP requests
            callback_thread = threading.Thread(target=handle_callback_in_thread, daemon=True)
            callback_thread.start()
            # Note: We don't wait for the thread - it will post the response when ready
        else:
            # For now, just log other messages
            logger.debug(f"Message from Frida: {message}")

    def _generate_callback(self, url, arg_info, cb_info, headers):
        session_id = None
        callback_secret = None

        try:
            # Access headers from connexion.request
            session_id = headers.get("session-id")
            callback_secret = headers.get("callback-secret")
        except Exception as e:
            logger.warning(f"Could not access connexion.request.headers: {e}")

        # If this is a callback argument, assign a unique callback_id and get scope
        callback_id = self._callback_id_counter
        self._callback_id_counter += 1

        # Get callback scope from GI metadata
        scope = GIRepository.arg_info_get_scope(arg_info)
        # Map GI scope to string for easier handling
        scope_map = {
            GIRepository.ScopeType.INVALID: "invalid",
            GIRepository.ScopeType.CALL: "call",  # Synchronous
            GIRepository.ScopeType.ASYNC: "async",  # Fire and forget
            GIRepository.ScopeType.NOTIFIED: "notified",  # Multiple calls
            GIRepository.ScopeType.FOREVER: "forever",  # Never destroyed
        }
        scope = scope_map.get(scope, "async")
        arg_name = arg_info.get_name()

        # Create the handler once during registration so invocation_count persists
        handler = CallbackHandler(callback_url=url, session_id=session_id, secret=callback_secret, timeout=10)

        # Register each callback argument
        self._callback_registry[callback_id] = {
            "url": url,
            "session_id": session_id,
            "secret": callback_secret,
            "scope": scope,
            "name": arg_name,
            "callback_type": cb_info,
            "handler": handler,  # Store handler instance for reuse
        }
        logger.debug(f"Registered callback {callback_id}: {arg_name} -> {url}")
        return callback_id

    def _register_signal_callback(self, url, signal_name, signal_info, session_id, callback_secret):
        """Register a callback for a signal connection"""
        callback_id = self._callback_id_counter
        self._callback_id_counter += 1

        # Create the handler once during registration so invocation_count persists
        handler = CallbackHandler(callback_url=url, session_id=session_id, secret=callback_secret, timeout=10)

        self._callback_registry[callback_id] = {
            "url": url,
            "session_id": session_id,
            "secret": callback_secret,
            "scope": "signal",
            "name": signal_name,
            "callback_type": signal_info,
            "handler": handler,  # Store handler instance for reuse
        }
        logger.debug(f"Registered signal callback {callback_id}: {signal_name} -> {url}")
        return callback_id

    def _value_to_rest(self, value, type_info):
        """
        Convert a single value as received from Frida to how it should be exposed to REST
        Handles enums, objects, structs, and arrays.

        Args:
            value: The raw json value from Frida
            type_info: GITypeInfo that corresponds to the value

        Returns:
            Converted value
        """
        tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(type_info))
        # Check if this is an interface type
        if tag == "interface":
            interface = GIRepository.type_info_get_interface(type_info)
            info_type = interface.get_type()

            if info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
                full_name = f"{interface.get_namespace()}{interface.get_name()}"
                enum_mapping = self.enum_mappings.get(full_name, {})
                # Reverse lookup: find string name for integer value
                for enum_name, enum_value in enum_mapping.items():
                    if enum_value == value:
                        return enum_name
            # Handle objects/structs - convert to {ptr: "0x..."}
            elif info_type in [GIRepository.InfoType.OBJECT, GIRepository.InfoType.STRUCT]:
                return {"ptr": value}
            else:
                logger.warning(f"Unsupported interface type {info_type}")
                return value
        elif tag == "array":
            array_type = GIRepository.type_info_get_array_type(type_info)
            if array_type != GIRepository.ArrayType.C:
                logger.warning("Unsupported array type")
                return value
            element_type_info = GIRepository.type_info_get_param_type(type_info, 0)
            # Convert each element
            return [self._value_to_rest(item, element_type_info) for item in value]

        # No conversion needed
        return value

    def _arg_from_rest(self, rest_value, arg_info, headers):
        """
        Convert an arg definition as received from REST to how Frida expects it

        Args:
            rest_value: The raw json value from REST
            arg_info: GIArgInfo that corresponds to the arguments being passed
            headers: The headers from the request

        Returns:
            Converted value
        """
        # Handle None values (optional parameters not provided)
        if rest_value is None:
            return None

        arg_type = GIRepository.arg_info_get_type(arg_info)
        tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(arg_type))
        # Check if this is an interface type
        if tag != "interface":
            return rest_value

        interface = GIRepository.type_info_get_interface(arg_type)
        info_type = interface.get_type()

        if info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
            # Convert string enum name to integer value
            full_name = f"{interface.get_namespace()}{interface.get_name()}"
            enum_mapping = self.enum_mappings.get(full_name, {})
            return enum_mapping[rest_value]
        elif info_type in [GIRepository.InfoType.OBJECT, GIRepository.InfoType.STRUCT]:
            # For GObject types, extract the 'ptr' field from the JSON object
            # Our URI parser deserializes "ptr,value" into {"ptr": "value"}
            # but Frida expects just the pointer value
            return rest_value["ptr"]
        elif info_type == GIRepository.InfoType.CALLBACK:
            return self._generate_callback(rest_value, arg_info, interface, headers)
        return rest_value

    def _convert_callback_args(self, args, cb_type):
        """
        Convert callback arguments, especially enum integers to strings.
        Also translates 'this' to 'self' for REST API compatibility.

        Args:
            args: Dictionary of callback argument values from Frida
            cb_type: GICallableInfo for the callback type

        Returns:
            Dictionary with converted values
        """
        converted_args = {}

        # Handle 'this' parameter (for signals/methods) if present
        # This is added manually by is_method=True but not in GIRepository's arg list
        if "this" in args:
            # Convert 'this' to 'self' and add as first parameter
            # The type for 'this' is always a pointer
            converted_args["self"] = {"ptr": args["this"]}

        # Process the introspected arguments
        n_args = GIRepository.callable_info_get_n_args(cb_type)
        for i in range(n_args):
            arg_info = GIRepository.callable_info_get_arg(cb_type, i)
            arg_name = arg_info.get_name()
            if arg_name not in args:
                logger.warning(f"Callback arg {arg_name} not found in {args}")
                continue

            arg_value = args[arg_name]
            arg_type = GIRepository.arg_info_get_type(arg_info)

            converted_args[arg_name] = self._value_to_rest(arg_value, arg_type)

        return converted_args

    def _type_to_json(self, t):
        """Convert GIRepository type to JSON type dict with name and subtype"""
        # Get the type tag
        tag_enum = GIRepository.type_info_get_tag(t)
        tag = GIRepository.type_tag_to_string(tag_enum)

        # Check if it's an array type
        if tag == "array":
            array_type = GIRepository.type_info_get_array_type(t)
            # Only handle C arrays
            if array_type == GIRepository.ArrayType.C:
                # Get element type for the array
                element_type_info = GIRepository.type_info_get_param_type(t, 0)
                subtype = None
                if element_type_info:
                    subtype = self._type_to_json(element_type_info)

                # Get array metadata
                array_length = GIRepository.type_info_get_array_length(t)  # -1 if not available
                array_fixed_size = GIRepository.type_info_get_array_fixed_size(t)  # -1 if not fixed
                is_zero_terminated = GIRepository.type_info_is_zero_terminated(t)

                return {
                    "name": "array",
                    "subtype": subtype,
                    "length": array_length,  # Index of parameter containing length, or -1
                    "fixed_size": array_fixed_size,  # Fixed size if known, or -1
                    "zero_terminated": is_zero_terminated,
                }
            # For other array types, treat as pointer for now
            return {"name": "pointer", "subtype": None}

        # Check if it's an interface type
        if tag == "interface":
            interface = GIRepository.type_info_get_interface(t)
            if interface:
                info_type = interface.get_type()
                if info_type == GIRepository.InfoType.CALLBACK:
                    # Get the callback definition as subtype
                    subtype = self._callable_to_json(interface)
                    return {"name": "callback", "subtype": subtype}
                elif info_type == GIRepository.InfoType.ENUM or info_type == GIRepository.InfoType.FLAGS:
                    return {"name": "int32", "subtype": None}
                elif info_type == GIRepository.InfoType.STRUCT:
                    # Check if this is a struct with a registered GType (boxed type)
                    gtype = GIRepository.registered_type_info_get_g_type(interface)
                    if gtype != 0:
                        return {"name": "gtype", "subtype": None}
                    else:
                        # Get struct size
                        struct_size = GIRepository.struct_info_get_size(interface)
                        return {"name": "struct", "subtype": None, "struct_size": struct_size}
        if tag == "void" and GIRepository.type_info_is_pointer(t):
            return {"name": "pointer", "subtype": None}
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
            "filename": "string",  # Filename strings (filesystem encoding)
            "gfloat": "float",
            "gdouble": "double",
            "GType": "int64",  # FIXME beware of this
            "void": "void",
        }

        json_type = type_map.get(tag, "pointer")
        return {"name": json_type, "subtype": None}

    def _arg_to_json(self, arg, is_method=False):
        """Convert argument info to JSON representation"""
        arg_type = GIRepository.arg_info_get_type(arg)
        type_info = self._type_to_json(arg_type)

        # Check if the parent function is a method to increase the offset
        offset = 0
        if is_method:
            offset = 1

        closure = GIRepository.arg_info_get_closure(arg)
        if closure >= 0:
            closure = closure + offset

        destroy = GIRepository.arg_info_get_destroy(arg)
        if destroy >= 0:
            destroy = destroy + offset

        ret = {
            "name": arg.get_name(),
            "skip_in": False,
            "skip_out": False,
            "closure": closure,
            "is_closure": False,
            "destroy": destroy,
            "is_destroy": False,
            "direction": GIRepository.arg_info_get_direction(arg),
            "type": type_info,
        }

        # Handle structs - check caller allocates
        if type_info["name"] == "struct":
            if ret["direction"] == GIRepository.Direction.OUT and GIRepository.arg_info_is_caller_allocates(arg):
                ret["direction"] = GIRepository.Direction.IN

        # Handle gtypes - check caller allocates
        if type_info["name"] == "gtype":
            if ret["direction"] == GIRepository.Direction.OUT and GIRepository.arg_info_is_caller_allocates(arg):
                ret["direction"] = GIRepository.Direction.IN

        return ret

    def _callable_to_json(self, cb, is_method=False):
        """Convert callable info to JSON representation"""
        return_type_info = self._type_to_json(GIRepository.callable_info_get_return_type(cb))

        ret = {"arguments": [], "is_method": is_method, "returns": return_type_info}

        if is_method:
            # Prepend self argument
            ra = {
                "name": "this",
                "skip_in": False,
                "skip_out": False,
                "closure": -1,
                "is_closure": False,
                "destroy": -1,
                "is_destroy": False,
                "length": -1,
                "direction": GIRepository.Direction.IN,
                "type": {"name": "pointer", "subtype": None},
            }
            ret["arguments"].append(ra)

        # Add all arguments
        n_args = GIRepository.callable_info_get_n_args(cb)
        for i in range(n_args):
            arg = GIRepository.callable_info_get_arg(cb, i)
            ra = self._arg_to_json(arg, is_method)
            ret["arguments"].append(ra)

        # Mark array length parameters as skipped
        offset = 1 if is_method else 0
        for i in range(n_args):
            arg = GIRepository.callable_info_get_arg(cb, i)
            arg_type = GIRepository.arg_info_get_type(arg)
            tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(arg_type))

            if tag == "array":
                array_type = GIRepository.type_info_get_array_type(arg_type)
                if array_type == GIRepository.ArrayType.C:
                    length_idx = GIRepository.type_info_get_array_length(arg_type)
                    if length_idx >= 0:
                        ret["arguments"][length_idx + offset]["skip_in"] = True
                        ret["arguments"][length_idx + offset]["skip_out"] = True
                        ret["arguments"][i + offset]["length"] = length_idx + offset

        # Check return type for arrays with length parameters
        return_type = GIRepository.callable_info_get_return_type(cb)
        return_tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(return_type))
        if return_tag == "array":
            array_type = GIRepository.type_info_get_array_type(return_type)
            if array_type == GIRepository.ArrayType.C:
                length_idx = GIRepository.type_info_get_array_length(return_type)
                if length_idx >= 0:
                    ret["arguments"][length_idx + offset]["skip_out"] = True
                    # Store length index inside the returns object for consistency with argument arrays
                    ret["returns"]["length"] = length_idx + offset

        # Mark skipped arguments
        for r in ret["arguments"]:
            if r["closure"] >= 0:
                ret["arguments"][r["closure"]]["skip_in"] = True
                ret["arguments"][r["closure"]]["is_closure"] = True
            if r["destroy"] >= 0:
                ret["arguments"][r["destroy"]]["skip_in"] = True
                ret["arguments"][r["destroy"]]["is_destroy"] = True
            if r["direction"] == GIRepository.Direction.OUT:
                r["skip_in"] = True

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

        # Check if namespace is loaded
        if not self.repo.is_registered(namespace, None):
            logger.warning(f"Namespace '{namespace}' not loaded, cannot resolve method {method_name}")
            return None

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
            "returns": {"name": "int64", "subtype": None},  # FIXME beware of this
        }

        async def get_type_handler(*args, **kwargs):
            if symbol == "intern":
                result = await asyncio.to_thread(self.scripts[0].exports_sync.internal_gtype, type_info.get_name())
                return {"return": result}
            else:
                # Serialize the command
                command = self.command_serializer.serialize_call(symbol, _type, [])

                # Execute command (handles correlation ID internally)
                result = await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

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
            # Serialize the command
            command = self.command_serializer.serialize_alloc(size)

            # Execute command (handles correlation ID internally)
            result = await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return {"return": {"ptr": result}}

        return generic_new_handler

    def _create_generic_free_handler(self, type_info):
        """Create handler for generic struct/object deallocation"""

        async def generic_free_handler(*args, **kwargs):
            # Extract the self parameter (pointer to free)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for free operation")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            # Serialize the command
            command = self.command_serializer.serialize_free(obj["ptr"])

            # Execute command (handles correlation ID internally)
            await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return None

        return generic_free_handler

    def _create_generic_ref_handler(self, type_info):
        """Create handler for generic object ref (increment reference count)"""
        # Determine the ref function symbol based on the type
        namespace = type_info.get_namespace()
        name = type_info.get_name()

        # Get the C symbol prefix from GIRepository
        # e.g., "G" for GObject namespace -> g_param_spec_ref
        c_prefix = self.repo.get_c_prefix(namespace)
        symbol_prefix = c_prefix.lower()

        # Convert CamelCase to snake_case
        import re

        snake_name = re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()
        symbol = f"{symbol_prefix}_{snake_name}_ref"

        # Build the JSON representation for Frida
        _type = {
            "arguments": [
                {
                    "name": "this",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "pointer", "subtype": None},
                }
            ],
            "is_method": True,
            "returns": {"name": "pointer", "subtype": None},
        }

        async def generic_ref_handler(*args, **kwargs):
            # Extract the self parameter (object pointer)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for ref operation")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            # Serialize the command
            command = self.command_serializer.serialize_call(symbol, _type, [obj["ptr"]])

            # Execute command (handles correlation ID internally)
            result = await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return {"return": {"ptr": result["return"]}}

        return generic_ref_handler

    def _create_generic_unref_handler(self, type_info):
        """Create handler for generic object unref (decrement reference count)"""
        # Determine the unref function symbol based on the type
        namespace = type_info.get_namespace()
        name = type_info.get_name()

        # Get the C symbol prefix from GIRepository
        # e.g., "G" for GObject namespace -> g_param_spec_unref
        c_prefix = self.repo.get_c_prefix(namespace)
        symbol_prefix = c_prefix.lower()

        # Convert CamelCase to snake_case
        import re

        snake_name = re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()
        symbol = f"{symbol_prefix}_{snake_name}_unref"

        # Build the JSON representation for Frida
        _type = {
            "arguments": [
                {
                    "name": "this",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "pointer", "subtype": None},
                }
            ],
            "is_method": True,
            "returns": {"name": "void", "subtype": None},
        }

        async def generic_unref_handler(*args, **kwargs):
            # Extract the self parameter (object pointer)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for unref operation")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            # Serialize the command
            command = self.command_serializer.serialize_call(symbol, _type, [obj["ptr"]])

            # Execute command (handles correlation ID internally)
            await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return None

        return generic_unref_handler

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

            # Handle arrays - check if items are objects/structs using GI introspection
            if "type" in k_def and k_def["type"] == "array" and isinstance(v, list):
                # Use GI introspection to determine the array element type
                type_info = field_type_info
                if method_info and not field_type_info:
                    # For method calls, get return type from method info
                    type_info = GIRepository.callable_info_get_return_type(method_info)

                if type_info:
                    tag = GIRepository.type_tag_to_string(GIRepository.type_info_get_tag(type_info))
                    if tag == "array":
                        # Get the element type of the array
                        element_type_info = GIRepository.type_info_get_param_type(type_info, 0)
                        if element_type_info:
                            element_tag = GIRepository.type_tag_to_string(
                                GIRepository.type_info_get_tag(element_type_info)
                            )

                            # Check if element is an interface (object/struct/enum)
                            if element_tag == "interface":
                                interface = GIRepository.type_info_get_interface(element_type_info)
                                if interface:
                                    info_type = interface.get_type()
                                    # Convert objects and structs to {ptr: "0x..."} format
                                    if info_type in [GIRepository.InfoType.OBJECT, GIRepository.InfoType.STRUCT]:
                                        logger.debug(
                                            f"Converting array of {interface.get_name()} objects to {{ptr: ...}} format"
                                        )
                                        result[k] = [{"ptr": item} if isinstance(item, str) else item for item in v]

            # Handle single object/struct values
            if "x-gi-type" in k_def and k_def["x-gi-type"] in ["object", "struct", "gtype"]:
                result[k] = {"ptr": v}
            elif "type" in k_def and k_def["type"] == "object":
                result[k] = {"ptr": v}
            # Convert enum integers back to strings for OpenAPI compliance
            elif "x-gi-type" in k_def and k_def["x-gi-type"] in ["enum", "flags"]:
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
        logger.debug(f"Returning converted response: {result}")
        return result

    def _create_field_get_handler(self, offset, field_type_json, field_type_info, operation, struct_info):
        """Create handler for reading a struct field"""

        # Build struct_type_info with all fields for array length lookups
        struct_type_info = None
        if struct_info and field_type_json.get("name") == "array" and field_type_json.get("length", -1) >= 0:
            # Only build struct_type_info if we have an array with a length parameter
            n_fields = GIRepository.struct_info_get_n_fields(struct_info)
            fields = []
            for i in range(n_fields):
                field_info = GIRepository.struct_info_get_field(struct_info, i)
                field_offset = GIRepository.field_info_get_offset(field_info)
                field_type = GIRepository.field_info_get_type(field_info)
                field_type_json_item = self._type_to_json(field_type)
                fields.append({"name": field_info.get_name(), "offset": field_offset, "type": field_type_json_item})
            struct_type_info = {"fields": fields}

        async def field_get_handler(*args, **kwargs):
            # Extract the self parameter (struct pointer)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for field get")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            # Serialize the command
            command = self.command_serializer.serialize_get_field(obj["ptr"], offset, field_type_json, struct_type_info)

            # Execute command (handles correlation ID internally)
            raw_result = await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            # Wrap in result dictionary
            result = {"return": raw_result}

            # Use common response parsing logic
            return self._parse_response(result, operation, field_type_info)

        return field_get_handler

    def _create_field_put_handler(self, offset, field_type_json, field_type_info, operation):
        """Create handler for writing a struct field"""

        async def field_put_handler(*args, **kwargs):
            # Extract the self parameter (struct pointer)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for field put")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            # Extract the value to write
            value = kwargs.get("value")
            if value is None:
                raise ValueError("Missing 'value' parameter for field put")

            # Handle object/struct values (extract ptr)
            if isinstance(value, dict) and "ptr" in value:
                value = value["ptr"]

            # Serialize the command
            command = self.command_serializer.serialize_set_field(obj["ptr"], offset, field_type_json, value)

            # Execute command (handles correlation ID internally)
            await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return None

        return field_put_handler

    # Custom methods
    def custom_glib_list_free(self):
        async def func(*args, **kwargs):
            converted_kwargs = {}
            converted_kwargs["this"] = kwargs["self"]["ptr"]
            _type = {
                "arguments": [],
                "is_method": True,
                "returns": {"name": "void", "subtype": None},
            }
            # Prepend self argument
            ra = {
                "name": "this",
                "skip_in": False,
                "skip_out": False,
                "closure": -1,
                "is_closure": False,
                "destroy": -1,
                "is_destroy": False,
                "direction": GIRepository.Direction.IN,
                "type": {"name": "pointer", "subtype": None},
            }
            _type["arguments"].append(ra)

            # Serialize the command
            command = self.command_serializer.serialize_call("g_list_free", _type, list(converted_kwargs.values()))

            # Execute command (handles correlation ID internally)
            await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

        return func

    def _create_signal_connect_handler(self, namespace, class_name, signal_name, operation):
        """Create handler for connecting to a signal via g_signal_connect_data"""

        # Find the object info using find_by_name
        object_info = self.repo.find_by_name(namespace, class_name)
        if not object_info or object_info.get_type() != GIRepository.InfoType.OBJECT:
            raise ValueError(f"Could not find object {namespace}.{class_name}")

        # Find the signal info using find_signal
        signal_info = GIRepository.object_info_find_signal(object_info, signal_name)
        if not signal_info:
            raise ValueError(f"Could not find signal '{signal_name}' on {namespace}.{class_name}")

        # Get GObjectConnectFlags type info for proper conversion
        connect_flags_info = self.repo.find_by_name("GObject", "ConnectFlags")

        # Generate the signal signature for Frida
        # Signals are like methods with the instance as the first parameter
        signal_signature = self._callable_to_json(signal_info, is_method=True)

        # Manually create the signature for g_signal_connect_data
        # gulong g_signal_connect_data(gpointer instance, const gchar *detailed_signal,
        #                              GCallback c_handler, gpointer data,
        #                              GClosureNotify destroy_data, GConnectFlags connect_flags)
        connect_func_signature = {
            "arguments": [
                {
                    "name": "instance",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "pointer", "subtype": None},
                },
                {
                    "name": "detailed_signal",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "string", "subtype": None},
                },
                {
                    "name": "c_handler",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": 3,
                    "is_closure": False,
                    "destroy": 4,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {
                        "name": "callback",
                        "subtype": signal_signature,
                        "scope": "signal",  # Mark as non-blocking signal callback
                    },
                },
                {
                    "name": "data",
                    "skip_in": True,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": True,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "pointer", "subtype": None},
                },
                {
                    "name": "destroy_data",
                    "skip_in": True,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": True,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "pointer", "subtype": None},
                },
                {
                    "name": "connect_flags",
                    "skip_in": False,
                    "skip_out": False,
                    "closure": -1,
                    "is_closure": False,
                    "destroy": -1,
                    "is_destroy": False,
                    "direction": GIRepository.Direction.IN,
                    "type": {"name": "int32", "subtype": None},
                },
            ],
            "is_method": False,
            "returns": {"name": "uint64", "subtype": None},  # gulong return type
        }

        async def signal_connect_handler(*args, **kwargs):
            # Debug: Print what we're receiving
            logger.debug(f"signal_connect_handler called with args={args}, kwargs={kwargs}")

            # Extract the self parameter (object instance)
            obj = kwargs.get("self")
            if obj is None:
                raise ValueError("Missing 'self' parameter for signal connection")
            if "ptr" not in obj:
                raise ValueError("Missing 'ptr' value")

            instance_ptr = obj["ptr"]

            # Get connection parameters - Connexion may pass body as 'body' kwarg or individual fields
            # Try getting from individual kwargs first (Connexion unpacks requestBody)
            flags_str = kwargs.get("flags", "default")
            handler_url = kwargs.get("handler")

            # If not in kwargs, try getting from body parameter or connexion.request
            if handler_url is None:
                import connexion

                body = kwargs.get("body") or connexion.request.json or {}
                if isinstance(body, dict):
                    flags_str = body.get("flags", flags_str)
                    handler_url = body.get("handler")

            if not handler_url:
                raise ValueError("Missing 'handler' callback URL in request body")

            # Get headers for callback authentication
            headers = connexion.request.headers
            session_id = headers.get("session-id")
            callback_secret = headers.get("callback-secret")

            # Convert GObjectConnectFlags from string to integer using enum_mappings
            full_name = f"{connect_flags_info.get_namespace()}{connect_flags_info.get_name()}"
            flags_mapping = self.enum_mappings.get(full_name, {})
            connect_flags = flags_mapping.get(flags_str, 0)

            # Register the callback with the signal signature for proper marshalling
            callback_id = self._register_signal_callback(
                handler_url, signal_name, signal_info, session_id, callback_secret
            )

            # Prepare arguments for g_signal_connect_data
            args = [
                instance_ptr,  # instance as a pointer string, not an object
                signal_name,
                callback_id,  # c_handler - Frida will create GCallback for this
                connect_flags,
            ]

            # Serialize the command
            command = self.command_serializer.serialize_call("g_signal_connect_data", connect_func_signature, args)

            # Execute command (handles correlation ID internally)
            result = await asyncio.to_thread(self.message_bus.execute, command, connexion.request.headers)

            return result

        return signal_connect_handler

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

            # Headers
            headers = connexion.request.headers

            # Check for correlation ID (reentrant call from callback)
            correlation_id = headers.get("X-Correlation-Id")

            # Check for async execution preference
            prefer_header = headers.get("Prefer", "")
            is_async_requested = "respond-async" in prefer_header

            # Determine if this is a void function using _type (JSON representation)
            # Check return type - returns is a dict like {"name": "void", "subtype": None}
            returns_void = _type.get("returns", {}).get("name") == "void"

            # Check for output parameters
            has_out_params = any(
                arg.get("direction") in [GIRepository.Direction.OUT, GIRepository.Direction.INOUT]
                for arg in _type.get("arguments", [])
            )

            is_true_void = returns_void and not has_out_params

            # If async execution is requested but function is not void, reject it
            if is_async_requested and not is_true_void:
                return {
                    "error": "Prefer: respond-async is only supported for void functions (no return value, no output parameters)"
                }, 400

            # Convert enum string values to integers before calling Frida
            converted_kwargs = {}
            n_args = GIRepository.callable_info_get_n_args(_method)

            # Add 'self' as a parameter
            if _type["is_method"]:
                converted_kwargs["this"] = kwargs["self"]["ptr"]

            for i in range(n_args):
                arg = GIRepository.callable_info_get_arg(_method, i)
                arg_name = arg.get_name()

                # Some args might not be on the passed in args, like output params
                if arg_name in kwargs:
                    converted_kwargs[arg_name] = self._arg_from_rest(kwargs[arg_name], arg, headers)

            # Serialize the command
            command = self.command_serializer.serialize_call(
                symbol=symbol, method_info=_type, args=list(converted_kwargs.values())
            )

            # Handle async execution (fire-and-forget)
            if is_async_requested and is_true_void:
                # For async execution WITH correlation ID:
                # - Execute on callback thread (thread affinity)
                # - But don't wait for completion (fire-and-forget)
                # - Return 202 immediately
                if correlation_id:
                    # Async queued execution (thread affinity + fire-and-forget)
                    logger.debug(f"Async queued execution for correlation_id={correlation_id}")
                    # Send immediately (synchronous post, but async execution on Frida side)
                    self.message_bus.execute_queued(command, correlation_id, is_async=True)
                    # Return 202 immediately without waiting
                    return "", 202, {"Preference-Applied": "respond-async"}
                else:
                    # Async direct execution (no thread affinity)
                    async def execute_async():
                        try:
                            await asyncio.to_thread(self.message_bus.execute_direct, command)
                        except Exception as e:
                            logger.error(f"Async execution failed for {symbol}: {e}")

                    asyncio.create_task(execute_async())
                    return "", 202, {"Preference-Applied": "respond-async"}

            # Execute command via appropriate channel (synchronous execution)
            result = await asyncio.to_thread(self.message_bus.execute, command, headers)

            # Use common response parsing logic
            result = self._parse_response(result, _endpoint, method_info=_method)

            return result

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

        # Check if this is a signal connection operation (operator == 'connect')
        if operator == "connect":
            # This is a signal connection: {Namespace}-{ClassName}-{signal_name}-connect
            # method_name contains the signal name with underscores (e.g., 'sync_message')
            signal_name = method_name.replace("_", "-")  # Convert back to signal name format
            return self._create_signal_connect_handler(namespace, class_name, signal_name, operation)

        # Check if this is a field operation based on the operator
        if operator in ["get", "put"]:
            # This is a field access operation
            field_name = method_name

            # Find the struct info
            struct_info = None
            # Check if namespace is loaded
            if not self.repo.is_registered(namespace, None):
                logger.warning(f"Namespace '{namespace}' not loaded, skipping field operation for {method_name}")
                return None
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
                            return self._create_field_get_handler(
                                field_offset, field_type_json, field_type_info, operation, struct_info
                            )
                        elif operator == "put" and is_writable:
                            return self._create_field_put_handler(
                                field_offset, field_type_json, field_type_info, operation
                            )

                        return None

        method_info = self._find_function_info(namespace, class_name, method_name)
        if method_info:
            # Generate the JSON representation
            method_json = self._method_to_json(method_info)

            # Create and return the handler with method_info and method_json as defaults
            ret = self.create_frida_handler()
            ret.__defaults__ = (method_info, method_json, operation)
            return ret
        # Custom cases when a function is not exported by GI
        # In the case of GLibList the free function is not exported by GI, so we need to create it manually
        elif method_name == "free" and namespace == "GLib" and class_name == "List":
            return self.custom_glib_list_free()
        # Check for the artificial methods
        elif method_name in ["new", "free", "get_type", "ref", "unref"]:
            # Try to find the info (struct, object, enum, or flags)
            type_info = None
            # Check if namespace is loaded
            if not self.repo.is_registered(namespace, None):
                logger.warning(f"Namespace '{namespace}' not loaded, skipping artificial method {method_name}")
                return None
            n_infos = self.repo.get_n_infos(namespace)
            for i in range(n_infos):
                info = self.repo.get_info(namespace, i)
                info_type = info.get_type()
                # Check for struct, object, enum, or flags that match the class name
                if (
                    info_type
                    in [
                        GIRepository.InfoType.STRUCT,
                        GIRepository.InfoType.OBJECT,
                        GIRepository.InfoType.ENUM,
                        GIRepository.InfoType.FLAGS,
                    ]
                    and info.get_name() == class_name
                ):
                    type_info = info
                    break

            if type_info:
                if method_name == "new":
                    return self._create_generic_new_handler(type_info)
                elif method_name == "free":
                    return self._create_generic_free_handler(type_info)
                elif method_name == "get_type":
                    return self._create_get_type_handler(type_info)
                elif method_name == "ref":
                    return self._create_generic_ref_handler(type_info)
                elif method_name == "unref":
                    return self._create_generic_unref_handler(type_info)
                else:
                    logger.error(f"Type info found {type_info.get_name()} but not method {method_name}")
                    return None

            logger.error(f"Type info not found {class_name} for {operation_id}")
            return None
        else:
            logger.error(f"Method name not found {method_name} for {operation_id}")
            return None
