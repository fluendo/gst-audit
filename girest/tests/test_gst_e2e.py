#!/usr/bin/env python3
"""
End-to-end tests for GIRest Gst namespace endpoints.

These tests verify the REST API functionality by:
1. Starting a simple GStreamer pipeline (fakesrc ! fakesink)
2. Creating a server for the running pipeline
3. Making HTTP requests to test various endpoints
"""

import pytest
import subprocess
import time
import signal
import httpx
import asyncio
import os


@pytest.fixture(scope="module")
def gst_pipeline():
    """
    Start a GStreamer pipeline for testing.
    
    Launches 'gst-launch-1.0 fakesrc ! fakesink' as a background process
    and yields the PID for the test server to attach to.
    
    The pipeline runs continuously with fakesrc producing buffers at a slow rate
    to keep the process alive during testing.
    """
    # Start the pipeline with a slow rate to keep it running
    # The is-live=true and do-timestamp=true keep the pipeline running
    process = subprocess.Popen(
        [
            "gst-launch-1.0",
            "fakesrc",
            "is-live=true",
            "do-timestamp=true",
            "!",
            "fakesink",
            "sync=true"
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Give it a moment to start and enter PLAYING state
    time.sleep(3)
    
    # Verify it's running
    if process.poll() is not None:
        stdout, stderr = process.communicate()
        raise RuntimeError(f"GStreamer pipeline failed to start. stdout: {stdout.decode()}, stderr: {stderr.decode()}")
    
    yield process.pid
    
    # Cleanup: terminate the pipeline
    try:
        process.send_signal(signal.SIGTERM)
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()


@pytest.fixture(scope="module")
def girest_server(gst_pipeline):
    """
    Start the GIRest server attached to the GStreamer pipeline.
    
    Launches 'python girest-frida.py Gst 1.0 --pid <pid>' as a background process
    and yields the base URL for making test requests.
    """
    # Verify the pipeline is still running
    try:
        os.kill(gst_pipeline, 0)  # Check if process exists
    except OSError:
        raise RuntimeError(f"Pipeline process {gst_pipeline} is not running")
    
    # Get the path to girest-frida.py
    girest_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "girest-frida.py"
    )
    
    # Start the server
    process = subprocess.Popen(
        ["python3", girest_path, "Gst", "1.0", "--pid", str(gst_pipeline), "--port", "9000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Give the server time to start and attach to the process
    time.sleep(7)
    
    # Verify it's running
    if process.poll() is not None:
        stdout, stderr = process.communicate()
        raise RuntimeError(f"GIRest server failed to start. stdout: {stdout.decode()}, stderr: {stderr.decode()}")
    
    base_url = "http://localhost:9000"
    
    # Wait for the server to be ready by polling the docs endpoint
    ready = False
    max_retries = 15
    for i in range(max_retries):
        try:
            response = httpx.get(f"{base_url}/openapi.json", timeout=2)
            if response.status_code == 200:
                ready = True
                break
        except Exception as e:
            if i == max_retries - 1:  # Last attempt
                print(f"Failed to connect: {e}")
            pass
        time.sleep(1)
    
    if not ready:
        process.send_signal(signal.SIGTERM)
        stdout, stderr = process.communicate(timeout=5)
        raise RuntimeError(f"GIRest server did not become ready in time. stdout: {stdout.decode()}, stderr: {stderr.decode()}")
    
    yield base_url
    
    # Cleanup: terminate the server
    try:
        process.send_signal(signal.SIGTERM)
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()


@pytest.mark.asyncio
async def test_gst_version_string_endpoint(girest_server):
    """
    Test the /Gst/version_string endpoint which returns a string.
    
    This tests that non-void return values are properly returned in the HTTP response.
    The version_string endpoint should return the GStreamer version as a string.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version_string")
        
        # Check the response status
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains a 'return' field with a string value
        assert "return" in data, "Response should contain 'return' field"
        assert isinstance(data["return"], str), "Return value should be a string"
        assert len(data["return"]) > 0, "Version string should not be empty"
        
        # Version string should contain numbers and dots
        assert any(c.isdigit() for c in data["return"]), "Version should contain digits"


@pytest.mark.asyncio
async def test_gst_version_endpoint(girest_server):
    """
    Test the /Gst/version endpoint which returns output integer parameters.
    
    This tests that output parameters are properly returned in the HTTP response.
    The version endpoint should return major, minor, micro, and nano version numbers.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version")
        
        # Check the response status
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains the output parameters
        # Based on GStreamer documentation, version returns major, minor, micro, and nano
        assert "major" in data, "Response should contain 'major' field"
        assert "minor" in data, "Response should contain 'minor' field"
        assert "micro" in data, "Response should contain 'micro' field"
        assert "nano" in data, "Response should contain 'nano' field"
        
        # Check that all values are integers
        assert isinstance(data["major"], int), "major should be an integer"
        assert isinstance(data["minor"], int), "minor should be an integer"
        assert isinstance(data["micro"], int), "micro should be an integer"
        assert isinstance(data["nano"], int), "nano should be an integer"
        
        # Sanity check: major version should be reasonable (GStreamer 1.x or later)
        assert data["major"] >= 1, f"Unexpected major version: {data['major']}"
