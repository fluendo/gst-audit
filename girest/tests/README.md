# GIRest Tests

This directory contains end-to-end tests for the GIRest framework.

## Prerequisites

Before running the tests, ensure you have:

1. **GStreamer installed** - The tests require `gst-launch-1.0` to be available in your PATH
2. **Python dependencies** - Install using poetry:
   ```bash
   cd girest
   poetry install
   ```

## Running Tests

To run all tests:

```bash
cd girest
poetry run pytest tests/
```

To run tests with verbose output:

```bash
poetry run pytest tests/ -v
```

To run a specific test file:

```bash
poetry run pytest tests/test_schema.py -v
poetry run pytest tests/test_generator.py -v
poetry run pytest tests/test_gst_e2e.py -v
```

## Test Structure

### test_schema.py

Tests for OpenAPI schema generation (`girest/main.py`). These tests verify:

1. **Generic Constructor/Destructor Generation** - Ensures structs without constructors get generic `new`/`free` endpoints
2. **Struct Method Schemas** - Verifies that struct methods are correctly included in the schema
3. **Operation IDs and Tags** - Ensures consistent naming patterns for schema operations
4. **Resolver Logic** - Tests the pattern matching logic for identifying generic operations

### test_generator.py

Tests for TypeScript generator (`girest/generator.py`). These tests verify:

1. **Inheritance Handling** - Ensures TypeScript classes correctly extend parent classes
2. **Class vs Interface Generation** - Structs with methods become classes, those without become interfaces
3. **Generic Constructor Methods** - Verifies static `new()` methods are generated for generic constructors
4. **Base Class Structure** - Ensures base classes have required properties and methods

### test_gst_e2e.py

End-to-end tests for the Gst namespace. These tests:

1. **Start a GStreamer Pipeline** - Launches `gst-launch-1.0 fakesrc is-live=true do-timestamp=true ! fakesink sync=true` in a subprocess
2. **Start the GIRest Server** - Launches the server attached to the pipeline using Frida
3. **Test Endpoints**:
   - `/Gst/version_string` - Tests non-void return values (returns a string)
   - `/Gst/version` - Tests output integer parameters (returns major, minor, micro, nano versions)

## Writing New Tests

When adding new tests, choose the appropriate file based on what you're testing:

### For Schema Generation Tests (test_schema.py)

Add tests that verify the OpenAPI schema generation:

1. Use `GIRest` to generate schemas
2. Verify endpoint paths, operation IDs, and tags
3. Check schema metadata (`x-gi-constructor`, `x-gi-type`, etc.)

Example:

```python
def test_my_schema_feature():
    """Test description."""
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    # Your assertions on the schema
    assert '/Gst/MyClass/my_method' in schema['paths']
```

### For TypeScript Generator Tests (test_generator.py)

Add tests that verify TypeScript code generation:

1. Generate an OpenAPI schema using `GIRest`
2. Use `TypeScriptGenerator` to generate TypeScript code
3. Verify the generated code structure

Example:

```python
def test_my_generator_feature():
    """Test description."""
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    schema = spec.to_dict()
    
    ts_gen = TypeScriptGenerator(schema, host='localhost', port=9000)
    output = ts_gen.generate()
    
    # Your assertions on the generated TypeScript
    assert 'export class MyClass' in output
```

### For End-to-End Tests (test_gst_e2e.py)

Add tests that verify the full stack integration:

1. Use the `gst_pipeline` fixture to get a running GStreamer pipeline PID
2. Use the `girest_server` fixture to get the base URL of the running server
3. Use `httpx.AsyncClient` for making HTTP requests
4. Mark async tests with `@pytest.mark.asyncio`

Example:

```python
@pytest.mark.asyncio
async def test_new_endpoint(girest_server):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/some_endpoint")
        assert response.status_code == 200
        data = response.json()
        # Your assertions here
```

## Troubleshooting

If tests fail:

1. **Check GStreamer Installation**:
   ```bash
   which gst-launch-1.0
   gst-launch-1.0 --version
   ```

2. **Check Dependencies**:
   ```bash
   poetry install
   ```

3. **Check ptrace Permissions** - Frida requires permissions to attach to processes. If you get "process not found" errors:
   ```bash
   # Temporarily allow ptrace for all processes (requires sudo)
   echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope
   ```
   
   Note: This setting resets after reboot. For a permanent solution on development systems, add to `/etc/sysctl.d/10-ptrace.conf`:
   ```
   kernel.yama.ptrace_scope = 0
   ```

4. **Run with More Verbose Output**:
   ```bash
   poetry run pytest tests/ -vv -s
   ```
