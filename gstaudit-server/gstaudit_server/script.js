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
        console.error(`Looking for a pipeline at ${gtypeclass}`);
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
            console.error(`Pipeline found with name '${name}'`);
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
    console.error(`Finding instances for ${pt}`);
    let pm = ptr(pt.toString());
    let gtypes = findMemoryForGType(pm);
    gtypes.forEach(gtype => {
        validateIsPipeline(gtype);
    });
    findInstanceOfChildrenTypes(pt);
}

function findInstanceOfChildrenTypes(type)
{
    console.error(`Finding children types for ${type}`);
    Process.enumerateModules().some(m => {
        let symb = m.findExportByName('g_type_children');
        if (symb == null)
            return false;
        let n_children_ptr = Memory.alloc(Process.pointerSize);
        g_type_children = new NativeFunction(symb, 'pointer', ['size_t', 'pointer']);
        let children = g_type_children(type, n_children_ptr);
        let n_children = n_children_ptr.readU32();
        console.error(`Found ${n_children} types inheriting from ${type}`);
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
        findInstanceOfType(pt);
        return true;
    });
    /* TODO Register the callback whenever a new GstPipeline is created */
}

function init()
{
  console.log("Init");
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
};
