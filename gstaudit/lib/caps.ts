/**
 * Parsing of serialized GstCaps strings (the output of gst_caps_to_string())
 * into a structured form that is easier to present than the raw string.
 */

export interface CapsField {
  name: string;
  type: string | null; // GType annotation, e.g. "int", "string", "fraction"
  value: string;       // Display value with type annotations and quoting removed
  raw: string;         // Value exactly as serialized
}

export interface CapsStructure {
  name: string;            // Media type, e.g. "video/x-raw"
  features: string | null; // Caps features, e.g. "memory:GLMemory"
  fields: CapsField[];
}

export type ParsedCaps =
  | { kind: 'any' }
  | { kind: 'empty' }
  | { kind: 'structures'; structures: CapsStructure[] };

const OPENERS: Record<string, string> = { '(': ')', '[': ']', '{': '}', '<': '>' };

/**
 * Split on a separator character, ignoring separators inside quotes or brackets
 */
function splitTopLevel(input: string, separator: string): string[] {
  const parts: string[] = [];
  const stack: string[] = [];
  let inQuote = false;
  let start = 0;

  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (inQuote) {
      if (c === '\\') i++;
      else if (c === '"') inQuote = false;
    } else if (c === '"') {
      inQuote = true;
    } else if (c in OPENERS) {
      stack.push(OPENERS[c]);
    } else if (stack.length > 0 && c === stack[stack.length - 1]) {
      stack.pop();
    } else if (c === separator && stack.length === 0) {
      parts.push(input.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(input.slice(start));
  return parts.map(p => p.trim()).filter(p => p.length > 0);
}

/**
 * Remove "(type)" annotations and unquote strings, leaving quoted content intact
 */
function simplifyValue(raw: string): string {
  let out = '';
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '"') {
      // Copy the quoted string without quotes, resolving escapes
      for (i++; i < raw.length && raw[i] !== '"'; i++) {
        if (raw[i] === '\\' && i + 1 < raw.length) i++;
        out += raw[i];
      }
    } else if (c === '(') {
      const match = /^\(([\w-]+)\)/.exec(raw.slice(i));
      if (match) {
        i += match[0].length - 1;
      } else {
        out += c;
      }
    } else {
      out += c;
    }
  }
  return out.trim();
}

function parseStructure(serialized: string): CapsStructure {
  const [head, ...rest] = splitTopLevel(serialized, ',');
  const featureMatch = /^([^(]+)\((.*)\)$/.exec(head);

  const fields = rest.map((field): CapsField => {
    const eq = field.indexOf('=');
    if (eq < 0) {
      return { name: field, type: null, value: '', raw: '' };
    }
    const raw = field.slice(eq + 1).trim();
    const typeMatch = /^\(([\w-]+)\)/.exec(raw);
    return {
      name: field.slice(0, eq).trim(),
      type: typeMatch ? typeMatch[1] : null,
      value: simplifyValue(raw),
      raw,
    };
  });

  return {
    name: featureMatch ? featureMatch[1].trim() : head,
    features: featureMatch ? featureMatch[2].trim() : null,
    fields,
  };
}

export function parseCaps(serialized: string): ParsedCaps {
  const trimmed = serialized.trim();
  if (trimmed === 'ANY') return { kind: 'any' };
  if (trimmed === '' || trimmed === 'EMPTY' || trimmed === 'NONE') return { kind: 'empty' };
  return { kind: 'structures', structures: splitTopLevel(trimmed, ';').map(parseStructure) };
}

/**
 * A short human hint for well known fields, e.g. "30 fps" for framerate=30/1
 */
export function fieldHint(field: CapsField): string | null {
  if (field.type !== 'fraction') return null;
  const match = /^(\d+)\/(\d+)$/.exec(field.value);
  if (!match) return null;
  const [num, den] = [Number(match[1]), Number(match[2])];
  if (den === 0) return null;

  if (field.name === 'framerate' || field.name === 'max-framerate') {
    if (num === 0) return 'variable';
    const fps = num / den;
    return `${Number.isInteger(fps) ? fps : fps.toFixed(2)} fps`;
  }
  return null;
}
