# Gst-Audit

This project consists of two main components:

## [GIRest](girest/)

**GIRest** provides REST bindings for GObject Introspection. It uses [frida](https://frida.re) to attach to your program and exposes GObject-based APIs as a REST API through [fastapi](https://fastapi.tiangolo.com/). This can be used to audit GStreamer pipelines and interact with any GObject-based library at runtime.

See [girest/README.md](girest/README.md) for more details.

## [GstAudit](gstaudit/)

**GstAudit** (deprecated) was the original tool for auditing GStreamer pipelines. This implementation has been superseded by GIRest.


