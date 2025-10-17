# GitHub Copilot Instructions for gst-audit

## Project Overview

`gst-audit` is a live auditing tool for running GStreamer pipelines. It uses Frida to attach to running processes and exposes the GStreamer API as a REST API through FastAPI.

## Technology Stack

- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Process Instrumentation**: Frida
- **Introspection**: GObject Introspection (GIRepository)
- **API Documentation**: OpenAPI/Swagger
- **JavaScript**: Custom Frida scripts (gstaudit.js)

## Project Structure

- `gstaudit/` - Main Python package
  - `main.py` - FastAPI application entry point
  - `router.py` - Dynamic route generation from GObject introspection
  - `types.py` - Custom type definitions (e.g., Pointer)
  - `decorators.py` - SSE and other decorators
- `girest/` - GIRepository REST API utilities
- `examples/` - Example scripts demonstrating usage
- `gstaudit.js` - Frida JavaScript instrumentation script

## Code Style & Conventions

### Python
- Follow PEP 8 style guidelines
- Use type hints for function signatures
- Prefer descriptive variable names
- Use `async`/`await` for asynchronous operations
- Log using the configured `colorlog` logger

### API Design
- Routes are auto-generated from GObject introspection metadata
- Follow RESTful conventions
- Use appropriate HTTP status codes (200, 204, etc.)
- Support both integer and hex string representations for pointers
- Return output parameters in response body

## Dependencies

Managed via Poetry (`pyproject.toml`):
- `frida` - Process instrumentation
- `fastapi` - Web framework
- `fastapi-sse` - Server-Sent Events support
- `colorlog` - Colored logging

## Key Concepts

### GObject Introspection
- The project dynamically generates REST endpoints from GObject introspection data
- Supports enums, structs, objects, and functions
- Handles callbacks via Server-Sent Events (SSE)
- Maps GType system to REST API types

### Pointer Handling
- Pointers can be passed as integers or hex strings (prefixed with '0x')
- Custom `Pointer` type handles both representations
- Native pointer integers are used internally

### Callbacks
- Callbacks are exposed via SSE endpoint at `/Application/callbacks`
- Callback IDs are returned in responses
- Closure and destroy notify parameters are handled automatically

## Common Tasks

### Running the Application
```bash
PID=[PID] fastapi dev gstaudit/main.py
```

### Adding New Routes
Routes are auto-generated. To add custom routes:
1. Add them to the FastAPI app in `main.py`
2. Follow the pattern of `/Application/*` for non-GObject routes

### Modifying Type Mappings
Edit `_type_to_rest()` and `_type_to_json()` in `router.py` to:
- Add support for new GType types
- Change how types are exposed in the REST API

### Logging
Use the pre-configured logger:
```python
from gstaudit.main import logger
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```

## Testing Guidelines

- Test with real GStreamer pipelines (e.g., `gst-launch-1.0`)
- Verify API responses match expected GObject behavior
- Test pointer handling with both integer and hex formats
- Validate callback handling via SSE endpoints

## Important Notes

- **PyGObject not used**: Direct GIRepository access is required to expose internal functions (e.g., `unref`, functions to free structs)
- **Custom OpenAPI schema**: FastAPI's automatic schema generation has limitations; custom `apispec` usage may be needed
- **Frida session lifecycle**: Managed in the FastAPI lifespan context manager
- **Thread safety**: Be cautious with shared state (e.g., `callbacks_data`)

## Future Enhancements

- [ ] HTTP callback support (currently only SSE)
- [ ] GError handling for proper HTTP error responses
- [ ] Circular queue for callback data to prevent memory growth
- [ ] Enhanced TypeScript bindings generation

## References

- [Frida Documentation](https://frida.re)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [GIRepository Documentation](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
- [OpenAPI Specification](https://spec.openapis.org/)
