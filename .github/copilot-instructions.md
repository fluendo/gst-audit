# GitHub Copilot Instructions for gst-audit

## Project Overview

`gst-audit` is a live auditing tool for running GStreamer pipelines. It uses Frida to attach to running processes and exposes the GStreamer API as a REST API through FastAPI.

For detailed usage examples and additional context, see the [main README](../README.md).

## Technology Stack

- **Language**: Python 3.10+
- **Framework**: FastAPI (main app), Connexion (girest subproject)
- **Process Instrumentation**: Frida
- **Introspection**: GObject Introspection (GIRepository)
- **API Documentation**: OpenAPI/Swagger
- **JavaScript**: Custom Frida scripts (gstaudit.js)

## Project Structure

The repository consists of two main components:

### Main Application (`gstaudit/`)
- `main.py` - FastAPI application entry point with Frida session management
- `router.py` - Dynamic route generation from GObject introspection (GIRouter class)
- `types.py` - Custom type definitions (Pointer type with validation)
- `decorators.py` - SSE response handlers and decorators

### GIRest Subproject (`girest/`)
A standalone GIRepository to REST API generator with its own dependencies:
- `girest/main.py` - Core GIRest class for generating OpenAPI schemas from GIR
- `girest/app.py` - Connexion-based API application
- `pyproject.toml` - Separate Poetry configuration (uses Connexion instead of FastAPI)

### Other Components
- `gstaudit.js` - Frida JavaScript instrumentation script for process attachment
- `examples/` - Example JavaScript files demonstrating usage
- `pyproject.toml` - Root Poetry configuration for the main gstaudit application

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

The project has two separate dependency configurations:

### Main Application (`pyproject.toml`)
Managed via Poetry:
- `frida` - Process instrumentation
- `fastapi` - Web framework
- `fastapi-sse` - Server-Sent Events support
- `colorlog` - Colored logging

### GIRest Subproject (`girest/pyproject.toml`)
Separate Poetry configuration:
- `connexion` - API framework with built-in OpenAPI support
- `frida` - Process instrumentation (shared with main app)
- `pygobject` - GObject bindings (version < 3.50.0)
- `apispec` - OpenAPI schema generation library

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

- **PyGObject not used directly**: Direct GIRepository access is required to expose internal functions (e.g., `unref`, functions to free structs). PyGObject hides this information as it manages memory internally. See the [README](../README.md#pyGObject) for more context.
- **FastAPI limitations**: FastAPI lacks proper inheritance support for object types in OpenAPI schemas and makes it difficult to add schema metadata for fields (needed for automatic TypeScript bindings). The `apispec` library is used directly for more control. See the [README](../README.md#fastapi) for details.
- **Frida session lifecycle**: Managed in the FastAPI lifespan context manager (see `main.py`)
- **Thread safety**: Be cautious with shared state (e.g., `callbacks_data` list in `main.py`)
- **Two similar but different approaches**: The main `gstaudit` uses FastAPI with custom GIRouter, while `girest` uses Connexion with apispec for schema generation

## Future Enhancements

- [ ] HTTP callback support (currently only SSE)
- [ ] GError handling for proper HTTP error responses
- [ ] Circular queue for callback data to prevent memory growth
- [ ] Enhanced TypeScript bindings generation

## References

- [Main README](../README.md) - Project overview, examples, and architectural decisions
- [Frida Documentation](https://frida.re)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [GIRepository Documentation](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
- [OpenAPI Specification](https://spec.openapis.org/)
- [OpenAPI to TypeScript](https://heyapi.dev/openapi-ts/output)
- [Connexion Documentation](https://connexion.readthedocs.io/)
