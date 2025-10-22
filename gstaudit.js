var gst_pipeline_get_type;
var gst_pipeline_new;
var functions = {};

const callbacks = new Map();

function base_type_to_size(t)
{
  switch (t) {
    case "string":
    case "pointer":
    case "callback":
    case "gtype":
      return Process.pointerSize;
    case "int8":
    case "uint8":
    case "bool":
      return 1;
    case "int16":
    case "uint16":
      return 2;
    case "int32":
    case "uint32":
    case "float":
      return 4;
    case "int64":
    case "uint64":
    case "double":
      return 8;

    default:
      console.error(`Unknown type ${t} size`);
      return 1;
  }
}

function base_type_read(t, p)
{
  switch (t) {
    case "string":
      return p.readCString();
    case "pointer":
    case "gtype":
      return p.readPointer();
    case "int8":
      return p.readS8();
    case "uint8":
      return p.readU8();
    case "int16":
      return p.readS16();
    case "uint16":
      return p.readU16();
    case "int32":
      return p.readS32();
    case "uint32":
      return p.readU32();
    case "float":
      return p.readFloat();
    case "double":
      return p.readDouble();
    default:
      console.error(`Unsupported type ${t} to read`);
      return 0;
  }
}

function type_signature(type)
{
    if (type == "callback") {
      return "pointer";
    } else if (type == "string") {
      return "pointer";
    } else if (type == "gtype") {
      return "pointer";
    } else {
     return type;
    }
}

function callable_signature(type)
{
  var sig = [];
  for (var a of type["arguments"]) {
    if ([1, 2].includes(a["direction"])) {
      sig.push("pointer")
    } else {
      sig.push(type_signature(a["type"]));
    }
  }
  return sig
}

function call(symbol, type, ...args)
{
  var nf;

  console.info(`Calling ${symbol} ${JSON.stringify(type)} and args ${args}`);
  /* Find the symbol if not cached */
  if (symbol in functions) {
    nf = functions["symbol"];
  } else {
    Process.enumerateModules().some(m => {
      var s = m.findExportByName(symbol);
      if (!s) return false;

      /* Return value */
      var rsig = type_signature(type["returns"]);
      /* Arguments */
      var sig = callable_signature(type);
      console.log(`Signature is [${sig}] => ${rsig}`);
      nf = new NativeFunction(s, rsig, sig);
      functions["symbol"] = nf;
      return true;
    });
  }
  /* Now transform the args */
  var tx_args = [];
  var idx = 0;
  for (var a of type["arguments"]) {
    if (a["type"] == "string") {
      tx_args.push(Memory.allocUtf8String(args[idx]));
      idx++;
    } else if (a["type"] == "callback" && !a["is_destroy"]) {
      /* For callbacks, create a new NativeCallback */
      var cb_id = callbacks.size;
      var cb_sig = callable_signature(a["subtype"]);
      var cb_def = a["subtype"]["arguments"];
      var cb = new NativeCallback((...args) => {
        console.log(`Callback ${cb_id} received with signature ${cb_sig}`);
        /* Serialize the data */
        var data = {};
        var cb_idx = 0;
        for (var cb_a of cb_def) {
          if (cb_a["type"] == "string")
            data[cb_a["name"]] = args[cb_idx].readCString();
          else
            data[cb_a["name"]] = args[cb_idx];
          cb_idx++;
        }
        console.log(`Callback ${cb_id} received with args ${data}`);
        send({
          "kind": "callback",
          "data": {"id": cb_id, "data": data}
        });
      }, "void", cb_sig);
      callbacks.set(cb_id.toString(), cb);
      tx_args.push(cb);
    } else if (a["is_destroy"]) {
      tx_args.push(NULL);
    } else if (a["is_closure"]) {
      tx_args.push(NULL);
    } else if ([1, 2].includes(a["direction"])) {
      /* For an output only argument, create the memory to store it */
      console.log(`Output arg ${a["name"]} allocated`);
      tx_args.push(Memory.alloc(base_type_to_size(a["type"])));
      /* TODO */
      /* If INOUT set the value from args and skip it */
      /* continue otherwise */
    } else if (a["skipped"]) {
      tx_args.push(NULL);
    } else if (a["type"] == "pointer") {
      tx_args.push(ptr(args[idx]));
      idx++;
    } else {
      tx_args.push(args[idx]);
      idx++;
    }
  }

  /* Call the function */
  var ret = {};
  console.log(`About to call ${symbol} with args ${tx_args}`);
  var nfr = nf(...tx_args);
  ret["return"] = base_type_read(type["returns"], nfr);
  /* Return the return value plus the output arguments */
  idx = 0;
  for (var a of type["arguments"]) {
    if (a["type"] == "callback" && !a["is_destroy"]) {
      /* Find the key for such callback */
      for (let [key, value] of callbacks.entries()) {
        if (value === tx_args[idx])
          ret[a["name"]] = key;
      }
    } else if ([1, 2].includes(a["direction"])) {
      ret[a["name"]] = base_type_read(a["type"], tx_args[idx]);
    }
    idx++;
  }
  return ret;
}

function findGTypeClass(address)
{
    console.debug(`Looking for a GTypeClass pointing to ${address}`);
    const gtypeclasses = [];
    Process.enumerateRanges("rw-").some(range => {
        const results = Memory.scanSync(range.base, range.size, address.toMatchPattern());
        for (let i = 0; i < results.length; i++) {
            const r = results[i];
            console.debug(`GTypeClass found at ${r.address} with size ${r.size}`);
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
                console.debug(`Looking for a pipeline at ${gtypeclass}`);
                /* Check that we have a valid name to validate it */
                try {
                    let namep = gtypeclass.add(0x20).readPointer();
                    let name = namep.readCString();
                    if (name) {
                        console.info(`Pipeline found with name ${name}`);
                        /* Send a message to notify the Python side */
                        send({
                            "kind": "pipeline",
                            "data": {"ptr": gtypeclass.toString(), "name": name}
                        });
                    }
                } catch (error) {
                  console.debug(`Pipeline not found at ${gtypeclass} [${error}]`);
                }
            });
        });
        return true;
    });
    /* Register the callback whenever a new GstPipeline is created */
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

// Keep track of allocated pointers to prevent garbage collection
const allocatedPointers = new Map();

function alloc(size)
{
  console.info(`Allocating ${size} bytes`);
  const ptr = Memory.alloc(size);
  // Store in map to prevent garbage collection
  allocatedPointers.set(ptr.toString(), ptr);
  console.info(`Allocated ${size} bytes at ${ptr}`);
  return ptr.toString();
}

function free(ptr)
{
  console.info(`Freeing pointer ${ptr}`);
  // Remove from map to allow garbage collection
  // Note: We don't actually call any free function as Frida's Memory.alloc
  // uses the system allocator and the memory will be freed when the script unloads
  const ptrStr = ptr.toString();
  if (allocatedPointers.has(ptrStr)) {
    allocatedPointers.delete(ptrStr);
    console.info(`Freed pointer ${ptr}`);
  } else {
    console.warn(`Pointer ${ptr} was not in allocated pointers map`);
  }
}

rpc.exports = {
  'call': call,
  'alloc': alloc,
  'free': free,
  'init': init,
  'shutdown': shutdown,
};
