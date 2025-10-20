# GstAudit Web Application

A Next.js + TypeScript + React + React Flow application for auditing and visualizing GStreamer pipelines in real-time.

## Features

- **TypeScript Bindings**: Auto-generated TypeScript bindings from GStreamer introspection data
- **React Flow Visualization**: Interactive pipeline topology visualization
- **Live Auditing**: Real-time inspection of running GStreamer pipelines
- **REST API Integration**: Full integration with GIRest API for GStreamer control

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (for generating TypeScript bindings)
- A running GStreamer application to audit

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the GIRest Server

First, you need a running GStreamer application:

```bash
# Example: Start a simple GStreamer pipeline
gst-launch-1.0 videotestsrc ! fakesink
```

Get the PID of the GStreamer process and start the girest-frida server:

```bash
# From the repository root
cd girest
python3 girest-frida.py Gst 1.0 --pid <PID> --port 9000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Configure API Settings

On the home page, configure the host and port for the GIRest API server (defaults to `localhost:9000`).

### 5. View Pipeline

Navigate to the Pipeline page to visualize and interact with your GStreamer pipeline.

## Project Structure

```
gstaudit-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with configuration
│   └── pipeline/          # Pipeline visualization page
│       └── page.tsx
├── lib/                    # Library code
│   ├── config.ts          # API configuration management
│   └── gst.ts             # Generated TypeScript bindings for Gst 1.0
├── public/                 # Static assets
└── package.json           # Dependencies
```

## Regenerating TypeScript Bindings

The TypeScript bindings in `lib/gst.ts` are auto-generated from GStreamer introspection data. To regenerate them:

```bash
# From the repository root
cd girest
python3 girest-client-generator.py Gst 1.0 --host localhost --port 9000 -o ../gstaudit-app/lib/gst.ts
```

## Environment Variables

You can configure the default API settings using environment variables:

- `NEXT_PUBLIC_API_HOST` - Default API host (default: `localhost`)
- `NEXT_PUBLIC_API_PORT` - Default API port (default: `9000`)

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_HOST=localhost
NEXT_PUBLIC_API_PORT=9000
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Flow** - Interactive node-based diagrams
- **Tailwind CSS** - Utility-first CSS framework
- **GIRest** - GObject Introspection REST API

## Learn More

- [GstAudit Documentation](../README.md)
- [GIRest Client Generator](../girest/README-client-generator.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev/)

