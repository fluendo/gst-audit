# Gst-Audit
`Gst-Audit` is a siple and live way to audit your _running_ pipeline.

## Features
`Gst-Audit` uses [frida](https://frida.re) to attach to your program and then exposes the GStreamer API as
a REST API through [fastapi](https://fastapi.tiangolo.com/)

### Swagger
As any other `fastapi` application you will find the swagger at [http://127.0.0.1:8000/docs]()

### REST API
Gst-Audit provides a REST API to interact with your running pipeline that matches introspection
information provided by the GObject's introspection system. The following features are supported:
* [x] Pointer types to pass either the integer representation of a native pointer or a string prefixed with `0x`
* [x] Return types are properly returned in the HTTP response
* [x] Output arguments are properly returned in the HTTP response
* [x] Enums are included in the schema to narrow the possibilites of the parameters
* [x] Callbacks are handled in a generic SSE endpoint
* [x] TypeScript bindings automatically dispatch callbacks via EventSource
* [ ] Callbacks are handled as an HTTP callback
* [ ] GError handling to return different HTTP response

## Running
To launch `Gst-Audit` just do:
```bash
> PID=[PID] fastapi dev gstaudit/main.py
```
using the PID of the process you want to audit

## Example
First, you need to launch your pipeline, for example:

```bash
> gst-launch-1.0 videotestsrc ! fakesink
```

Then, get the `PID` of it and finally launch `Gst-Audit` passing the `PID` by doing:

```bash
> PID=[PID] fastapi dev gstaudit/main.py
```

Finally, interact with the REST API, for example to pause it do:

```js
const getPipelines = async () => {
  const response = await fetch("http://localhost:8000/Application/pipelines");
  const json = await response.json();
  return json;
}

const pause = async(obj) => {
  const response = await fetch(`http://localhost:8000/Gst/Element/${obj}/set_state?state=3`);
}

async function main() {
  const pipelines = await getPipelines();
  for (p of pipelines) {
      console.log(`Pausing ${p}`);
      pause(p);
  }
}

main();

```

## Installation

## Why XXX is not used?
### PyGObject
PyGObject is not used to know the introspection information of the desired namespace because it "hides" information, like
the functions to free a `struct` or the `unref` methods. Those are managed internally by the PyGObject code making it impossible to generate proper bindings. We use `GIRepository` through `PyGObject` tho.

### FastAPI
FastAPI is a great tool but it lacks a proper inheritance support of object types in the schema. Also, you can not easily
add schema metadata (required for the automatic TypeScript bindings) in fields, only on endpoints. There are workardounds
for the previous statement but it requires generating Pydantic models and extend them. Too much of a burden. We use `apispec` directly to generate a valid `openapi` schema.

## Schema Dumper

The `girest-dump-schema` tool generates OpenAPI schema in JSON format from GObject introspection data.

```bash
cd girest
python3 girest-dump-schema.py Gst 1.0 -o gst-schema.json
```

## TypeScript Client Generator

The `girest-client-generator` tool generates TypeScript client bindings from the GIRest schema. This allows you to have type-safe TypeScript code when working with the REST API. The tool requires a base URL for the REST API.

```bash
cd girest
python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
```

See [girest/README-client-generator.md](girest/README-client-generator.md) for more details.

### Callback Support

The TypeScript bindings include automatic callback support. When you call a function that takes a callback parameter (like `Gst.debug_add_log_function`), the generated code will:

1. Make the REST API call to register the callback
2. Receive a callback ID from the server
3. Automatically register your callback function with the internal dispatcher
4. Listen for callback events via EventSource on `/Application/callbacks`
5. Dispatch events to your callback function when they arrive

Example usage:

```typescript
import { Gst } from './gst';

// Define your callback function with proper types
function onLog(category, level, file, func, line, obj, message) {
  console.log(`${file}:${line} ${func}() - ${message}`);
}

// Register the callback - it will be automatically dispatched
await Gst.debug_add_log_function(onLog);
```

Compare this with the manual approach in `examples/log.js` - the TypeScript bindings handle all the boilerplate automatically!

## References
* [OpenAPI to TypeScript](https://heyapi.dev/openapi-ts/output)
* [GIRepository Docs](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
* [OpenAPI to FastApi](https://github.com/ioxiocom/openapi-to-fastapi/)

