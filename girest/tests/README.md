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
poetry run pytest tests/test_gst_e2e.py -v
```

## Test Structure

### test_gst_e2e.py

End-to-end tests for the Gst namespace. These tests:

1. **Start a GStreamer Pipeline** - Launches `gst-launch-1.0 fakesrc ! fakesink` in a subprocess
2. **Start the GIRest Server** - Launches the server attached to the pipeline using Frida
3. **Test Endpoints**:
   - `/Gst/version` - Tests non-void return values (returns a string)
   - `/Gst/get_version` - Tests output integer parameters (returns major, minor, micro, nano versions)

## Writing New Tests

When adding new tests:

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

3. **Run with More Verbose Output**:
   ```bash
   poetry run pytest tests/ -vv -s
   ```

4. **Check Frida Permissions** - Frida requires permissions to attach to processes. You may need to adjust permissions or run tests with appropriate privileges.
