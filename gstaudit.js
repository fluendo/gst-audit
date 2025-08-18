var gst_pipeline_get_type;
var gst_pipeline_new;
var gst_debug_add_log_function;
var gst_debug_category_get_name;
var gst_debug_message_get;
var pipelines = [];

const gst_debug_add_log_function_cb = new NativeCallback(
    (cat, level, file, func, line, obj, msg, ptr) => {
        send({
            "kind": "debug",
            "data": {
                "category": Memory.readCString(gst_debug_category_get_name(cat)),
                "level": level,
                "file": Memory.readCString(file),
                "function": Memory.readCString(func),
                "line": line,
                "obj": obj,
                "msg": Memory.readCString(gst_debug_message_get(msg)),
            }
        });
    }, 'void', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'pointer']);


function setupLogHandler()
{
    console.log("Registering log handler");
    Process.enumerateModules().some(m => {
        let symb = m.findExportByName('gst_debug_add_log_function');
        if (symb == null)
            return false;
        gst_debug_add_log_function = new NativeFunction(symb, 'void', ['pointer', 'pointer', 'pointer']);

        symb = m.findExportByName('gst_debug_category_get_name');
        if (symb == null)
            return false;
        gst_debug_category_get_name = new NativeFunction(symb, 'pointer', ['pointer']);

        symb = m.findExportByName('gst_debug_message_get');
        if (symb == null)
            return false;
        gst_debug_message_get = new NativeFunction(symb, 'pointer', ['pointer']);

        gst_debug_add_log_function (gst_debug_add_log_function_cb, ptr(0), ptr(0));
        return true;
    });
}

function enumeratePipelines()
{
    return pipelines;
}

function changeState()
{
    console.log("Changing state");
    Process.enumerateModules().some(m => {
        /* Example of the set state */
        symb = m.findExportByName('gst_element_set_state');
        if (symb == null)
            return false;
        f = new NativeFunction(symb, 'int', ['pointer','int']);
        f(pipeline_ptr, 3);
        return true;
    });
}

function findGTypeClass(address)
{
    console.debug(`Looking for a GTypeClass pointing to ${address}`);
    const gtypeclasses = [];
    Process.enumerateRanges("rw-").some(range => {
        const results = Memory.scanSync(range.base, range.size, address.toMatchPattern());
        for (let i = 0; i < results.length; i++) {
            const r = results[i];
            console.debug(`GTypeClass found at at ${r.address} with size ${r.size}`);
            let gtcp = r.address;
            gtypeclasses.push(gtcp);
        }
        return false;
    });
    return gtypeclasses;
}

function findGType(gtype)
{
    console.debug(`Looking for GType ${gtype}`);
    const gtypes = [];
    /* Find all places where the GstPipeline GType is referenced */
    const ranges = Process.enumerateRanges("rw-");
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const results = Memory.scanSync(range.base, range.size, gtype.toMatchPattern());
        if (results.length)
            console.debug(`Range ${range.base} ${range.size}:`);
        for (let j = 0; j < results.length; j++) {
            const r = results[j];
            console.debug(`GType found at ${r.address} with size ${r.size}`);
            let gtp = r.address;
            gtypes.push(gtp);
        }
    }
    return gtypes;
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
    console.debug("Finding running pipelines");
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
        let pm = ptr(pt.toString());
        let gtypes = findGType(pm);
        gtypes.forEach(gtype => {
            findGTypeClass(gtype).forEach(gtypeclass => {
                /* Check that we have a valid name to validate it */
                try {
                    let namep = gtypeclass.add(0x20).readPointer();
                    let name = Memory.readCString(namep);
                    if (name) {
                        console.info(`Pipeline found with name ${name}`);
                        pipelines.push(gtypeclass);
                    }
                } catch (error) {

                }
            });
        });
        return true;
    });
    /* Register the callback whenever a new GstPipeline is created */
}

console.log ("Running script");
rpc.exports = {
  'enumeratePipelines': enumeratePipelines,
};


setupLogHandler();
findRunningPipelines();
console.log("Done");
