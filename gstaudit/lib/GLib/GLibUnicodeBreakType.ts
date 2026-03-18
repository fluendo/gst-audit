export namespace GLibUnicodeBreakType {
  export const MANDATORY: 'mandatory' = 'mandatory';
  export const CARRIAGE_RETURN: 'carriage_return' = 'carriage_return';
  export const LINE_FEED: 'line_feed' = 'line_feed';
  export const COMBINING_MARK: 'combining_mark' = 'combining_mark';
  export const SURROGATE: 'surrogate' = 'surrogate';
  export const ZERO_WIDTH_SPACE: 'zero_width_space' = 'zero_width_space';
  export const INSEPARABLE: 'inseparable' = 'inseparable';
  export const NON_BREAKING_GLUE: 'non_breaking_glue' = 'non_breaking_glue';
  export const CONTINGENT: 'contingent' = 'contingent';
  export const SPACE: 'space' = 'space';
  export const AFTER: 'after' = 'after';
  export const BEFORE: 'before' = 'before';
  export const BEFORE_AND_AFTER: 'before_and_after' = 'before_and_after';
  export const HYPHEN: 'hyphen' = 'hyphen';
  export const NON_STARTER: 'non_starter' = 'non_starter';
  export const OPEN_PUNCTUATION: 'open_punctuation' = 'open_punctuation';
  export const CLOSE_PUNCTUATION: 'close_punctuation' = 'close_punctuation';
  export const QUOTATION: 'quotation' = 'quotation';
  export const EXCLAMATION: 'exclamation' = 'exclamation';
  export const IDEOGRAPHIC: 'ideographic' = 'ideographic';
  export const NUMERIC: 'numeric' = 'numeric';
  export const INFIX_SEPARATOR: 'infix_separator' = 'infix_separator';
  export const SYMBOL: 'symbol' = 'symbol';
  export const ALPHABETIC: 'alphabetic' = 'alphabetic';
  export const PREFIX: 'prefix' = 'prefix';
  export const POSTFIX: 'postfix' = 'postfix';
  export const COMPLEX_CONTEXT: 'complex_context' = 'complex_context';
  export const AMBIGUOUS: 'ambiguous' = 'ambiguous';
  export const UNKNOWN: 'unknown' = 'unknown';
  export const NEXT_LINE: 'next_line' = 'next_line';
  export const WORD_JOINER: 'word_joiner' = 'word_joiner';
  export const HANGUL_L_JAMO: 'hangul_l_jamo' = 'hangul_l_jamo';
  export const HANGUL_V_JAMO: 'hangul_v_jamo' = 'hangul_v_jamo';
  export const HANGUL_T_JAMO: 'hangul_t_jamo' = 'hangul_t_jamo';
  export const HANGUL_LV_SYLLABLE: 'hangul_lv_syllable' = 'hangul_lv_syllable';
  export const HANGUL_LVT_SYLLABLE: 'hangul_lvt_syllable' = 'hangul_lvt_syllable';
  export const CLOSE_PARANTHESIS: 'close_paranthesis' = 'close_paranthesis';
  export const CLOSE_PARENTHESIS: 'close_parenthesis' = 'close_parenthesis';
  export const CONDITIONAL_JAPANESE_STARTER: 'conditional_japanese_starter' = 'conditional_japanese_starter';
  export const HEBREW_LETTER: 'hebrew_letter' = 'hebrew_letter';
  export const REGIONAL_INDICATOR: 'regional_indicator' = 'regional_indicator';
  export const EMOJI_BASE: 'emoji_base' = 'emoji_base';
  export const EMOJI_MODIFIER: 'emoji_modifier' = 'emoji_modifier';
  export const ZERO_WIDTH_JOINER: 'zero_width_joiner' = 'zero_width_joiner';
  export const AKSARA: 'aksara' = 'aksara';
  export const AKSARA_PRE_BASE: 'aksara_pre_base' = 'aksara_pre_base';
  export const AKSARA_START: 'aksara_start' = 'aksara_start';
  export const VIRAMA_FINAL: 'virama_final' = 'virama_final';
  export const VIRAMA: 'virama' = 'virama';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/UnicodeBreakType/get_type`, apiConfig.baseUrl);
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
  export type GLibUnicodeBreakTypeValue = "mandatory" | "carriage_return" | "line_feed" | "combining_mark" | "surrogate" | "zero_width_space" | "inseparable" | "non_breaking_glue" | "contingent" | "space" | "after" | "before" | "before_and_after" | "hyphen" | "non_starter" | "open_punctuation" | "close_punctuation" | "quotation" | "exclamation" | "ideographic" | "numeric" | "infix_separator" | "symbol" | "alphabetic" | "prefix" | "postfix" | "complex_context" | "ambiguous" | "unknown" | "next_line" | "word_joiner" | "hangul_l_jamo" | "hangul_v_jamo" | "hangul_t_jamo" | "hangul_lv_syllable" | "hangul_lvt_syllable" | "close_paranthesis" | "close_parenthesis" | "conditional_japanese_starter" | "hebrew_letter" | "regional_indicator" | "emoji_base" | "emoji_modifier" | "zero_width_joiner" | "aksara" | "aksara_pre_base" | "aksara_start" | "virama_final" | "virama";
