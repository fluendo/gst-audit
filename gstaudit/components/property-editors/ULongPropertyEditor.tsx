import { UIntPropertyEditor } from './UIntPropertyEditor';
import { PropertyEditorProps } from './types';

// ULongPropertyEditor uses the same implementation as UIntPropertyEditor
export function ULongPropertyEditor(props: PropertyEditorProps) {
  return <UIntPropertyEditor {...props} />;
}
