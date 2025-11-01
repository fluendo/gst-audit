"""
Utility functions shared across GIRest modules.
"""


def parse_operation_id(operation_id):
    """Parse operation_id into namespace, class/struct name, method/field name, and optional operator.
    
    Args:
        operation_id: The operation ID string to parse (format: namespace-class-method or namespace-class-field-operator)
    
    Returns:
        tuple: (namespace, class_name, method_name, operator) or None if invalid format
        For standalone functions: (namespace, None, method_name, None)
        For methods: (namespace, class_name, method_name, None)
        For field operations: (namespace, class_name, field_name, operator)
        
        operator is 'get' or 'put' for field operations, None otherwise
    
    Examples:
        >>> parse_operation_id("Gst-Buffer-new")
        ('Gst', 'Buffer', 'new', None)
        
        >>> parse_operation_id("Gst-Buffer-pts-get")
        ('Gst', 'Buffer', 'pts', 'get')
        
        >>> parse_operation_id("Gst-Buffer-pts-put")
        ('Gst', 'Buffer', 'pts', 'put')
        
        >>> parse_operation_id("Gst--version")
        ('Gst', None, 'version', None)
        
        >>> parse_operation_id("invalid")
        None
    """
    if not operation_id:
        return None
    
    parts = operation_id.split('-')
    if len(parts) < 2:
        return None
    
    if len(parts) == 4:
        # Field operation: namespace-class-field-operator
        class_name = parts[1] if parts[1] else None
        return (parts[0], class_name, parts[2], parts[3])
    
    if len(parts) == 3:
        # Method: namespace-class-method
        class_name = parts[1] if parts[1] else None
        return (parts[0], class_name, parts[2], None)
    
    if len(parts) == 2:
        # Standalone function: namespace-function
        return (parts[0], None, parts[1], None)
    
    return None
