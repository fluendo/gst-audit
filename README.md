# Gst-Audit
Gst-Audit is a way to audit your _running_ pipeline. It provides an HTTP interface to
interact with your live pipeline.

## Installation

## Running
`PID=1898951 fastapi dev gstaudit.py`

### Gst logs
`curl -N http://127.0.0.1:8000/logs`

## Ideas

* [x] HTTP Server to allow clients connect to a _running_ pipeline
* [x] SSE (Server Sent Event) for notifying events (like bus messages) to the client
* [x] HTTP REST API for manipulating the pipeline
* [x] Attach to a running program
* [x] Execute code natively, like property changes, etc
* [x] Generate the REST API dynamically through GIR
* [ ] Generate the JS API to wrap the REST API through GIR
