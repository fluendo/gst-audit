import { UIntPropertyEditor } from './UIntPropertyEditor';
import { PropertyEditorProps } from './types';

// CharPropertyEditor uses unsigned int validation (0-255)
export function CharPropertyEditor(props: PropertyEditorProps) {
  return <UIntPropertyEditor {...props} />;
}
