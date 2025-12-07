import { UIntPropertyEditor } from './UIntPropertyEditor';
import { PropertyEditorProps } from './types';

// UCharPropertyEditor uses unsigned int validation (0-255)
export function UCharPropertyEditor(props: PropertyEditorProps) {
  return <UIntPropertyEditor {...props} />;
}
