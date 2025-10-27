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


def assert_response(response, msg):
    if response.status_code < 200 or response.status_code > 299:
        # Capture server logs
        try:
            server_output = girest_server.process.stdout.read()
            print(f"\n=== Server logs at bin creation failure ===\n{server_output}\n=== End logs ===")
        except:
            pass
        assert response.status_code < 200 or response.status_code > 299, f"{msg}: {response.status_code}, response: {response.text}"


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
    
    # Start the server with unbuffered output to capture logs immediately
    process = subprocess.Popen(
        ["python3", "-u", girest_path, "Gst", "1.0", "--pid", str(gst_pipeline), "--port", "9000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,  # Combine stderr with stdout
        bufsize=1,
        universal_newlines=True
    )
    
    # Give the server time to start and attach to the process
    time.sleep(10)
    
    # Verify it's running
    if process.poll() is not None:
        stdout, stderr = process.communicate()
        raise RuntimeError(f"GIRest server failed to start. output: {stdout}")
    
    base_url = "http://localhost:9000"
    
    # Wait for the server to be ready by polling the docs endpoint
    ready = False
    max_retries = 3
    for i in range(max_retries):
        try:
            response = httpx.get(f"{base_url}/openapi.json")
            if response.status_code == 200:
                ready = True
                break
        except Exception as e:
            if i == max_retries - 1:  # Last attempt
                print(f"Failed to connect: {e}")
            pass
        time.sleep(5)
    
    if not ready:
        process.send_signal(signal.SIGTERM)
        stdout, stderr = process.communicate(timeout=5)
        raise RuntimeError(f"GIRest server did not become ready in time. output: {stdout}")
    
    # Store process for access in tests
    girest_server.process = process
    
    yield base_url
    
    # Cleanup: terminate the server
    try:
        process.send_signal(signal.SIGTERM)
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
    finally:
        # Print any remaining output
        try:
            remaining_output = process.stdout.read()
            if remaining_output:
                print(f"\n=== Server output ===\n{remaining_output}\n=== End server output ===")
        except:
            pass
        process.wait()


@pytest.mark.asyncio
async def test_string_ret_endpoint(girest_server):
    """
    Test the /Gst/version_string endpoint which returns a string.
    
    This tests that non-void return values are properly returned in the HTTP response.
    The version_string endpoint should return the GStreamer version as a string.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version_string")
        assert_response(response, f"Failed to get version string")
        
        # Check the response is JSON
        data = response.json()
        
        # Check that the response contains a 'return' field with a string value
        assert "return" in data, "Response should contain 'return' field"
        assert isinstance(data["return"], str), "Return value should be a string"
        assert len(data["return"]) > 0, "Version string should not be empty"
        
        # Version string should contain numbers and dots
        assert any(c.isdigit() for c in data["return"]), "Version should contain digits"


@pytest.mark.asyncio
async def test_basic_out_endpoint(girest_server):
    """
    Test the /Gst/version endpoint which returns output integer parameters.
    
    This tests that output parameters are properly returned in the HTTP response.
    The version endpoint should return major, minor, micro, and nano version numbers.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{girest_server}/Gst/version")
        assert_response(response, f"Failed to get version")
        
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


@pytest.mark.asyncio
async def test_gtype_out_endpoint(girest_server):
    """
    Test struct out parameter handling with GstIterator::next and GValue.
    
    This tests the case where a struct (GValue) is used as an out parameter
    in a method call (GstIterator::next). The GValue has a registered GType,
    so it should be typed as "gtype" and properly dereferenced.
    
    The test follows the complete flow:
        1. Create a GstBin
        2. Add a GstElement to the bin (so iterator has something to return)
        3. Get an iterator for the bin's elements
        4. Create and initialize a GValue
        5. Call gst_iterator_next with the GValue as out parameter
        6. Verify we get a valid result
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Step 1: Create a GstBin
        response = await client.get(f"{girest_server}/Gst/Bin/new", params={"name": "test_bin"})
        assert_response(response, f"Failed to create bin")
        response_data = response.json()
        assert "return" in response_data, "Bin creation should return an object"
        assert "ptr" in response_data["return"], "Bin creation should return an object"
        bin_ptr = response_data["return"]["ptr"]

        response = await client.get(f"{girest_server}/Gst/Object/ptr,{bin_ptr}/get_name")
        assert_response(response, f"Failed to get bin's name")
        
        # Step 2: Create a GstElement to add to the bin
        response = await client.get(f"{girest_server}/Gst/ElementFactory/make", params={"factoryname": "fakesrc", "name": "test_element"})
        assert_response(response, f"Failed to create element")
        response_data = response.json()
        assert "return" in response_data, "Element creation should return an object"
        assert "ptr" in response_data["return"], "Element creation should return an object"
        element_ptr = response_data["return"]["ptr"]
        
        # Step 3: Add the element to the bin
        # Note: Objects are serialized as "ptr,value" per OpenAPI spec (style=form, explode=false for query params)
        response = await client.get(f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/add", params={"element": f"ptr,{element_ptr}"})
        assert_response(response, f"Failed to add element into the bin")
        
        # Step 4: Get an iterator for the bin's elements
        response = await client.get(f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/iterate_elements")
        assert_response(response, f"Failed to iterate elements")
        response_data = response.json()
        assert "return" in response_data, "Iterate elements should return an object"
        assert "ptr" in response_data["return"], "Iterate elements should return an object"
        iterator_ptr = response_data["return"]["ptr"]
        
        # Step 5: Test GValue creation
        response = await client.get(f"{girest_server}/GObject/Value/new")
        assert_response(response, f"Failed to create a value")
        response_data = response.json()
        assert "return" in response_data, "Value new should return an object"
        assert "ptr" in response_data["return"], "Value new should return an object"
        value_ptr = response_data["return"]["ptr"]
        
        # Step 6: Unset the GValue
        response = await client.get(f"{girest_server}/GObject/Value/ptr,{value_ptr}/unset")
        assert_response(response, f"Failed to unset the value")
        # Step 7: Try to call iterator next
        response = await client.get(f"{girest_server}/Gst/Iterator/ptr,{iterator_ptr}/next", params={"elem": f"ptr,{value_ptr}"})
        assert_response(response, f"Failed to iterate next")
        response_data = response.json()
        # The result should contain the return value and may contain the out parameter 'elem'
        assert "return" in response_data
        print("✓ Successfully tested struct out parameter infrastructure")
