# GIRest - REST API for GObject Introspection

`GIRest` uses [frida](https://frida.re) to attach to your program and then exposes the GObject-based APIs as
a REST API through [connexion](https://connexion.readthedocs.io/) and [apispec](https://apispec.readthedocs.io/)

## Features
GIRest provides a REST API to interact with your running application that matches introspection
information provided by the GObject's introspection system. The following features are supported:
* [x] Pointer types to pass either the integer representation of a native pointer or a string prefixed with `0x`
* [x] Return types are properly returned in the HTTP response
* [x] Output arguments are properly returned in the HTTP response
* [x] Enums are included in the schema to narrow the possibilites of the parameters
* [x] Callbacks are handled in a generic SSE endpoint
* [x] TypeScript bindings automatically dispatch callbacks via EventSource
* [ ] Callbacks are handled as an HTTP callback
* [ ] GError handling to return different HTTP response

### Swagger
The Connexion API provides a swagger UI at [http://127.0.0.1:9000/ui]()

## Use Case: Auditing GStreamer Pipelines

GIRest is particularly useful for auditing _running_ GStreamer pipelines.

### Running
To launch GIRest for GStreamer auditing, just do:
```bash
> python3 girest-frida.py --pid [PID] Gst 1.0
```
using the PID of the process you want to audit

### Example
First, you need to launch your pipeline, for example:

```bash
> gst-launch-1.0 videotestsrc ! fakesink
```

Then, get the `PID` of it and finally launch GIRest passing the `PID` by doing:

```bash
> python3 girest-frida.py --pid [PID] Gst 1.0
```

Finally, interact with the REST API, for example to pause it do:

```js
const getPipelines = async () => {
  const response = await fetch("http://localhost:9000/GIRest/pipelines");
  const json = await response.json();
  return json;
}

const pause = async(pipelineObj) => {
  const response = await fetch(`http://localhost:9000/Gst/Element/${pipelineObj.ptr}/set_state?state=3`);
}

async function main() {
  const pipelines = await getPipelines();
  for (p of pipelines) {
      console.log(`Pausing ${p.name} at ${p.ptr}`);
      pause(p);
  }
}

main();

```

## Installation

Install dependencies using poetry:

```bash
cd girest
poetry install
```

## Tools

### Schema Dumper

The `girest-dump-schema` tool generates OpenAPI schema in JSON format from GObject introspection data.

```bash
cd girest
python3 girest-dump-schema.py Gst 1.0 -o gst-schema.json
```

### TypeScript Client Generator

The `girest-client-generator` tool generates TypeScript client bindings from the GIRest schema. This allows you to have type-safe TypeScript code when working with the REST API. The tool requires a base URL for the REST API.

```bash
cd girest
python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:9000 -o gst.ts
```

See [design/README-client-generator.md](design/README-client-generator.md) for more details on the TypeScript client generator and [design/CALLBACK_IMPLEMENTATION.md](design/CALLBACK_IMPLEMENTATION.md) for callback support implementation details.

## Why XXX is not used?
### PyGObject
PyGObject is not used to know the introspection information of the desired namespace because it "hides" information, like
the functions to free a `struct` or the `unref` methods. Those are managed internally by the PyGObject code making it impossible to generate proper bindings. We use `GIRepository` through `PyGObject` tho.

### FastAPI
FastAPI is a great tool but it lacks a proper inheritance support of object types in the schema. Also, you can not easily
add schema metadata (required for the automatic TypeScript bindings) in fields, only on endpoints. There are workardounds
for the previous statement but it requires generating Pydantic models and extend them. Too much of a burden. We use `apispec` directly to generate a valid `openapi` schema.

## References
* [OpenAPI to TypeScript](https://heyapi.dev/openapi-ts/output)
* [GIRepository Docs](https://gnome.pages.gitlab.gnome.org/gobject-introspection/girepository/)
* [OpenAPI to FastApi](https://github.com/ioxiocom/openapi-to-fastapi/)
