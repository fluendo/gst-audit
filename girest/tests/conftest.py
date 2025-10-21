#!/usr/bin/env python3
"""
Pytest configuration and fixtures for GIRest tests.
"""

import sys
import os
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from girest.main import GIRest
from girest.generator import TypeScriptGenerator


@pytest.fixture
def gst_schema():
    """
    Generate OpenAPI schema for Gst namespace.
    
    Returns:
        dict: OpenAPI schema dictionary for Gst 1.0
    """
    girest = GIRest('Gst', '1.0')
    spec = girest.generate()
    return spec.to_dict()


@pytest.fixture
def gobject_schema():
    """
    Generate OpenAPI schema for GObject namespace.
    
    Returns:
        dict: OpenAPI schema dictionary for GObject 2.0
    """
    girest = GIRest('GObject', '2.0')
    spec = girest.generate()
    return spec.to_dict()


@pytest.fixture
def gst_typescript(gst_schema):
    """
    Generate TypeScript bindings for Gst namespace.
    
    Args:
        gst_schema: OpenAPI schema fixture for Gst namespace
        
    Returns:
        str: Generated TypeScript code
    """
    ts_gen = TypeScriptGenerator(gst_schema, host='localhost', port=9000)
    return ts_gen.generate()


@pytest.fixture
def gst_girest():
    """
    Create a GIRest instance for Gst namespace.
    
    Returns:
        GIRest: GIRest instance for Gst 1.0
    """
    return GIRest('Gst', '1.0')


@pytest.fixture
def gobject_girest():
    """
    Create a GIRest instance for GObject namespace.
    
    Returns:
        GIRest: GIRest instance for GObject 2.0
    """
    return GIRest('GObject', '2.0')
