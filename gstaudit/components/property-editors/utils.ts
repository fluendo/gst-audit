import {
  GObjectValue,
  GObjectParamSpec,
  GObjectParamSpecBoolean,
  GObjectParamSpecInt,
  GObjectParamSpecUInt,
  GObjectParamSpecLong,
  GObjectParamSpecULong,
  GObjectParamSpecInt64,
  GObjectParamSpecUInt64,
  GObjectParamSpecFloat,
  GObjectParamSpecDouble,
  GObjectParamSpecString,
  GObjectParamSpecEnum,
  GObjectParamSpecFlags,
  GObjectParamSpecObject,
  GObjectParamSpecChar,
  GObjectParamSpecUChar,
} from '@/lib/gst';

/**
 * Extract display value from GObjectValue based on ParamSpec type
 */
export async function extractValueFromGValue(
  value: GObjectValue,
  paramSpec: GObjectParamSpec
): Promise<string> {
  try {
    // String
    if (await paramSpec.isOf(GObjectParamSpecString)) {
      const strValue = await value.get_string();
      return strValue !== null ? strValue : '';
    }

    // Boolean
    if (await paramSpec.isOf(GObjectParamSpecBoolean)) {
      const boolValue = await value.get_boolean();
      return boolValue.toString();
    }

    // Integer types (check more specific first)
    if (await paramSpec.isOf(GObjectParamSpecInt64)) {
      const int64Value = await value.get_int64();
      return int64Value.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecUInt64)) {
      const uint64Value = await value.get_uint64();
      return uint64Value.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecLong)) {
      const longValue = await value.get_long();
      return longValue.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecULong)) {
      const ulongValue = await value.get_ulong();
      return ulongValue.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecUInt)) {
      const uintValue = await value.get_uint();
      return uintValue.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecInt)) {
      const intValue = await value.get_int();
      return intValue.toString();
    }

    // Char types
    if (await paramSpec.isOf(GObjectParamSpecUChar)) {
      const ucharValue = await value.get_uchar();
      return ucharValue.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecChar)) {
      const charValue = await value.get_char();
      return charValue.toString();
    }

    // Float/Double
    if (await paramSpec.isOf(GObjectParamSpecDouble)) {
      const doubleValue = await value.get_double();
      return doubleValue.toString();
    }

    if (await paramSpec.isOf(GObjectParamSpecFloat)) {
      const floatValue = await value.get_float();
      return floatValue.toString();
    }

    // Enum
    if (await paramSpec.isOf(GObjectParamSpecEnum)) {
      const enumValue = await value.get_enum();
      return enumValue.toString();
    }

    // Flags
    if (await paramSpec.isOf(GObjectParamSpecFlags)) {
      const flagsValue = await value.get_flags();
      return flagsValue.toString();
    }

    // Object
    if (await paramSpec.isOf(GObjectParamSpecObject)) {
      const objValue = await value.get_object();
      return objValue ? `<object at ${objValue.ptr}>` : '(null)';
    }

    return '<unknown type>';
  } catch (error) {
    console.error('Error extracting value:', error);
    return `<error: ${error}>`;
  }
}

/**
 * Set value in GObjectValue based on ParamSpec type and string input
 */
export async function setValueInGValue(
  gvalue: GObjectValue,
  paramSpec: GObjectParamSpec,
  stringValue: string
): Promise<void> {
  // String
  if (await paramSpec.isOf(GObjectParamSpecString)) {
    await gvalue.set_string(stringValue);
    return;
  }

  // Boolean
  if (await paramSpec.isOf(GObjectParamSpecBoolean)) {
    const boolValue = stringValue === 'true' || stringValue === '1';
    await gvalue.set_boolean(boolValue);
    return;
  }

  // Integer types (check more specific first)
  if (await paramSpec.isOf(GObjectParamSpecInt64)) {
    await gvalue.set_int64(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecUInt64)) {
    await gvalue.set_uint64(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecLong)) {
    await gvalue.set_long(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecULong)) {
    await gvalue.set_ulong(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecUInt)) {
    await gvalue.set_uint(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecInt)) {
    await gvalue.set_int(parseInt(stringValue, 10));
    return;
  }

  // Char types
  if (await paramSpec.isOf(GObjectParamSpecUChar)) {
    await gvalue.set_uchar(parseInt(stringValue, 10));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecChar)) {
    await gvalue.set_char(parseInt(stringValue, 10));
    return;
  }

  // Float/Double
  if (await paramSpec.isOf(GObjectParamSpecDouble)) {
    await gvalue.set_double(parseFloat(stringValue));
    return;
  }

  if (await paramSpec.isOf(GObjectParamSpecFloat)) {
    await gvalue.set_float(parseFloat(stringValue));
    return;
  }

  // Enum
  if (await paramSpec.isOf(GObjectParamSpecEnum)) {
    await gvalue.set_enum(parseInt(stringValue, 10));
    return;
  }

  // Flags
  if (await paramSpec.isOf(GObjectParamSpecFlags)) {
    await gvalue.set_flags(parseInt(stringValue, 10));
    return;
  }

  throw new Error('Unsupported property type for editing');
}

/**
 * Get the property type name for display purposes
 */
export async function getPropertyTypeName(paramSpec: GObjectParamSpec): Promise<string> {
  if (await paramSpec.isOf(GObjectParamSpecString)) return 'String';
  if (await paramSpec.isOf(GObjectParamSpecBoolean)) return 'Boolean';
  if (await paramSpec.isOf(GObjectParamSpecInt64)) return 'Int64';
  if (await paramSpec.isOf(GObjectParamSpecUInt64)) return 'UInt64';
  if (await paramSpec.isOf(GObjectParamSpecLong)) return 'Long';
  if (await paramSpec.isOf(GObjectParamSpecULong)) return 'ULong';
  if (await paramSpec.isOf(GObjectParamSpecInt)) return 'Int';
  if (await paramSpec.isOf(GObjectParamSpecUInt)) return 'UInt';
  if (await paramSpec.isOf(GObjectParamSpecChar)) return 'Char';
  if (await paramSpec.isOf(GObjectParamSpecUChar)) return 'UChar';
  if (await paramSpec.isOf(GObjectParamSpecFloat)) return 'Float';
  if (await paramSpec.isOf(GObjectParamSpecDouble)) return 'Double';
  if (await paramSpec.isOf(GObjectParamSpecEnum)) return 'Enum';
  if (await paramSpec.isOf(GObjectParamSpecFlags)) return 'Flags';
  if (await paramSpec.isOf(GObjectParamSpecObject)) return 'Object';
  return 'Unknown';
}
