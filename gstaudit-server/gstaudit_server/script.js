var gst_pipeline_get_type;
var g_type_children;
var gst_pipeline_new;

function findGTypeClass(address)
{
    console.debug(`Looking for a GTypeClass pointing to ${address}`);
    const gtypeclasses = [];
    Process.enumerateRanges("rw-").some(range => {
        try {
            const results = Memory.scanSync(range.base, range.size, address.toMatchPattern());
            for (let i = 0; i < results.length; i++) {
                const r = results[i];
                console.debug(`GTypeClass found at ${r.address} with size ${r.size}`);
                let gtcp = r.address;
                gtypeclasses.push(gtcp);
            }
        } catch (error) {
            console.debug(`Skipping access violation accessing memory`);
        }
        return false;
    });
    return gtypeclasses;
}

function findMemoryForGType(gtype)
{
    console.debug(`Looking for GType ${gtype}`);
    const gtypes = [];
    /* Find all places where the GType is referenced */
    const ranges = Process.enumerateRanges("rw-");
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        try {
            const results = Memory.scanSync(range.base, range.size, gtype.toMatchPattern());
            if (results.length)
                console.debug(`Range ${range.base} ${range.size}:`);
            for (let j = 0; j < results.length; j++) {
                const r = results[j];
                console.debug(`GType found at ${r.address} with size ${r.size}`);
                let gtp = r.address;
                gtypes.push(gtp);
            }
        } catch (error) {
            console.debug(`Skipping access violation accessing memory`);
        }
    }
    return gtypes;
}

function validateIsPipeline(mem)
{
    findGTypeClass(mem).forEach(gtypeclass => {
        console.debug(`Looking for a pipeline at ${gtypeclass}`);
        /* Check that we have a valid name to validate it */
        try {
            /* Get the target state is in 0-4 range at GstPipeline->GstElement->target_state (0x20) */
            let target_state = gtypeclass.add(0x78).readU32();
            if (target_state < 0 || target_state > 3)
                return;
            /* Get the name at GstPipeline->GstElement->GstObject->name (0x20) */
            let namep = gtypeclass.add(0x20).readPointer();
            let name = namep.readCString();
            /* Check it is an ASCII string */
            if (!name)
                return;
            if (!/^[\x00-\x7F]*$/.test(name))
                return;
            console.info(`Pipeline found with name '${name}'`);
            /* Send a message to notify the Python side */
            send({
                "kind": "pipeline",
                "data": {"ptr": gtypeclass.toString(), "name": name}
            });
        } catch (error) {
          console.debug(`Pipeline not found at ${gtypeclass} [${error}]`);
        }
    });
}

function findInstanceOfType(pt)
{
    console.debug(`Finding instances for ${pt}`);
    let pm = ptr(pt.toString());
    let gtypes = findMemoryForGType(pm);
    gtypes.forEach(gtype => {
        validateIsPipeline(gtype);
    });
    findInstanceOfChildrenTypes(pt);
}

function findInstanceOfChildrenTypes(type)
{
    console.debug(`Finding children types for ${type}`);
    Process.enumerateModules().some(m => {
        let symb = m.findExportByName('g_type_children');
        if (symb == null)
            return false;
        let n_children_ptr = Memory.alloc(Process.pointerSize);
        g_type_children = new NativeFunction(symb, 'pointer', ['size_t', 'pointer']);
        let children = g_type_children(type, n_children_ptr);
        let n_children = n_children_ptr.readU32();
        console.debug(`Found ${n_children} types inheriting from ${type}`);
        for (let i = 0; i < n_children; i++) {
            let pt = children.add(i*Process.pointerSize).readU64();
            findInstanceOfType(pt);
        }
			  return true;
    });
}

/*
 * We need to get the pointer for every GstPipeline
 * We can do this by:
 * - Inspecting the GST_DEBUG log afterwards
 * - Look for every potential call to `gst_pipeline_new`
 * - Look for every class init function to catch the pipeline creation
 * - Inspect the memory? if the object is already created
 *   Maybe the memory associated with a GstPipeline GType has a special
 *   memory pattern and size. Like getting the GType pointer with `gst_pipeline_get_type`
 *   looking for it, etc
 */
function findRunningPipelines()
{
    console.info("Finding running pipelines");
    /* Get the GType for a GstPipeline */
    Process.enumerateModules().some(m => {
        /* Scan for a GstPipeline */
        let symb = m.findExportByName('gst_pipeline_get_type');
        if (symb == null)
            return false;
        gst_pipeline_get_type = new NativeFunction(symb, 'size_t', []);
        symb = m.findExportByName('gst_pipeline_new');
        if (symb == null)
            return false;
        gst_pipeline_new = new NativeFunction(symb, 'pointer', []);

        let pt = gst_pipeline_get_type();
        findInstanceOfType(pt);
        return true;
    });
    /* TODO Register the callback whenever a new GstPipeline is created */
}

function init()
{
  console.log("Init");
  
  // Load GstVideo library to make gst_video_* functions available
  try {
    Module.load("libgstvideo-1.0.so.0");
    console.log("Loaded libgstvideo-1.0.so.0");
  } catch (e) {
    console.warn("Failed to load libgstvideo-1.0.so.0:", e);
  }
  
  findRunningPipelines();
  console.log("Init done");
}

function shutdown()
{
  console.log("Shutdown");
  console.log("Shutdown done");
}

rpc.exports = {
  'init': init,
  'shutdown': shutdown,
  'registerLogFunction': register_log_function,
  'unregisterLogFunction': unregister_log_function,
};

// ============================================================================
// Logging Support
// ============================================================================

let logFunctionId = null;
let startTime = null;

function register_log_function() {
  if (logFunctionId !== null) {
    console.log("Log function already registered");
    return { success: true, alreadyRegistered: true };
  }

  console.log("Registering log function");
  
  // Find required GStreamer functions
  let gst_debug_add_log_function = null;
  let gst_debug_remove_log_function_by_data = null;
  let gst_util_get_timestamp = null;
  let gst_debug_category_get_name = null;
  let gst_debug_level_get_name = null;
  let gst_object_get_name = null;
  let gst_debug_message_get = null;
  
  Process.enumerateModules().some(m => {
    gst_debug_add_log_function = m.findExportByName('gst_debug_add_log_function');
    gst_debug_remove_log_function_by_data = m.findExportByName('gst_debug_remove_log_function_by_data');
    gst_util_get_timestamp = m.findExportByName('gst_util_get_timestamp');
    gst_debug_category_get_name = m.findExportByName('gst_debug_category_get_name');
    gst_debug_level_get_name = m.findExportByName('gst_debug_level_get_name');
    gst_object_get_name = m.findExportByName('gst_object_get_name');
    gst_debug_message_get = m.findExportByName('gst_debug_message_get');
    
    if (gst_debug_add_log_function && gst_debug_remove_log_function_by_data &&
        gst_util_get_timestamp && gst_debug_category_get_name &&
        gst_debug_level_get_name && gst_object_get_name && gst_debug_message_get) {
      return true;
    }
    return false;
  });
  
  if (!gst_debug_add_log_function) {
    console.error("Could not find required GStreamer functions");
    return { success: false, error: "GStreamer functions not found" };
  }
  
  // Capture start time (like gst_init does)
  const get_timestamp = new NativeFunction(gst_util_get_timestamp, 'uint64', []);
  startTime = get_timestamp();
  console.log(`Log start time: ${startTime}`);
  
  // Create native functions
  const add_log_function = new NativeFunction(gst_debug_add_log_function, 'void', ['pointer', 'pointer']);
  const remove_log_function = new NativeFunction(gst_debug_remove_log_function_by_data, 'uint', ['pointer']);
  const category_get_name = new NativeFunction(gst_debug_category_get_name, 'pointer', ['pointer']);
  const level_get_name = new NativeFunction(gst_debug_level_get_name, 'pointer', ['int']);
  const object_get_name = new NativeFunction(gst_object_get_name, 'pointer', ['pointer']);
  const message_get = new NativeFunction(gst_debug_message_get, 'pointer', ['pointer']);
  
  // Create the log callback
  // GstLogFunction signature: void (*GstLogFunction)(GstDebugCategory *category, GstDebugLevel level,
  //                                                   const gchar *file, const gchar *function,
  //                                                   gint line, GObject *object,
  //                                                   GstDebugMessage *message, gpointer user_data)
  const logCallback = new NativeCallback(function(category, level, file, func, line, object, message, userData) {
    try {
      // Get current timestamp and calculate diff
      const now = get_timestamp();
      const timestamp = now - startTime;
      
      // Extract category name
      const categoryNamePtr = category_get_name(category);
      const categoryName = categoryNamePtr.readCString();
      
      // Extract level name and normalize it
      // GStreamer returns padded uppercase strings like "DEBUG  ", "ERROR  "
      // Normalize to lowercase trimmed to match GstDebugLevelValue type
      const levelNamePtr = level_get_name(level);
      const levelName = levelNamePtr.readCString().trim().toLowerCase();
      
      // Extract file, function
      const fileName = file.readCString();
      const functionName = func.readCString();
      
      // Extract object name (may be NULL)
      let objectName = null;
      if (!object.isNull()) {
        const objectNamePtr = object_get_name(object);
        if (!objectNamePtr.isNull()) {
          objectName = objectNamePtr.readCString();
        }
      }
      
      // Extract message
      const messagePtr = message_get(message);
      const messageText = messagePtr.readCString();
      
      // Send to Python
      send({
        kind: 'log',
        data: {
          timestamp: timestamp.toString(),
          category: categoryName,
          level: levelName,
          file: fileName,
          function: functionName,
          line: line,
          object: objectName,
          message: messageText
        }
      });
    } catch (error) {
      console.error(`Error in log callback: ${error}`);
    }
  }, 'void', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'pointer']);
  
  // Register with GStreamer
  add_log_function(logCallback, ptr(0));
  logFunctionId = logCallback;
  
  console.log("Log function registered successfully");
  return { success: true };
}

function unregister_log_function() {
  if (logFunctionId === null) {
    console.log("No log function to unregister");
    return { success: true, notRegistered: true };
  }
  
  console.log("Unregistering log function");
  
  // Find the remove function
  let gst_debug_remove_log_function_by_data = null;
  Process.enumerateModules().some(m => {
    gst_debug_remove_log_function_by_data = m.findExportByName('gst_debug_remove_log_function_by_data');
    return gst_debug_remove_log_function_by_data !== null;
  });
  
  if (gst_debug_remove_log_function_by_data) {
    const remove_log_function = new NativeFunction(gst_debug_remove_log_function_by_data, 'uint', ['pointer']);
    const removed = remove_log_function(ptr(0));
    console.log(`Removed ${removed} log function(s)`);
  }
  
  logFunctionId = null;
  startTime = null;
  
  console.log("Log function unregistered successfully");
  return { success: true };
}
