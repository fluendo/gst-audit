/**
 * TypeScript example for GStreamer debug log callbacks
 * This demonstrates the callback support in TypeScript bindings
 * 
 * To use this example:
 * 1. Generate the TypeScript bindings:
 *    cd girest && python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts
 * 2. Import the Gst namespace from the generated file
 * 3. Run your GStreamer application with gst-audit
 * 4. Run this TypeScript file with Node.js
 */

// In a real application, you would import from the generated bindings:
// import { Gst, GstDebugCategory, GstDebugLevel, GObjectObject, GstDebugMessage } from './gst';

// For this example, we define the types manually
type GstDebugCategory = any;
type GstDebugLevel = any;
type GObjectObject = any;
type GstDebugMessage = any;

/**
 * Callback function for GStreamer debug logs
 * 
 * @param category - The debug category
 * @param level - The debug level
 * @param file - The source file name
 * @param func - The function name
 * @param line - The line number
 * @param obj - The GObject instance (may be null)
 * @param message - The debug message
 */
function onLog(
  category: GstDebugCategory,
  level: GstDebugLevel,
  file: string,
  func: string,
  line: number,
  obj: GObjectObject,
  message: GstDebugMessage
): void {
  console.log(`cat: ${category} level: ${level} file: ${file} func: ${func} line: ${line} obj: ${obj} msg: ${message}`);
}

/**
 * Register the callback with the GStreamer debug system
 * 
 * In the generated bindings, this would be called as:
 *   await Gst.debug_add_log_function(onLog);
 * 
 * The generated code will:
 * 1. Make a REST API call to /Gst/debug_add_log_function
 * 2. Receive a response with { func: <callback_id> }
 * 3. Register the callback in the callbackDispatcher map
 * 4. The EventSource listener will automatically receive callback events
 *    from /GIRest/callbacks and dispatch them to the registered function
 */
async function main() {
  // In a real application with generated bindings:
  // await Gst.debug_add_log_function(onLog);
  
  console.log('To use callbacks with TypeScript bindings:');
  console.log('1. Generate bindings: python3 girest-client-generator.py Gst 1.0 --base-url http://localhost:8000 -o gst.ts');
  console.log('2. Import: import { Gst } from "./gst";');
  console.log('3. Register: await Gst.debug_add_log_function(onLog);');
  console.log('4. Callbacks will be automatically dispatched when events arrive');
}

// Note: The examples/log.js shows the manual implementation
// With the generated TypeScript bindings, callback registration is automatic!

main();
