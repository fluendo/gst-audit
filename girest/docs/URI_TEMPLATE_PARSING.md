# URI Template Parsing and Enhanced Validation

## Overview

GIRest now uses custom URI parsing and validation to properly handle the complex parameter serialization required by the OpenAPI 3.0.2 specification, particularly for:
- Object parameters in URLs
- Schema composition keywords (allOf, anyOf, oneOf)
- Form style with explode=true
- GObject type hierarchies

## Components

### URITemplateParser

Located in `girest/uri_parser.py`, this parser extends Connexion's `OpenAPIURIParser` to use the [uritemplate](https://github.com/python-hyper/uritemplate) library for more robust URI parsing.

**Key Features:**
- Converts parameter definitions to URI templates based on their style and explode settings
- Handles complex object types in path and query parameters
- Supports allOf, anyOf, oneOf schema compositions
- Maintains backward compatibility with existing endpoints

**Example:**
```python
from girest.uri_parser import URITemplateParser

# For a parameter with form style and explode=true
param_defns = [
    {
        "name": "filter",
        "in": "query",
        "schema": {"type": "object", "properties": {...}},
        "style": "form",
        "explode": True
    }
]

parser = URITemplateParser(param_defns, {})
resolved = parser.resolve_query({"filter": [{"name": "value"}]})
```

### GIRestParameterValidator

Located in `girest/validators.py`, this validator extends Connexion's `ParameterValidator` to properly handle JSON Schema composition keywords.

**Key Features:**
- Enhanced validation for allOf, anyOf, oneOf schemas
- Better error messages for complex schema validations
- Compatible with GObject introspection type hierarchies

**Example:**
```python
from girest.validators import GIRestParameterValidator

param = {
    "name": "obj",
    "schema": {
        "allOf": [
            {"type": "object", "properties": {"ptr": {"type": "integer"}}},
            {"type": "object"}
        ]
    }
}

error = GIRestParameterValidator.validate_parameter(
    "query", {"ptr": 12345}, param
)
# Returns None if valid, error message string if invalid
```

## Usage

The custom parser and validator are automatically configured in `girest-frida.py`:

```python
from girest.uri_parser import URITemplateParser
from girest.validators import GIRestParameterValidator

# Custom validator map
custom_validator_map = {
    "parameter": GIRestParameterValidator,
    # ... other validators
}

# Add API with custom components
app.add_api(
    spec,
    resolver=resolver,
    uri_parser_class=URITemplateParser,
    validator_map=custom_validator_map
)
```

## Testing

Comprehensive tests are available in:
- `tests/test_uri_parser.py` - Unit tests for parser and validator
- `tests/test_url_objects.py` - Integration tests with real GIRest schemas

Run tests with:
```bash
cd girest
python3 -m pytest tests/test_uri_parser.py tests/test_url_objects.py -v
```

## Implementation Details

### URI Template Conversion

The parser converts OpenAPI parameter definitions to URI template syntax:

| Style | Explode | Template Syntax | Example |
|-------|---------|----------------|---------|
| form  | true    | `{param*}`     | `?name=John&age=30` |
| form  | false   | `{param}`      | `?filter=name,John,age,30` |
| simple| true    | `{param*}`     | `/users/1,2,3` |
| simple| false   | `{param}`      | `/users/1,2,3` |

### Schema Composition Support

The validator uses jsonschema's Draft4Validator which natively supports:
- **allOf**: Value must match ALL schemas (used for inheritance)
- **anyOf**: Value must match AT LEAST ONE schema
- **oneOf**: Value must match EXACTLY ONE schema

Example from GIRest schema:
```json
{
  "allOf": [
    {"$ref": "#/components/schemas/GObjectObject"},
    {"type": "object"}
  ]
}
```

### Pointer Type Handling

GIRest uses a special Pointer schema that accepts both integers and hex strings:
```json
{
  "oneOf": [
    {"type": "integer"},
    {"type": "string", "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$"}
  ]
}
```

The validator correctly handles both formats:
- Integer: `12345`
- Hex string: `0x12345`
- Decimal string: `12345`

## Compatibility

- **Connexion Version**: 3.3.0+
- **OpenAPI Version**: 3.0.2 (as specified in GIRest)
- **Python Version**: 3.10+
- **Backward Compatible**: All existing endpoints continue to work

## Dependencies

- `uritemplate ^4.1.1` - URI template parsing (RFC 6570)

Added to `pyproject.toml`:
```toml
[tool.poetry.dependencies]
uritemplate = "^4.1.1"
```
