# Gst-Audit
`Gst-Audit` is a siple and live way to audit your _running_ pipeline.

## Features
`Gst-Audit` uses [frida](https://frida.re) to attach to your program and then exposes the GStreamer API as
a REST API through [fastapi](https://fastapi.tiangolo.com/)

### REST API
Gst-Audit provides a REST API to interact with your running pipeline that matches introspection
information provided by the GObject's introspection system. The following features are supported:
* [x] Pointer types to pass either the integer representation of a native pointer or a string prefixed with `0x`
* [x] Return types are properly returned in the HTTP response
* [x] Output arguments are properly returned in the HTTP response
* [x] Enums are included in the schema to narrow the possibilites of the parameters
* [x] Callbacks are handled in a generic SSE endpoint
* [ ] Callbacks are handled as an HTTP callback
* [ ] GError handling to return different HTTP response

## Example
First, you need to launch your pipeline, for example:

```bash
> gst-launch-1.0 videotestsrc ! fakesink
```

Then, get the `PID` of it and finally launch `Gst-Audit` passing the `PID` by doing:

```bash
`PID=[PID] fastapi dev gstaudit/main.py`
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
