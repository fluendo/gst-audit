#!/usr/bin/env python3
"""
Tests for TypeScript client generator parameter serialization.

These tests verify that the TypeScript generator properly handles object
parameters in path and query strings according to OpenAPI style/explode settings.
"""

import re


def test_path_parameter_object_serialization(gst_typescript):
    """
    Test that path parameters with object schemas use proper serialization.
    
    Path parameters with object types should use serializeParam() function
    to serialize objects according to style/explode settings.
    """
    typescript = gst_typescript
    
    # Find a method with object in path parameter (e.g., GLibDate.days_between)
    # This method has 'self' as path parameter and 'date2' as query parameter
    match = re.search(
        r'async days_between\(date2: GLibDate\): Promise<number> \{',
        typescript
    )
    
    assert match, "days_between method not found in generated TypeScript"
    
    # Get the position and extract method body (approximately)
    start_pos = match.start()
    # Find the method in context
    method_section = typescript[start_pos:start_pos + 500]
    
    # Check that the path uses serializeParam for 'this' (self parameter)
    assert 'serializeParam(this, \'simple\', false)' in method_section, \
        "Path parameter 'self' should use serializeParam with style='simple', explode=false"
    
    # Check that query parameter uses serializeParam for 'date2'
    assert 'serializeParam(date2, \'form\', false)' in method_section, \
        "Query parameter 'date2' should use serializeParam with style='form', explode=false"


def test_query_parameter_object_serialization(gst_typescript):
    """
    Test that query parameters with object schemas use proper serialization.
    
    Query parameters with object types should use serializeParam() function
    with appropriate style/explode settings.
    """
    typescript = gst_typescript
    
    # Look for methods with object query parameters
    # Most object parameters in query use style='form', explode=false
    
    # Find GObjectValue.copy which has dest_value as object query parameter
    match = re.search(
        r'async copy\(dest_value: GObjectValue\): Promise<void> \{',
        typescript
    )
    
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos:start_pos + 500]
        
        # Check that query parameter uses serializeParam
        assert 'serializeParam(dest_value,' in method_section, \
            "Query parameter 'dest_value' should use serializeParam"


def test_serializeParam_function_exists(gst_typescript):
    """
    Test that the serializeParam helper function is generated.
    
    The TypeScript output should include a serializeParam function that
    handles object serialization according to OpenAPI style/explode.
    """
    typescript = gst_typescript
    
    # Check for function definition
    assert 'function serializeParam(' in typescript, \
        "serializeParam function should be defined"
    
    # Check that it handles the 'ptr' property
    assert "'ptr' in value" in typescript or '"ptr" in value' in typescript, \
        "serializeParam should check for 'ptr' property"
    
    # Check that it handles style parameter
    assert "style === 'simple' || style === 'form'" in typescript or \
           'style === "simple" || style === "form"' in typescript, \
        "serializeParam should handle 'simple' and 'form' styles"
    
    # Check that it handles explode parameter
    assert 'explode' in typescript, \
        "serializeParam should handle explode parameter"


def test_primitive_parameters_not_serialized(gst_typescript):
    """
    Test that primitive parameters still use String() conversion.
    
    Non-object parameters should continue to use String() for conversion,
    not serializeParam.
    """
    typescript = gst_typescript
    
    # Find a method with primitive query parameters
    # For example, GLibDate.set_day has 'day' as number parameter
    match = re.search(
        r'async set_day\(day: number\): Promise<void> \{',
        typescript
    )
    
    if match:
        start_pos = match.start()
        method_section = typescript[start_pos:start_pos + 500]
        
        # Primitive parameters should use String(), not serializeParam
        assert 'String(day)' in method_section, \
            "Primitive parameter 'day' should use String() conversion"
        assert 'serializeParam(day,' not in method_section, \
            "Primitive parameter 'day' should not use serializeParam"


def test_baseurl_parameter_respected(gst_typescript):
    """
    Test that the baseUrl parameter is properly used in URL construction.
    
    All fetch calls should use apiConfig.baseUrl which respects the
    host and port parameters passed to the generator.
    """
    typescript = gst_typescript
    
    # Check that apiConfig is defined
    assert 'apiConfig' in typescript, \
        "apiConfig should be defined"
    
    # Check that baseUrl is a getter that combines host and port
    assert 'get baseUrl()' in typescript, \
        "apiConfig should have a baseUrl getter"
    
    # Check that URLs are constructed using apiConfig.baseUrl
    assert 'new URL(' in typescript and 'apiConfig.baseUrl' in typescript, \
        "URLs should be constructed using apiConfig.baseUrl"
    
    # Check that setApiConfig allows updating the configuration
    assert 'function setApiConfig(' in typescript or 'export function setApiConfig(' in typescript, \
        "setApiConfig function should be exported"


def test_object_serialization_formats(gst_typescript):
    """
    Test that the serializeParam function generates correct formats.
    
    Verifies the format strings in the generated serializeParam function
    match the OpenAPI spec requirements.
    """
    typescript = gst_typescript
    
    # Find the serializeParam function
    match = re.search(
        r'function serializeParam\([^)]+\)[^{]*\{(.*?)\n\}',
        typescript,
        re.DOTALL
    )
    
    assert match, "serializeParam function not found"
    
    function_body = match.group(1)
    
    # Check for explode=false format: ptr,value
    assert 'ptr,${value.ptr}' in function_body or 'ptr,' in function_body, \
        "serializeParam should generate 'ptr,value' format for explode=false"
    
    # Check for explode=true format: ptr=value
    assert 'ptr=${value.ptr}' in function_body or 'ptr=' in function_body, \
        "serializeParam should generate 'ptr=value' format for explode=true"
