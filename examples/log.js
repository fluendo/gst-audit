/* Connects a callback for receiving the Gst debug logs
 * and changes a debug category and level
 * This proves the callback mechanism
 */
import { EventSource } from 'eventsource';

/* Our own callback dispatcher */
const cbsDispatcher = new Map();

function on_log(category, level, file, func, line, obj, msg)
{
  console.log(`cat: ${category} level: ${level} file: ${file} func: ${func} line: ${line} ${obj} ${msg}`);
}


/* Listen to the callbacks */
const cbsSource = new EventSource("http://localhost:8000/Application/callbacks");
cbsSource.onmessage = (ev) => {
  const json = JSON.parse(ev.data);
  var cb = cbsDispatcher.get(json.id.toString());
  if (cb) {
    cb(...Object.values(json.data));
  }
};

/* Register */
const addLogFunction = async () => {
  const response = await fetch("http://localhost:8000/Gst/debug_add_log_function");
  const json = await response.json();
  cbsDispatcher.set(json.func.toString(), on_log);
}

addLogFunction();
