# GstAudit Server Application
Expose a REST API for a running pipeline

## Running
First, you need a running GStreamer application:

```bash
# Example: Start a simple GStreamer pipeline
gst-launch-1.0 videotestsrc ! fakesink
```

Get the PID of the GStreamer process and start the girest-frida server:

```bash
# From the repository root
cd gstaudit-server
poetry run python gstaudit_server/app.py --pid <PID>
```
## Swagger
The server exposes two Swaggers, one for the standard `girest` bindings at http://localhost:9000/girest/ui/ and another for the `gst-audit` specific endpoints at http://localhost:9000/gstaudit/ui/
