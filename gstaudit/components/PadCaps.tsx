import { Box, Typography, Chip, IconButton, Tooltip, Button, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useEffect } from 'react';
import { GstPad, GstPadDirection, GstPadDirectionValue } from '@/lib/gst';
import { parseCaps, fieldHint, CapsField, CapsStructure, ParsedCaps } from '@/lib/caps';

// Collapse long alternatives lists (e.g. query results) to this many structures
const MAX_COLLAPSED_STRUCTURES = 3;

const MONO = 'var(--font-geist-mono), ui-monospace, monospace';

interface PadCapsProps {
  pad: GstPad;
  direction: GstPadDirectionValue;
  refreshKey: number;
}

type CapsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; serialized: string | null };

async function capsToString(capsPromise: Promise<{ to_string(): Promise<string> } | null>): Promise<string | null> {
  const caps = await capsPromise;
  return caps ? await caps.to_string() : null;
}

/**
 * Show width/height as a single "size" row when both are fixed integers
 */
function displayFields(structure: CapsStructure): CapsField[] {
  const width = structure.fields.find(f => f.name === 'width');
  const height = structure.fields.find(f => f.name === 'height');
  if (!width || !height || !/^\d+$/.test(width.value) || !/^\d+$/.test(height.value)) {
    return structure.fields;
  }
  const size: CapsField = {
    name: 'size',
    type: 'int',
    value: `${width.value} × ${height.value}`,
    raw: `width=${width.raw}, height=${height.raw}`,
  };
  return structure.fields.flatMap(f => (f === width ? [size] : f === height ? [] : [f]));
}

function StructureView({ structure }: { structure: CapsStructure }) {
  return (
    <Box sx={{ '& + &': { mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.5 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: '0.8125rem', fontWeight: 600 }}>
          {structure.name}
        </Typography>
        {structure.features && (
          <Chip label={structure.features} size="small" variant="outlined"
            sx={{ height: 18, fontSize: '0.6875rem', fontFamily: MONO }} />
        )}
      </Box>
      {structure.fields.length > 0 && (
        <Box
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(auto, max-content) 1fr',
            columnGap: 1.5,
            rowGap: 0.25,
            m: 0,
            fontFamily: MONO,
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {displayFields(structure).map(field => {
            const hint = fieldHint(field);
            return (
              <Box key={field.name} sx={{ display: 'contents' }}>
                <Box component="dt" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {field.name}
                </Box>
                <Box
                  component="dd"
                  title={field.type ? `(${field.type}) ${field.value}` : field.value}
                  sx={{ m: 0, minWidth: 0, overflowWrap: 'anywhere' }}
                >
                  {field.value}
                  {hint && (
                    <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                      {hint}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function CapsView({ caps }: { caps: ParsedCaps }) {
  const [expanded, setExpanded] = useState(false);

  if (caps.kind === 'any') {
    return <Typography variant="caption" color="text.secondary">Any caps</Typography>;
  }
  if (caps.kind === 'empty') {
    return <Typography variant="caption" color="text.secondary">No compatible caps</Typography>;
  }

  const hidden = caps.structures.length - MAX_COLLAPSED_STRUCTURES;
  const shown = expanded || hidden <= 0 ? caps.structures : caps.structures.slice(0, MAX_COLLAPSED_STRUCTURES);
  return (
    <Box>
      {shown.map((s, i) => <StructureView key={i} structure={s} />)}
      {hidden > 0 && (
        <Button size="small" onClick={() => setExpanded(e => !e)} sx={{ mt: 0.5, px: 0, minWidth: 0, textTransform: 'none' }}>
          {expanded ? 'Show fewer' : `Show ${hidden} more`}
        </Button>
      )}
    </Box>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  if (typeof navigator === 'undefined' || !navigator.clipboard) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy caps:', error);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied' : 'Copy caps string'}>
      <IconButton size="small" onClick={copy} aria-label="Copy caps string" sx={{ p: 0.25 }}>
        {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
      </IconButton>
    </Tooltip>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        flexShrink: 0,
        bgcolor: active ? 'success.main' : 'transparent',
        border: active ? 'none' : '1.5px solid',
        borderColor: 'text.disabled',
      }}
    />
  );
}

export function PadCaps({ pad, direction, refreshKey }: PadCapsProps) {
  const possibleLabel = direction === GstPadDirection.SRC ? 'Can produce' : 'Can accept';
  const [current, setCurrent] = useState<CapsState>({ status: 'loading' });
  const [possible, setPossible] = useState<CapsState | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCurrent({ status: 'loading' });
    setPossible(null);
    capsToString(pad.get_current_caps())
      .then(serialized => { if (!cancelled) setCurrent({ status: 'ready', serialized }); })
      .catch(error => {
        if (!cancelled) setCurrent({ status: 'error', message: error instanceof Error ? error.message : String(error) });
      });
    return () => { cancelled = true; };
  }, [pad, refreshKey]);

  const loadPossible = () => {
    setPossible({ status: 'loading' });
    capsToString(pad.query_caps())
      .then(serialized => setPossible({ status: 'ready', serialized }))
      .catch(error => setPossible({ status: 'error', message: error instanceof Error ? error.message : String(error) }));
  };

  if (current.status === 'loading') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <CircularProgress size={10} />
        <Typography variant="caption" color="text.secondary">Reading caps…</Typography>
      </Box>
    );
  }

  if (current.status === 'error') {
    return (
      <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
        Could not read caps: {current.message}
      </Typography>
    );
  }

  const negotiated = current.serialized !== null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <StatusDot active={negotiated} />
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
          {negotiated ? 'Negotiated caps' : 'Not negotiated'}
        </Typography>
        {negotiated && <CopyButton text={current.serialized!} />}
      </Box>

      {negotiated ? (
        <Box sx={{ pl: 1.5, borderLeft: '2px solid', borderColor: 'success.main' }}>
          <CapsView caps={parseCaps(current.serialized!)} />
        </Box>
      ) : possible === null ? (
        <Button size="small" onClick={loadPossible} sx={{ px: 0, minWidth: 0, textTransform: 'none' }}>
          Show possible caps
        </Button>
      ) : possible.status === 'loading' ? (
        <CircularProgress size={10} />
      ) : possible.status === 'error' ? (
        <Typography variant="caption" color="error">Could not query caps: {possible.message}</Typography>
      ) : (
        <Box sx={{ pl: 1.5, borderLeft: '2px dashed', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
              {possibleLabel}
            </Typography>
            {possible.serialized && <CopyButton text={possible.serialized} />}
          </Box>
          <CapsView caps={parseCaps(possible.serialized ?? 'EMPTY')} />
        </Box>
      )}
    </Box>
  );
}

export default PadCaps;
