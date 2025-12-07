import { IntPropertyEditor } from './IntPropertyEditor';
import { PropertyEditorProps } from './types';

// LongPropertyEditor uses the same implementation as IntPropertyEditor
export function LongPropertyEditor(props: PropertyEditorProps) {
  return <IntPropertyEditor {...props} />;
}
