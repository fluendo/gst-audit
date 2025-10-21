"""
Utility functions shared across GIRest modules.
"""


def parse_operation_id(operation_id):
    """Parse operation_id into namespace, class/struct name, and method name.
    
    Args:
        operation_id: The operation ID string to parse (format: namespace-class-method)
    
    Returns:
        tuple: (namespace, class_name, method_name) or None if invalid format
        For standalone functions: (namespace, None, method_name)
    
    Examples:
        >>> parse_operation_id("Gst-Buffer-new")
        ('Gst', 'Buffer', 'new')
        
        >>> parse_operation_id("Gst--version")
        ('Gst', None, 'version')
        
        >>> parse_operation_id("invalid")
        None
    """
    if not operation_id:
        return None
    
    parts = operation_id.split('-')
    if len(parts) < 2:
        return None
    
    if len(parts) == 3:
        return (parts[0], parts[1], parts[2])
    
    if len(parts) == 2:
        return (parts[0], None, parts[1])
    
    return None
