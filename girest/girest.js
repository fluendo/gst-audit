var gst_pipeline_get_type;
var gst_pipeline_new;
var functions = {};
var g_param_spec_types = null;
  

const callbacks = new Map();

function base_type_to_size(t)
{
  switch (t["name"]) {
    case "string":
    case "pointer":
    case "callback":
    case "gtype":
    case "array":
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
    case "struct":
      return t["struct_size"];
    default:
      console.error(`Unknown type ${t["name"]} size`);
      return 1;
  }
}

function base_type_convert(t, p, array_length)
{
  switch (t["name"]) {
    case "string":
      return p.readCString();
    case "bool":
      return Boolean(p);
    case "gtype":
    case "pointer":
      return p.isNull() ? null : p;
    case "array":
      {
        if (p.isNull())
          return [];
        const element_type = t["subtype"];
        const ret = [];
        for (let i = 0; i < array_length; i++) {
          const element_size = base_type_to_size(element_type);
          const element_ptr = p.add(i * element_size);
          const element_value = base_type_read(element_type, element_ptr);
          ret.push(element_value);
        }
        return ret;
      }
    default:
      return p;
  }
}

function base_type_read(t, p)
{
  switch (t["name"]) {
    case "string":
      return p.readCString();
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
    case "bool":
      return base_type_convert(t, p.readS8());
    case "gtype":
    case "pointer":
      return base_type_convert(t, p.readPointer());
    case "int64":
      return p.readS64();
    case "uint64":
      return p.readU64();
    default:
      console.error(`Unsupported type ${t["name"]} to read`);
      return 0;
  }
}

function base_type_write(t, p, value)
{
  switch (t["name"]) {
    case "string":
      p.writePointer(Memory.allocUtf8String(value));
      break;
    case "gtype":
      p.writePointer(ptr(value));
      break;
    case "int8":
      p.writeS8(value);
      break;
    case "uint8":
      p.writeU8(value);
      break;
    case "int16":
      p.writeS16(value);
      break;
    case "uint16":
      p.writeU16(value);
      break;
    case "int32":
      p.writeS32(value);
      break;
    case "uint32":
      p.writeU32(value);
      break;
    case "int64":
      p.writeS64(int64(value));
      break;
    case "uint64":
      p.writeU64(uint64(value));
      break;
    case "float":
      p.writeFloat(value);
      break;
    case "double":
      p.writeDouble(value);
      break;
    case "pointer":
    case "struct":
      p.writePointer(ptr(value));
      break;
    default:
      console.error(`Unsupported type ${t["name"]} for write`);
      break;
  }
}

function type_signature(type)
{
    if (type["name"] == "callback") {
      return "pointer";
    } else if (type["name"] == "string") {
      return "pointer";
    } else if (type["name"] == "gtype") {
      return "pointer";
    } else if (type["name"] == "struct") {
      return "pointer";
    } else if (type["name"] == "array") {
      return "pointer";
    } else {
     return type["name"];
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
      console.debug(`Signature is [${sig}] => ${rsig}`);
      nf = new NativeFunction(s, rsig, sig);
      functions["symbol"] = nf;
      return true;
    });
  }
  /* Now transform the args */
  var tx_args = [];
  var idx = 0;
  for (var a of type["arguments"]) {
    var a_t = a["type"];
    var a_tn = a_t["name"];
    
    if (a_tn == "string") {
      tx_args.push(Memory.allocUtf8String(args[idx]));
      idx++;
    } else if (a_tn == "int64") {
      tx_args.push(int64(args[idx]));
      idx++;
    } else if (a_tn == "uint64") {
      tx_args.push(uint64(args[idx]));
      idx++;
    } else if (a_tn == "callback" && !a["is_destroy"]) {
      /* For callbacks, create a new NativeCallback */
      var cb_id = callbacks.size;
      var cb_sig = callable_signature(a_t["subtype"]);
      var cb_def = a_t["subtype"]["arguments"];
      var cb = new NativeCallback((...args) => {
        console.debug(`Callback ${cb_id} received with signature ${cb_sig}`);
        /* Serialize the data */
        var data = {};
        var cb_idx = 0;
        for (var cb_a of cb_def) {
          if (cb_a["type"]["name"] == "string")
            data[cb_a["name"]] = args[cb_idx].readCString();
          else
            data[cb_a["name"]] = args[cb_idx];
          cb_idx++;
        }
        console.debug(`Callback ${cb_id} received with args ${data}`);
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
      const out_size = base_type_to_size(a_t);
      const out = Memory.alloc(out_size);
      console.debug(`Output arg ${a["name"]} allocated at ${out} of size ${out_size}`);
      tx_args.push(out);
      /* TODO */
      /* If INOUT set the value from args and skip it */
      /* continue otherwise */
    } else if (a["skip_in"]) {
      tx_args.push(NULL);
    } else if (type_signature(a_t) == "pointer") {
      tx_args.push(ptr(args[idx]));
      idx++;
    } else {
      tx_args.push(args[idx]);
      idx++;
    }
  }

  /* Call the function */
  var ret = {};
  console.info(`About to call ${symbol} with args ${tx_args}`);
  var nfr = nf(...tx_args);
  
  if (type["returns"]["name"] != "void") {
    /* When returning arrays, the length parameter must be read */
    if (type["returns"]["name"] == "array" && type["return_length"] >= 0) {
      var return_length = base_type_read(type["arguments"][type["return_length"]]["type"], tx_args[type["return_length"]]);
      ret["return"] = base_type_convert(type["returns"], nfr, return_length);
    } else {
      ret["return"] = base_type_convert(type["returns"], nfr, -1);
    }
  }
  /* Return the return value plus the output arguments */
  idx = 0;
  for (var a of type["arguments"]) {
    if (a["skip_out"]) {
      idx++;
      continue;
    } else if (a["type"]["name"] == "callback" && !a["is_destroy"]) {
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
  console.info(`Returned values are ${JSON.stringify(ret)}`);
  return ret;
}

function init()
{
  console.debug("Init");
  console.debug("Init done");
}

function shutdown()
{
  console.debug("Shutdown");
  console.debug("Shutdown done");
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

function get_field(struct_ptr, offset, field_type)
{
  console.info(`Reading field at offset ${offset} from struct ${struct_ptr} with type ${JSON.stringify(field_type)}`);
  
  // Convert struct_ptr string to pointer
  const base = ptr(struct_ptr);
  const field_ptr = base.add(offset);
  
  // Read the value based on the field type
  const value = base_type_read(field_type, field_ptr);
  
  console.info(`Read field value: ${value}`);
  return value;
}

function set_field(struct_ptr, offset, field_type, value)
{
  console.info(`Writing field at offset ${offset} to struct ${struct_ptr} with type ${JSON.stringify(field_type)} and value ${value}`);
  
  // Convert struct_ptr string to pointer
  const base = ptr(struct_ptr);
  const field_ptr = base.add(offset);
  
  // Write the value based on the field type
  base_type_write(field_type, field_ptr, value);
  
  console.info(`Wrote field value: ${value}`);
}

function internal_gtype(name)
{
  console.info(`Getting internal gtype for ${name}`);
  
  // Map ParamSpec type names to their indices in g_param_spec_types array
  // Based on gparamspecs.h from GLib
  const paramSpecTypeMap = {
    'ParamSpecChar': 0,
    'ParamSpecUChar': 1,
    'ParamSpecBoolean': 2,
    'ParamSpecInt': 3,
    'ParamSpecUInt': 4,
    'ParamSpecLong': 5,
    'ParamSpecULong': 6,
    'ParamSpecInt64': 7,
    'ParamSpecUInt64': 8,
    'ParamSpecUnichar': 9,
    'ParamSpecEnum': 10,
    'ParamSpecFlags': 11,
    'ParamSpecFloat': 12,
    'ParamSpecDouble': 13,
    'ParamSpecString': 14,
    'ParamSpecParam': 15,
    'ParamSpecBoxed': 16,
    'ParamSpecPointer': 17,
    'ParamSpecValueArray': 18,
    'ParamSpecObject': 19,
    'ParamSpecOverride': 20,
    'ParamSpecGType': 21,
    'ParamSpecVariant': 22
  };
  
  const index = paramSpecTypeMap[name];
  if (index === undefined) {
    console.error(`Unknown ParamSpec type: ${name}`);
    return null;
  }

  if (!g_param_spec_types) {
    Process.enumerateModules().some(m => {
      const symbol = m.findExportByName('g_param_spec_types');
      if (symbol) {
        g_param_spec_types = symbol;
        return true;
      }
      return false;
    });
    
    if (!g_param_spec_types) {
      console.error('Could not find g_param_spec_types symbol');
      return 0;
    }
  }

  // g_param_spec_types is a pointer to an array of GType values
  // Each GType is a size_t (pointer-sized integer)
  // Read the GType value at the calculated offset
  const offset = index * Process.pointerSize;
  const gtype_array_ptr = g_param_spec_types.readPointer();
  const gtype_ptr = gtype_array_ptr.add(offset);
  
  // Read the GType as an integer value (size_t/ulong)
  // GType is typically size_t, so read as pointer-sized unsigned integer
  const gtype = gtype_ptr.readU64();
  
  console.info(`Resolved ${name} to GType: ${gtype}`);
  return gtype;
}

rpc.exports = {
  'call': call,
  'alloc': alloc,
  'free': free,
  'getField': get_field,
  'setField': set_field,
  'internalGtype': internal_gtype,
  'init': init,
  'shutdown': shutdown,
};
