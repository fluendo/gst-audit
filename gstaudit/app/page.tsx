'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getConfig, updateConfig } from '@/lib/config';

export default function Home() {
  const config = getConfig();
  const [host, setHost] = useState(config.host);
  const [port, setPort] = useState(config.port.toString());

  const handleSave = () => {
    updateConfig({ host, port: parseInt(port) });
    alert('Configuration saved! API will now use: ' + getConfig().baseUrl);
  };

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">GstAudit</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A live way to audit your running GStreamer pipeline
        </p>
      </header>

      <main className="max-w-2xl">
        <section className="mb-8 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                placeholder="localhost"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                placeholder="9000"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Configuration
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current API URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{getConfig().baseUrl}</code>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>TypeScript bindings automatically generated from GStreamer introspection</li>
            <li>React Flow visualization for pipeline topology</li>
            <li>Live auditing of running GStreamer pipelines</li>
            <li>REST API for interacting with GStreamer elements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Start a GStreamer application (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">gst-launch-1.0 videotestsrc ! fakesink</code>)</li>
            <li>Get the PID of your GStreamer process</li>
            <li>Run the girest-frida server: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">python3 girest-frida.py Gst 1.0 --pid &lt;PID&gt;</code></li>
            <li>Configure the API settings above if needed</li>
            <li>
              <Link href="/pipeline" className="text-blue-600 hover:underline">
                View Pipeline →
              </Link>
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
