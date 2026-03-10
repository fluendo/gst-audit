# GstAudit Server Application
Expose a REST API for a running pipeline

## Operation Modes

The GstAudit server supports three operation modes using subcommands:

### Common Options

These options are available for all modes:

- `--host`: Host to bind the server to (default: `localhost`)
- `--port`: Port to run the server on (default: `9000`)

### 1. Connect Mode - Attach to Existing Process

Connect to an already running GStreamer process by PID.

**Syntax:**
```bash
poetry run python -m gstaudit_server.app connect <PID> [--host HOST] [--port PORT]
```

**Example:**
```bash
# First, start a GStreamer application in another terminal
gst-launch-1.0 videotestsrc ! autovideosink

# Get the PID and connect to it (default port 9000)
poetry run python -m gstaudit_server.app connect 12345

# Connect with custom port
poetry run python -m gstaudit_server.app connect 12345 --port 8080
```

### 2. Create Mode - New Empty Process

Create a new GStreamer process for manual pipeline creation via the REST API.

**Syntax:**
```bash
poetry run python -m gstaudit_server.app create [--host HOST] [--port PORT]
```

**Example:**
```bash
# Create a new process on default port
poetry run python -m gstaudit_server.app create

# Create a new process on custom port
poetry run python -m gstaudit_server.app create --port 8080
```

This mode spawns a minimal GStreamer process that you can attach to and create pipelines dynamically through the REST API.

### 3. Launch Mode - Launch Pipeline from Command Line

Launch a GStreamer pipeline using gst-launch-1.0 syntax.

**Syntax:**
```bash
poetry run python -m gstaudit_server.app launch "<PIPELINE>" [--host HOST] [--port PORT]
```

**Example:**
```bash
# Launch a simple test pipeline
poetry run python -m gstaudit_server.app launch "videotestsrc ! autovideosink"

# Launch a pipeline with custom port
poetry run python -m gstaudit_server.app launch "videotestsrc ! autovideosink" --port 8080

# Launch an audio playback pipeline
poetry run python -m gstaudit_server.app launch "filesrc location=song.mp3 ! decodebin ! audioconvert ! autoaudiosink"
```

## Getting Help

Get help for the main command:
```bash
poetry run python -m gstaudit_server.app --help
```

Get help for a specific mode:
```bash
poetry run python -m gstaudit_server.app connect --help
poetry run python -m gstaudit_server.app create --help
poetry run python -m gstaudit_server.app launch --help
```

## Swagger
The server exposes two Swaggers, one for the standard `girest` bindings at http://localhost:9000/girest/ui/ and another for the `gst-audit` specific endpoints at http://localhost:9000/gstaudit/ui/
