export namespace GLibUnicodeType {
  export const CONTROL: 'control' = 'control';
  export const FORMAT: 'format' = 'format';
  export const UNASSIGNED: 'unassigned' = 'unassigned';
  export const PRIVATE_USE: 'private_use' = 'private_use';
  export const SURROGATE: 'surrogate' = 'surrogate';
  export const LOWERCASE_LETTER: 'lowercase_letter' = 'lowercase_letter';
  export const MODIFIER_LETTER: 'modifier_letter' = 'modifier_letter';
  export const OTHER_LETTER: 'other_letter' = 'other_letter';
  export const TITLECASE_LETTER: 'titlecase_letter' = 'titlecase_letter';
  export const UPPERCASE_LETTER: 'uppercase_letter' = 'uppercase_letter';
  export const SPACING_MARK: 'spacing_mark' = 'spacing_mark';
  export const ENCLOSING_MARK: 'enclosing_mark' = 'enclosing_mark';
  export const NON_SPACING_MARK: 'non_spacing_mark' = 'non_spacing_mark';
  export const DECIMAL_NUMBER: 'decimal_number' = 'decimal_number';
  export const LETTER_NUMBER: 'letter_number' = 'letter_number';
  export const OTHER_NUMBER: 'other_number' = 'other_number';
  export const CONNECT_PUNCTUATION: 'connect_punctuation' = 'connect_punctuation';
  export const DASH_PUNCTUATION: 'dash_punctuation' = 'dash_punctuation';
  export const CLOSE_PUNCTUATION: 'close_punctuation' = 'close_punctuation';
  export const FINAL_PUNCTUATION: 'final_punctuation' = 'final_punctuation';
  export const INITIAL_PUNCTUATION: 'initial_punctuation' = 'initial_punctuation';
  export const OTHER_PUNCTUATION: 'other_punctuation' = 'other_punctuation';
  export const OPEN_PUNCTUATION: 'open_punctuation' = 'open_punctuation';
  export const CURRENCY_SYMBOL: 'currency_symbol' = 'currency_symbol';
  export const MODIFIER_SYMBOL: 'modifier_symbol' = 'modifier_symbol';
  export const MATH_SYMBOL: 'math_symbol' = 'math_symbol';
  export const OTHER_SYMBOL: 'other_symbol' = 'other_symbol';
  export const LINE_SEPARATOR: 'line_separator' = 'line_separator';
  export const PARAGRAPH_SEPARATOR: 'paragraph_separator' = 'paragraph_separator';
  export const SPACE_SEPARATOR: 'space_separator' = 'space_separator';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/UnicodeType/get_type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  }
  export type GLibUnicodeTypeValue = "control" | "format" | "unassigned" | "private_use" | "surrogate" | "lowercase_letter" | "modifier_letter" | "other_letter" | "titlecase_letter" | "uppercase_letter" | "spacing_mark" | "enclosing_mark" | "non_spacing_mark" | "decimal_number" | "letter_number" | "other_number" | "connect_punctuation" | "dash_punctuation" | "close_punctuation" | "final_punctuation" | "initial_punctuation" | "other_punctuation" | "open_punctuation" | "currency_symbol" | "modifier_symbol" | "math_symbol" | "other_symbol" | "line_separator" | "paragraph_separator" | "space_separator";
