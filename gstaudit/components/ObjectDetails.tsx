import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { ElementTree } from '@/lib/ElementTreeManager';
import { 
  GstPadDirection, 
  GObjectParamSpec, 
  GObjectObjectClass, 
  GObjectValue,
} from '@/lib/gst';
import { useState, useEffect } from 'react';
import { PropertyEditorFactory, PropertyData, extractValueFromGValue, setValueInGValue } from './property-editors';

interface ObjectDetailsProps {
  selectedElement: ElementTree | null;
}

export function ObjectDetails({ selectedElement }: ObjectDetailsProps) {
  const [properties, setProperties] = useState<PropertyData[] | null>(null);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedElement) {
      setProperties(null);
      setPropertiesError(null);
      return;
    }

    const loadProperties = async () => {
      setLoadingProperties(true);
      setPropertiesError(null);
      try {
        // Get the GObjectTypeClass from the element
        const typeClass = await selectedElement.element.get_g_class();
        if (!typeClass) {
          throw new Error('Failed to get element class');
        }
        
        // Create a GObjectObjectClass instance from the pointer
        // This gives us access to the list_properties method
        const objectClass = new GObjectObjectClass(typeClass.ptr, 'none');
        const props = await objectClass.list_properties();
        
        // Fetch details for each property and get their current values
        const propsWithDetails = await Promise.all(
          props.map(async (prop): Promise<PropertyData> => {
            try {
              const name = await prop.get_name();
              const nick = await prop.get_nick();
              const blurb = await prop.get_blurb();
              
              // For now, assume all properties are readable and writable
              // In the future, we could check ParamSpec flags if available
              const isReadable = true;
              const isWritable = true;
              
              // Get the property value
              let value = '(error)';
              try {
                // Get the default value to determine the type
                const defaultValue = await prop.get_default_value();
                const valueType = await defaultValue.get_g_type();
                
                // Create and initialize a GValue with the correct type
                const gvalue = await GObjectValue.new();
                await gvalue.init(valueType);
                
                await selectedElement.element.get_property(name, gvalue);
                value = await extractValueFromGValue(gvalue, prop);
              } catch (error) {
                console.error(`Error getting value for property ${name}:`, error);
                value = `(read error)`;
              }
              
              return { 
                name, 
                nick, 
                blurb, 
                value, 
                paramSpec: prop,
                isReadable,
                isWritable
              };
            } catch (error) {
              console.error('Error fetching property details:', error);
              return { 
                name: 'unknown', 
                nick: 'unknown', 
                blurb: null, 
                value: '(error)',
                paramSpec: prop,
                isReadable: false,
                isWritable: false
              };
            }
          })
        );
        
        setProperties(propsWithDetails);
      } catch (error) {
        console.error('Error loading properties:', error);
        setPropertiesError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, [selectedElement]);

  // Handler for property changes
  const handlePropertyChange = async (propertyName: string, newValue: string) => {
    if (!selectedElement) return;

    try {
      // Find the property in our list
      const property = properties?.find(p => p.name === propertyName);
      if (!property) {
        throw new Error('Property not found');
      }

      // Get the type from the default value
      const defaultValue = await property.paramSpec.get_default_value();
      const valueType = await defaultValue.get_g_type();

      // Create and initialize a GValue with the correct type
      const gvalue = await GObjectValue.new();
      await gvalue.init(valueType);

      // Set the new value in the GValue
      await setValueInGValue(gvalue, property.paramSpec, newValue);

      // Update the property on the element
      await selectedElement.element.set_property(propertyName, gvalue);

      // Update the local state with the new value
      setProperties(prevProps => 
        prevProps?.map(p => 
          p.name === propertyName 
            ? { ...p, value: newValue }
            : p
        ) || null
      );
    } catch (error) {
      console.error('Error updating property:', error);
      throw error; // Re-throw so the editor can show the error
    }
  };

  if (!selectedElement) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Select an element to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Element Details
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Name
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            ID
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {selectedElement.id}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Level
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.level}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Children
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.children.length}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Pads
          </Typography>
          <Typography variant="body2">
            {selectedElement.pads.length} ({selectedElement.pads.filter(p => p.direction === GstPadDirection.SINK).length} sink, {selectedElement.pads.filter(p => p.direction === GstPadDirection.SRC).length} src)
          </Typography>
        </Box>
      </Paper>

      {selectedElement.pads.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pads
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedElement.pads.map((pad) => (
              <Box key={pad.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight="medium">
                  {pad.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Direction: {pad.direction === GstPadDirection.SINK ? 'Sink' : pad.direction === GstPadDirection.SRC ? 'Src' : 'Unknown'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Type: {pad.isGhost ? 'Ghost' : 'Regular'} {pad.isInternal ? '(Internal)' : ''}
                </Typography>
                {pad.linkedTo && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Linked: Yes
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Properties
        </Typography>
        {loadingProperties && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {propertiesError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Error loading properties: {propertiesError}
          </Typography>
        )}
        {!loadingProperties && !propertiesError && properties && properties.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {properties.map((prop, index) => (
              <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight="medium">
                  {prop.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {prop.nick}
                </Typography>
                {prop.blurb && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    {prop.blurb}
                  </Typography>
                )}
                <PropertyEditorFactory
                  property={prop}
                  element={selectedElement.element}
                  onPropertyChange={handlePropertyChange}
                  readOnly={!prop.isWritable}
                />
              </Box>
            ))}
          </Box>
        )}
        {!loadingProperties && !propertiesError && properties && properties.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No properties available
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
