import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { FloatPropertyEditor } from './FloatPropertyEditor';

// DoublePropertyEditor uses the same implementation as FloatPropertyEditor
export function DoublePropertyEditor(props: PropertyEditorProps) {
  return <FloatPropertyEditor {...props} />;
}
