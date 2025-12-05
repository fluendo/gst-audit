import os
import logging
from typing import List, Dict, Any, Optional, Set
from jinja2 import Environment, FileSystemLoader, Template
from jinja2.exceptions import TemplateNotFound

try:
    from .utils import parse_operation_id
except ImportError:
    # Fallback for when module is imported directly (e.g., in tests)
    from utils import parse_operation_id

logger = logging.getLogger("girest")


class Info:
    """Base class for all OpenAPI schema objects with dependency management."""
    info_type = None

    def __init__(self, generator: 'Generator', schema_section: Dict[str, Any], parent: Optional['Info'] = None):
        """
        Initialize the Info object.
        
        Args:
            generator: The generator instance
            schema_section: The section of the OpenAPI schema that belongs to this object
            parent: Optional parent Info object
        """
        self.generator = generator
        self.schema_section = schema_section
        self.parent = parent
        self.dependencies: Set[str] = set()
    
    def add_dependency(self, dependency: str):
        """
        Add a dependency and propagate it to the parent if it exists.
        
        Args:
            dependency: The name of the dependency to add
        """
        self.dependencies.add(dependency)
        if self.parent:
            self.parent.add_dependency(dependency)

    @property
    def id(self) -> str:
        """Get the unique identifier of the Info object"""
        return self.name

    @property
    def name(self) -> str:
        """Get the name of the Info object"""
        raise NotImplementedError("Subclasses must implement name() method")

    @property
    def valid_name(self) -> str:
        return self.generator.get_valid_name(self)

    def generate(self) -> str:
        """Generate the code based on the template."""
        # Try specific template first, then fallback to general
        template_name = f'{self.info_type}_{self.id}.ts.j2'
        try:
            template = self.generator.jinja_env.get_template(template_name)
        except TemplateNotFound:
            template = self.generator.jinja_env.get_template(f'{self.info_type}.ts.j2')
        return template.render(**{self.info_type: self})
        

class Generator:
    def __init__(self, openapi_schema: Dict[str, Any], host: str = "localhost", port: int = 9000, base_path: str = ""):
        """
        Initialize the generator with an OpenAPI schema.
        
        Args:
            openapi_schema: The OpenAPI schema dictionary from GIRest
            host: Host for REST API calls (default: 'localhost')
            port: Port for REST API calls (default: 9000)
            base_path: Base path for REST API calls (default: '')
        """
        self.schema = openapi_schema
        self.components = openapi_schema.get("components", {})
        self.schemas = self.components.get("schemas", {})
        self.paths = openapi_schema.get("paths", {})
        self.host = host
        self.port = port
        self.base_path = base_path
        self.base_url = f"http://{host}:{port}{base_path}"
        
        # Cache for Schema objects to avoid recreating them
        self.schema_objects_cache: Dict[str, "Schema"] = {}
        
        # Setup Jinja2 environment using template directory from subclass
        template_dir = self.get_template_dir()
        self.jinja_env = Environment(
            loader=FileSystemLoader(template_dir),
            trim_blocks=True,
            lstrip_blocks=True
        )

    def add_schema(self, schema: "Schema"):
        self.schema_objects_cache[schema.name] = schema

    def get_template_dir(self) -> str:
        """Get the template directory path. Must be implemented by subclasses."""
        raise NotImplementedError("Subclasses must implement get_template_dir() method")

    def get_valid_name(self, info: 'Info') -> str:
        """
        Get a safe name for an Info object. Base implementation just returns the current name.
        Subclasses can override to handle language-specific naming conflicts.
        
        Args:
            info: The Info object requesting a name

        Returns:
            A safe name for the given context
        """
        return info.name

    def lang_type(self, t: 'Type') -> str:
        raise NotImplementedError("Subclasses must implement the lang_type() method")

    def find_schema(self, name: str) -> Optional[Dict[str, Any]]:
        """Find a schema definition by name in the components."""
        return self.schemas.get(name, None)

    def get_schema(self, name: str) -> "Schema":
        """Get a Schema object by name, creating it if not found in cache."""
        if name not in self.schema_objects_cache:
            schema_def = self.find_schema(name)
            if schema_def:
                schema_obj = Schema.create_schema(name, schema_def, self, None)
                self.add_schema(schema_obj)
        
        return self.schema_objects_cache[name]

    def get_methods_for_schema(self, schema: 'Schema') -> List['Method']:
        """Get all Method objects for a specific schema based on tag matching.
        
        Takes a Schema object, finds all paths that have operations tagged with the schema name,
        and returns a list of Method objects created from those operations.
        
        Args:
            schema: The Schema object to find operations for
            
        Returns:
            List of Method objects created from matching operations
        """
        methods = []

        for path, path_operations in self.paths.items():
            # Check if any operation in this path has our schema name as tag
            path_matches = False
            is_class = False
            for method, operation in path_operations.items():
                if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                    continue
                
                tags = operation.get("tags", [])
                if tags:
                    if tags[0] == schema.name:
                        path_matches = True
                        break
                    if isinstance(schema, Object) and schema._class_name and tags[0] == schema._class_name:
                        path_matches = True
                        is_class = True
                        break
            
            if path_matches:
                 # Create Method object with operation dict, path, and http_method directly
                 method_obj = Method(operation, path, method, schema, self, is_class)
                 methods.append(method_obj)
        
        return methods

    def _create_namespace_schemas(self):
        """Create Namespace schema objects for tags that don't have corresponding component schemas.
        
        Searches all paths to find operations tagged with names that don't correspond to 
        component schemas, and creates Namespace schema objects to hold those operations.
        """
        # Find all unique tags from operations
        operation_tags = set()
        for path, path_operations in self.paths.items():
            for method, operation in path_operations.items():
                if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                    continue
                
                tags = operation.get("tags", [])
                if tags:
                    operation_tags.add(tags[0])  # Use first tag as primary
        
        # Find tags that don't correspond to component schemas
        for tag in operation_tags:
            if tag not in self.schemas:
                # Create a Namespace schema with None schema definition
                schema = Namespace(tag, self)
                self.add_schema(schema)
  
    def generate(self) -> str:
        """Generate complete TypeScript bindings."""
        title = self.schema.get("info", {}).get("title", "API")
        version = self.schema.get("info", {}).get("version", "1.0")

        # First the known schemas
        for schema_name, schema_def in self.schemas.items():
            schema = Schema.create_schema(schema_name, schema_def, self, None)
            if schema:
                self.add_schema(schema)
        # Now the tags without schemas
        self._create_namespace_schemas()

        # Generate main file
        main_template = self.jinja_env.get_template('main.ts.j2')
        return main_template.render(
            title=title,
            version=version,
            base_url=self.base_url,
            host=self.host,
            port=self.port,
            base_path=self.base_path,
            schemas=self.schema_objects_cache,
        )

class Type(Info):
    """Represents a type with its string representation and metadata."""
    
    info_type = "type"
    def __init__(self, schema: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(generator, schema, parent)
        self._ref_schema = None
        self._component_name = None
        if self.is_ref:
            # In case the ref is a class, use the class-of schema
            ref_path = self.schema_section["$ref"]
            if ref_path.startswith("#/components/schemas/"):
                component_name = ref_path.split("/")[-1]
                ref_schema = self.generator.find_schema(component_name)
                if "x-gi-class-of" in ref_schema and ref_schema["x-gi-class-of"]:
                    self._component_name = ref_schema["x-gi-class-of"]
                else:
                    self._component_name = component_name
                # Add the dependency to the parent class Schema
                self.add_dependency(self._component_name)
                # Don't eagerly resolve the schema to avoid recursion

    @property
    def is_ref(self):
        return "$ref" in self.schema_section

    @property
    def is_object(self):
        """Check if this type represents an object/struct (has a $ref)."""
        return self.is_ref

    @property
    def type(self):
        if self.is_ref:
            return "ref"
        else:
            return self.schema_section.get("type", "any")

    @property
    def lang_type(self):
        return self.generator.lang_type(self)

    @property
    def ref_schema(self) -> "Schema":
        """Lazily resolve the referenced schema to avoid recursion."""
        if self._ref_schema is None and self._component_name:
            self._ref_schema = self.generator.get_schema(self._component_name)
        return self._ref_schema

    @property
    def subtype(self) -> "Type":
        et = self.schema_section.get("x-gi-element-type", None)
        if et:
            return Type(et, self.generator, self)
        return None


class Param(Info):
    """Represents a method parameter with all its metadata."""
    
    info_type = "param"
    def __init__(self, param_def: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(generator, param_def, parent)
        self.type = Type(param_def.get("schema", {}), generator, self)

    @property
    def name(self):
        return self.schema_section.get("name")

    @property
    def required(self) -> bool:
        return self.schema_section.get("required", False)

    @property
    def location(self) -> str:
        return self.schema_section.get("in", "query")

    @property
    def transfer(self) -> str:
        return self.schema_section.get("x-gi-transfer", "none")

    @property
    def style(self) -> str:
        return self.schema_section.get("style", "form" if self.location == "query" else "simple")

    @property
    def explode(self) -> bool:
        return self.schema_section.get("explode", True if self.style == "form" else False)

    @property
    def description(self) -> str:
        return self.schema_section.get("description", "")


class ReturnParam(Info):
    """Represents a return parameter with its schema information specific to return values."""
    
    info_type = "return_param"
    def __init__(self, name: str, generator: 'Generator', schema: Dict[str, Any], parent: Optional['Info'] = None):
        super().__init__(generator, schema, parent)
        self._name = name
        self._type = Type(schema, generator, self)
        self._callback = None
        if self.is_callback:
            s = schema.get("x-gi-callback").split("/")[-1]
            self._callback = self.generator.get_schema(s)

    @property
    def name(self):
        return self._name

    @property
    def type(self) -> 'Type':
        return self._type

    @property
    def transfer(self) -> str:
        return self.schema_section.get("x-gi-transfer", "none")

    @property
    def can_be_null(self) -> str:
        return self.schema_section.get("x-gi-null", False)

    @property
    def description(self) -> str:
        return self.schema_section.get("description", "")
    
    @property
    def is_callback(self) -> bool:
        return "x-gi-callback" in self.schema_section

    @property
    def callback(self) -> 'Callback':
        return self._callback

    def generate(self) -> str:
        # We should try "return_param_GObjectObject.ts.j2", "return_param_object.ts.j2" or "return_param.ts.j2"
        template_names = [
            f'{self.info_type}_{self.type.lang_type}.ts.j2',
        ]
        if self.type.is_ref:
            template_names.append(f'{self.info_type}_{self.type.ref_schema.info_type}.ts.j2')

        template_names.append(f'{self.info_type}.ts.j2')
        for tn in template_names:
            try:
                template = self.generator.jinja_env.get_template(tn)
                return template.render(**{self.info_type: self})
            except TemplateNotFound:
                pass



class Schema(Info):
    """Base class for all schema types."""
    
    info_type = "schema"
    def __init__(
            self,
            name: str,
            schema_def: Dict[str, Any],
            generator: 'Generator',
            parent: Optional['Info'] = None):
        super().__init__(generator, schema_def, parent)
        self._name = name
        self.parse_schema()

    @property
    def name(self):
        return self._name

    def parse_schema(self):
        pass

    @classmethod
    def create_schema(cls, name: str, schema_def: Optional[Dict[str, Any]], generator: 'Generator', parent: Optional['Info'] = None) -> 'Schema':
        """Factory method to create appropriate schema type."""
        if schema_def is None:
            return Namespace(name, generator)
        
        gi_type = schema_def.get("x-gi-type", "")
        if not gi_type:
            schema_type = schema_def.get("type")
            if schema_type == "object":
                return Interface(name, schema_def, generator, parent)
            else:
                return Alias(name, schema_def, generator, parent)

        if gi_type == "enum":
            return Enum(name, schema_def, generator, parent)
        elif gi_type == "flags":
            return Flags(name, schema_def, generator, parent)
        elif gi_type == "callback":
            return Callback(name, schema_def, generator, parent)
        elif gi_type == "struct":
            # Don't generate structs that are classes of Objects
            # those will be generated as part of the actual Object
            if not schema_def.get("x-gi-class-of", None):
                return Struct(name, schema_def, generator, parent)
        elif gi_type == "object":
            return Object(name, schema_def, generator, parent)
        else:
            return Schema(name, schema_def, generator, parent)
    

class Enum(Schema):
    """Represents an GObject Enumeration schema."""
    
    info_type = "enum"
    def __init__(self, name: str, schema_def: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(name, schema_def, generator, parent)
        self._methods: List[Method] = self.generator.get_methods_for_schema(self)

    @property
    def values(self):
        return [
            {
                "const_name": value.upper().replace("-", "_").replace(".", "_"),
                "value": value
            }
            for value in self.schema_section.get("enum", [])
        ]

    @property
    def namespace(self) -> str:
        return self.schema_section.get("x-gi-namespace")

    @property
    def type_name(self) -> str:
        return self.schema_section.get("x-gi-name")

    @property
    def methods(self) -> List["Method"]:
        return self._methods


class Flags(Enum):
    """Represents a GObject flags schema (bitfield enum)."""
    
    info_type = "flags"
    

class Field(Schema):
    """Represents a GObject Callback parameter or generic field"""
    info_type = "field"
    def __init__(self, name: str, schema_def: Dict[str, Any], generator: 'Generator', parent: 'Info'):
        super().__init__(name, schema_def, generator, parent)
        self.type = Type(schema_def, generator, self)

    @property
    def transfer(self) -> str:
        return self.schema_section.get("x-gi-transfer", "none")

    @property
    def can_be_null(self) -> str:
        return self.schema_section.get("x-gi-null", False)


class Callback(Schema):
    """Represents a GObject Callback function schema."""
    
    info_type = "callback"
    def __init__(self, name: str, schema_def: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(name, schema_def, generator, parent)
        self._parameters: List[Param] = []
        raw_properties = schema_def.get("properties", {})
        for pname, pv in raw_properties.items():
            if pv["x-gi-is-return"]:
                self._return_param = ReturnParam(pname, self.generator, pv, self)
            else:
                self._parameters.append(Field(pname, pv, generator, self))

    @property
    def parameters(self) -> List["Field"]:
        return self._parameters

    @property
    def return_param(self) -> Optional[ReturnParam]:
        """Get the main return parameter."""
        return self._return_param

    @property
    def is_void(self) -> bool:
        """Check if this method returns void."""
        return self._return_param is None


class Struct(Schema):
    """Represents a GObject Struct schema."""
    
    info_type = "struct"
    def __init__(self, name: str, schema_def: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(name, schema_def, generator, parent)
        self._methods: List[Method] = self.generator.get_methods_for_schema(self)

    @property
    def all_methods(self) -> List["Method"]:
        return self._methods

    @property
    def methods(self) -> List["Method"]:
        return [method for method in self._methods if not method.is_constructor and not method.is_destructor]

    @property
    def constructors(self) -> List["Method"]:
        return [method for method in self._methods if method.is_constructor]

    @property
    def destructors(self) -> List["Method"]:
        return [method for method in self._methods if method.is_destructor]

    @property
    def copy(self) -> "Method":
        return [method for method in self._methods if method.is_copy][0]

    @property
    def namespace(self) -> str:
        return self.schema_section.get("x-gi-namespace")

    @property
    def type_name(self) -> str:
        return self.schema_section.get("x-gi-name")


class Object(Schema):
    """Represents an object schema with inheritance."""
    
    info_type = "object"
    def __init__(self, name: str, schema_def: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        super().__init__(name, schema_def, generator, parent)
        self._class_name = None
        if schema_def.get("x-gi-class", None):
            self._class_name = schema_def["x-gi-class"]
        self._methods: List[Method] = self.generator.get_methods_for_schema(self)
        self._parent_schema = None
        parent_class = self._extract_parent_name()
        if parent_class:
            # Add the dependency to the parent class Schema
            self.add_dependency(parent_class)
            # Generate the new schema
            self._parent_schema = self.generator.get_schema(parent_class)
        # Check for base class warning
        has_destructor_or_copy = any(method.is_destructor or method.is_copy for method in self._methods)
        if not self._parent_schema and not has_destructor_or_copy:
            logger.warning(f"Base class '{self.name}' is missing ref (copy), unref (destructor) method(s)")
    
    def _extract_parent_name(self) -> Optional[str]:
        """Extract parent class name from allOf structure."""
        if "allOf" in self.schema_section:
            for item in self.schema_section["allOf"]:
                if "$ref" in item:
                    ref_path = item["$ref"]
                    if ref_path.startswith("#/components/schemas/"):
                        parent_name = ref_path.split("/")[-1]
                        return parent_name
        return None

    @property
    def all_methods(self) -> List["Method"]:
        return self._methods

    @property
    def methods(self) -> List["Method"]:
        return [method for method in self._methods if not method.is_constructor and not method.is_destructor]

    @property
    def constructors(self) -> List["Method"]:
        return [method for method in self._methods if method.is_constructor]

    @property
    def destructors(self) -> List["Method"]:
        return [method for method in self._methods if method.is_destructor]

    @property
    def copy(self) -> "Method":
        return [method for method in self._methods if method.is_copy][0]

    @property
    def final_destructors(self) -> List["Method"]:
        # Get the destructors from the parent schema recursively if not found
        if self.destructors:
            return self.destructors
        elif self.parent_schema:
            return self.parent_schema.destructors
        else:
            return []

    @property
    def final_constructors(self) -> List["Method"]:
        # Get the constructors from the parent schema recursively if not found
        if self.constructors:
            return self.constructors
        elif self.parent_schema:
            return self.parent_schema.constructors
        else:
            return []

    @property
    def final_copy(self) -> List["Method"]:
        # Get the destructors from the parent schema recursively if not found
        if self.copy:
            return self.copy
        elif self.parent_schema:
            return self.parent_schema.copy
        else:
            return None

    @property
    def parent_schema(self) -> "Object":
        return self._parent_schema

    @property
    def namespace(self) -> str:
        return self.schema_section.get("x-gi-namespace")

    @property
    def type_name(self) -> str:
        return self.schema_section.get("x-gi-name")


class Namespace(Schema):
    """Represents a namespace schema for holding static methods only."""
    
    info_type = "namespace"
    def __init__(self, name: str, generator: 'Generator'):
        super().__init__(name, None, generator, None)
        self._methods: List['Method'] = self.generator.get_methods_for_schema(self)
    
    @property
    def methods(self):
        return self._methods


class Alias(Schema):
    """Represents an alias schema. Like Pointer."""
    
    info_type = "alias"
        
    # TODO this is wrong.
    def generate(self) -> str:
        # For basic types (string, number, boolean), use alias template
        schema_type = self.schema_section.get("type")
        if schema_type in ["string", "number", "integer", "boolean"]:
            template = self.generator.jinja_env.get_template('alias.ts.j2')
            
            # Use the Type class to get the TypeScript type
            type_obj = Type(self.schema_section, self.generator, self)
            typescript_type = type_obj.lang_type
            
            return template.render(**{self.info_type: self, 'typescript_type': typescript_type})
        


class Interface(Schema):
    """Represents a schema of object type, but not x-gi-type, like Event."""
    
    info_type = "interface"

    def parse_schema(self):
        """Parse interface-specific data."""
        # Prepare basic interface data
        properties = self.schema_section.get("properties", {}) if self.schema_section else {}
        required = self.schema_section.get("required", []) if self.schema_section else []
        
        self.has_parent = False  # TODO: Check for inheritance
        self.parent = None  # TODO: Extract parent if exists
        self.properties = []
        
        # Create property objects using the Type class
        for prop_name, prop_schema in properties.items():
            prop_type = Type(prop_schema, self.generator, self)
            self.properties.append({
                "name": prop_name,
                "optional": "" if prop_name in required else "?",
                "type": prop_type.lang_type
            })

    # TODO this is wrong.
    def generate(self) -> str:
        """Generate TypeScript code. Base implementation for unknown types."""
        template = self.generator.jinja_env.get_template('interface.ts.j2')
        return template.render(**{self.info_type: self})
 
class Return(Info):
    """Represents a method return type with its schema information."""

    info_type = "return"

    def __init__(self, method_data: Dict[str, Any], generator: 'Generator', parent: Optional['Info'] = None):
        # Extract the return schema from method_data
        responses = method_data.get("responses", {})
        return_schema = {}
        if "200" in responses:
            content = responses["200"].get("content", {})
            app_json = content.get("application/json", {})
            return_schema = app_json.get("schema", {})
        
        super().__init__(generator, return_schema, parent)
        self.method_data = method_data
        self.properties = {}
        self._return_params: List[ReturnParam] = []
        self._parse_returns()
    
    def _parse_returns(self):
        """Parse the return types from method responses."""
        if self.schema_section:
            self.properties = self.schema_section.get("properties", {})
            for rk, rv in self.properties.items():
                self._return_params.append(ReturnParam(rk, self.generator, rv, self))

    @property
    def return_params(self) -> Optional[List[ReturnParam]]:
        """Get the main return parameter."""
        return self._return_params

    @property
    def is_void(self) -> bool:
        """Check if this method returns void."""
        return not self._return_params

    def generate(self) -> str:
        template = self.generator.jinja_env.get_template('return.ts.j2')
        return template.render(**{self.info_type: self})


class Method(Info):
    """Represents a method of a schema."""
    
    info_type = "method"
    def __init__(
            self,
            operation_dict: Dict[str, Any],
            path: str,
            http_method: str,
            parent_schema: Schema,
            generator: 'Generator',
            is_class: bool = False):
        """
        Initialize a Method object.
        
        Args:
            operation_dict: The OpenAPI operation dictionary
            path: The path for this operation
            http_method: The HTTP method (GET, POST, etc.)
            parent_schema: The parent schema this method belongs to
            generator: The generator instance
            is_class: Whether this method belongs to a class
        """
        super().__init__(generator, operation_dict, parent_schema)
        self.operation_dict = operation_dict
        self.path = path
        self.http_method = http_method
        self.return_obj = Return(operation_dict, generator, self)
        self.is_class = is_class
        
        # Parse parameters using the Param class
        self.parameters: List[Param] = []
        raw_parameters = self.operation_dict.get("parameters", [])
        for param_def in raw_parameters:
            param = Param(param_def, self.generator, self)
            self.parameters.append(param)
        
    @property
    def params(self) -> List[Param]:
        """Get all parameters for this method."""
        return self.parameters

    @property
    def query_params(self) -> List[Param]:
        """Get only query parameters for this method."""
        return [p for p in self.parameters if p.location == "query"]

    @property
    def path_params(self) -> List[Param]:
        """Get only path parameters for this method."""
        return [p for p in self.parameters if p.location == "path"]
    
    @property
    def parsed_operation_id(self):
        operation_id = self.schema_section.get("operationId", "")
        if not operation_id:
            raise ValueError(f"Path {self.path} does not have an operationId")
        # Parse operation ID to get method name
        parsed = parse_operation_id(operation_id)
        if not parsed:
            raise ValueError(f"Path {self.path} does not follow the operationId pattern")
        return parsed

    @property
    def id(self) -> str:
        """Extract method name from operation ID"""
        namespace_name, class_name, method_name, operation = self.parsed_operation_id
        name = namespace_name
        if class_name:
            name += class_name
        if operation:
            name += f"_{operation}"
        name += f"_{method_name}"
        return name 


    @property
    def name(self) -> str:
        # The name of the function is {method_name} or {operation}_{method_name}
        _, _, method_name, operation = self.parsed_operation_id
        if operation:
            return f"{operation}_{method_name}"
        else:
            return method_name

    @property
    def is_constructor(self) -> bool:
        return self.schema_section.get("x-gi-constructor", False)

    @property
    def is_destructor(self) -> bool:
        return self.schema_section.get("x-gi-destructor", False)

    @property
    def is_copy(self) -> bool:
        return self.schema_section.get("x-gi-copy", False)

    @property
    def is_static(self) -> bool:
        if self.is_constructor:
            return True
        if self.is_class:
            return True
        if not self.path_params:
            return True
        return False

    @property
    def is_namespace_function(self) -> bool:
        if self.parent and isinstance(self.parent, Namespace):
            return True
        return False

    @property
    def callback_params(self) -> List['ReturnParam']:
        return [rp for rp in self.return_obj.return_params if rp.is_callback]

    def is_equal(self, other: 'Method') -> bool:
        # Check the name
        if self.name != other.name:
            return False
        # Check the number of params
        if len(self.params) != len(other.params):
            return False

        # Check the type of params
        for i in range(len(self.params)):
            p = self.params[i]
            po = other.params[i]
            if p.type.lang_type != po.type.lang_type:
                return False

        return True


"""
TypeScript bindings generator for GIRest OpenAPI schemas using Jinja2 templates.

This module converts OpenAPI schemas generated by GIRest into TypeScript
bindings with proper class structure, inheritance, and type definitions.

Refactored to use a type-oriented approach similar to main.py where each
x-gi-type (object, struct, enum, callback, etc.) is handled by dedicated methods.
"""
class TypeScriptGenerator(Generator):
    """Generates TypeScript bindings from OpenAPI schema using Jinja2 templates."""
    
    # Reserved keywords in TypeScript/JavaScript
    RESERVED_KEYWORDS = {
        "function", "var", "let", "const", "class", "interface", "enum", "type",
        "namespace", "module", "import", "export", "default", "async", "await",
        "break", "case", "catch", "continue", "debugger", "delete", "do", "else",
        "finally", "for", "if", "in", "instanceof", "new", "return", "switch",
        "this", "throw", "try", "typeof", "void", "while", "with", "yield",
        "package", "implements", "private", "public", "protected", "static",
        "eval", "arguments",
        # Common variable names that might conflict
        "data", "response", "error", "result", "value", "url"
    }
    
    def __init__(self, openapi_schema: Dict[str, Any], host: str = "localhost", port: int = 9000, base_path: str = ""):
        super().__init__(openapi_schema, host, port, base_path)
        # Base class already sets up jinja_env - no need to override unless specific customization needed

    def get_template_dir(self) -> str:
        """Get the template directory for TypeScript generation."""
        return os.path.join(os.path.dirname(__file__), 'templates')

    def get_valid_name(self, info: 'Info') -> str:
        """
        Get a safe name for TypeScript, handling reserved keywords and method conflicts.
        
        Args:
            info: The Info object requesting a name

        Returns:
            A safe name for TypeScript
        """
        # The name of an Enum might vary, or either Enum or EnumValue
        if isinstance(info, Enum):
            if info.methods:
                return f'{info.name}Value'
            else:
                return f'{info.name}'
        elif isinstance(info, Method):
            # For methods, handle inheritance conflicts
            method = info
            schema = method.parent
    
            # Get all method names from parent classes
            if isinstance(schema, Object):
                parent_methods = self._get_parent_methods(schema.parent_schema)
        
                # Check for conflicts and add suffix if needed
                for m in parent_methods:
                    if info.name == m.name and not info.is_equal(m):
                        # increment the suffix for the valid name
                        logger.info(f"Renaming {info.name} for {info.parent.name}")
                        suffix = 2
                        while f"{info.name}_{suffix}" == m.valid_name:
                            suffix += 1
                        return f"{info.name}_{suffix}"
                return info.name
    
            # Check for reserved keywords - but skip for constructor methods
            # Constructor methods should keep their original names (like "new")
            if not method.is_constructor and info.name in self.RESERVED_KEYWORDS:
                return f"{info.name}_"
    
            return info.name
        else:
            # Handle reserved keywords for non-method objects
            if info.name in self.RESERVED_KEYWORDS:
                return f"{info.name}_"
            return info.name

    def lang_type(self, t: 'Type') -> str:
        """Convert OpenAPI basic types to TypeScript types."""
        if t.is_ref:
            return t.ref_schema.valid_name

        type_mapping = {
            "string": "string",
            "integer": "number",
            "number": "number",
            "boolean": "boolean",
            "object": "object",
        }
        return type_mapping.get(t.type, "any")

    def _get_parent_methods(self, obj: 'Schema') -> Set['Method']:
        """Get all method names from parent classes in the inheritance chain."""
        parent_methods = set()

        # Check if parent is a Struct (base class case) or Object
        if isinstance(obj, Struct):
            # For Struct parents, get methods but don't recurse (base class)
            for method in obj.all_methods:
                parent_methods.add(method)
        elif isinstance(obj, Object):
            # For Object parents, get methods and recurse up the inheritance chain
            for method in obj.all_methods:
                parent_methods.add(method)
            # Recursively get names from parent's parents
            parent_methods.update(self._get_parent_methods(obj.parent_schema))

        return parent_methods
    
    def _safe_property_name(self, name: str) -> str:
        """Convert a schema property name to a safe TypeScript identifier."""
        if name in self.RESERVED_KEYWORDS:
            return f"{name}_"
        return name
