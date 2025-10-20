# Gst-Audit

A Next.js + TypeScript + React + React Flow application for auditing and visualizing GStreamer pipelines in real-time.

## Features

- **TypeScript Bindings**: Auto-generated TypeScript bindings from GStreamer introspection data
- **React Flow Visualization**: Interactive pipeline topology visualization
- **Live Auditing**: Real-time inspection of running GStreamer pipelines
- **REST API Integration**: Full integration with GIRest API for GStreamer control

## Components

This project consists of two main components:

### [GstAudit Web Application](gstaudit/)

The main web application for visualizing and interacting with GStreamer pipelines. Built with Next.js, TypeScript, React, and React Flow.

See [gstaudit/README.md](gstaudit/README.md) for detailed documentation.

### [GIRest](girest/)

**GIRest** provides REST bindings for GObject Introspection. It uses [frida](https://frida.re) to attach to your program and exposes GObject-based APIs as a REST API. This powers the backend for the GstAudit web application.

See [girest/README.md](girest/README.md) for more details.


