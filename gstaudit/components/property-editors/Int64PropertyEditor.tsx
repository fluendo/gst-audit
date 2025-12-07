import { IntPropertyEditor } from './IntPropertyEditor';
import { PropertyEditorProps } from './types';

// Int64PropertyEditor uses the same implementation as IntPropertyEditor
// Note: JavaScript number can safely represent integers up to 2^53-1
// For true 64-bit support, we'd need BigInt, but for GStreamer properties this should be sufficient
export function Int64PropertyEditor(props: PropertyEditorProps) {
  return <IntPropertyEditor {...props} />;
}
