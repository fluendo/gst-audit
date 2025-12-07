import { UIntPropertyEditor } from './UIntPropertyEditor';
import { PropertyEditorProps } from './types';

// UInt64PropertyEditor uses the same implementation as UIntPropertyEditor
// Note: JavaScript number can safely represent integers up to 2^53-1
export function UInt64PropertyEditor(props: PropertyEditorProps) {
  return <UIntPropertyEditor {...props} />;
}
