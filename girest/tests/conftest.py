#!/usr/bin/env python3
"""
Pytest configuration and fixtures for GIRest tests.
"""

import os
import shutil
import sys
import tempfile

import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from girest.generator import TypeScriptGenerator
from girest.main import GIRest


@pytest.fixture(scope="session")
def gst_schema():
    """
    Generate OpenAPI schema for Gst namespace.

    Session-scoped for performance - schema generation is expensive and the schema
    is not modified by any tests.

    Returns:
        dict: OpenAPI schema dictionary for Gst 1.0
    """
    girest = GIRest("Gst", "1.0")
    spec = girest.generate()
    return spec.to_dict()


@pytest.fixture(scope="session")
def gobject_schema():
    """
    Generate OpenAPI schema for GObject namespace.

    Session-scoped for performance - schema generation is expensive and the schema
    is not modified by any tests.

    Returns:
        dict: OpenAPI schema dictionary for GObject 2.0
    """
    girest = GIRest("GObject", "2.0")
    spec = girest.generate()
    return spec.to_dict()


@pytest.fixture(scope="session")
def session_tmp_dir():
    """
    Create a temporary directory that lasts for the entire test session.

    Returns:
        str: Path to temporary directory
    """
    tmp_dir = tempfile.mkdtemp()
    yield tmp_dir
    shutil.rmtree(tmp_dir, ignore_errors=True)


@pytest.fixture(scope="session")
def gst_typescript(gst_schema, session_tmp_dir):
    """
    Generate TypeScript bindings for Gst namespace.

    Session-scoped for performance - TypeScript generation is expensive and the
    generated code is not modified by any tests.

    Args:
        gst_schema: OpenAPI schema fixture for Gst namespace
        session_tmp_dir: Session-scoped temporary directory

    Returns:
        Dict[str, str]: Dictionary mapping file paths to generated TypeScript code
    """
    ts_gen = TypeScriptGenerator(gst_schema, host="localhost", port=9000)
    return ts_gen.generate(session_tmp_dir)


def find_class_in_files(files_dict: dict, class_name: str) -> str:
    """
    Helper function to find a class definition in the generated TypeScript files.

    Args:
        files_dict: Dictionary mapping file paths to TypeScript content
        class_name: Name of the class to find

    Returns:
        The content of the file containing the class, or empty string if not found
    """
    # First try to find exact match by filename
    for file_path, content in files_dict.items():
        # Check if the file is named exactly as the class (e.g., /path/Gst/GstPipeline.ts)
        if file_path.endswith(f"/{class_name}.ts"):
            return content

    # Fallback: search by class declaration
    for file_path, content in files_dict.items():
        # Look for exact class name (not as part of another name)
        if f"export class {class_name} " in content or f"export interface {class_name} " in content:
            # Make sure it's not GstPipelineClass when looking for GstPipeline
            # Check that it's followed by { or extends, not more letters
            import re

            pattern = rf"export (?:class|interface) {re.escape(class_name)}[\s{{]"
            if re.search(pattern, content):
                return content
    return ""


@pytest.fixture
def gst_girest():
    """
    Create a GIRest instance for Gst namespace.

    Returns:
        GIRest: GIRest instance for Gst 1.0
    """
    return GIRest("Gst", "1.0")


@pytest.fixture
def gobject_girest():
    """
    Create a GIRest instance for GObject namespace.

    Returns:
        GIRest: GIRest instance for GObject 2.0
    """
    return GIRest("GObject", "2.0")
