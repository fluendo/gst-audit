import { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { QueueLevels, sampleQueueLevels } from '@/lib/queueLevels';

const SECONDS = 10;
// Samples run on the Frida agent thread, but each one takes the queue's mutex
// three times and so contends with the streaming thread feeding the queue.
// Sampling much faster than this skews what it measures.
const INTERVAL_MS = 50;
const WIDTH = 640;
const PANEL_HEIGHT = 120;
const MARGIN = { top: 24, right: 16, bottom: 20, left: 72 };

interface QueueLevelsDialogProps {
  open: boolean;
  onClose: () => void;
  gstauditBaseUrl: string;
  elementPtr: string;
}

interface Series {
  title: string;
  index: 1 | 2 | 3;
  limit: number;
  format: (v: number) => string;
}

const formatBytes = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(1)} MB` : v >= 1e3 ? `${(v / 1e3).toFixed(0)} kB` : `${v} B`;
const formatTime = (v: number) => `${(v / 1e6).toFixed(0)} ms`;

export function QueueLevelsDialog({ open, onClose, gstauditBaseUrl, elementPtr }: QueueLevelsDialogProps) {
  const [levels, setLevels] = useState<QueueLevels | null>(null);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!open) return;
    setLevels(null);
    setError(null);
    let cancelled = false;
    sampleQueueLevels(gstauditBaseUrl, elementPtr, SECONDS, INTERVAL_MS)
      .then((result) => { if (!cancelled) setLevels(result); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : String(err)); });
    return () => { cancelled = true; };
  }, [open, gstauditBaseUrl, elementPtr]);

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg || !levels) return;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svg.width.baseVal.value * 2;
      canvas.height = svg.height.baseVal.value * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${levels.name}-levels.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`;
  };

  const series: Series[] = levels ? [
    { title: 'buffers', index: 1, limit: levels.max.buffers, format: (v) => `${v}` },
    { title: 'bytes', index: 2, limit: levels.max.bytes, format: formatBytes },
    { title: 'time', index: 3, limit: levels.max.time, format: formatTime },
  ] : [];

  const overruns = levels && levels.samples.length > 0 ? levels.samples[levels.samples.length - 1][4] : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Queue levels{levels ? `: ${levels.name}` : ''}</DialogTitle>
      <DialogContent>
        {!levels && !error && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Sampling for {SECONDS} s...</Typography>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {levels && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              leaky={levels.leaky}
              {levels.counts_overruns ? `, ${overruns} overruns` : ''}
              {levels.leaky !== 'no' && overruns > 0 ? ' (buffers may have been dropped)' : ''}
            </Typography>
            {levels.stopped_early && (
              <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                Sampling stopped early: {levels.stopped_early}
              </Typography>
            )}
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width={WIDTH}
              height={series.length * PANEL_HEIGHT}
              fontFamily="monospace"
              fontSize="11"
              style={{ background: '#ffffff', display: 'block' }}
            >
              {series.map((s, i) => (
                <LevelPanel key={s.title} levels={levels} series={s} y={i * PANEL_HEIGHT} />
              ))}
            </svg>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={downloadPng} disabled={!levels}>Download PNG</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function LevelPanel({ levels, series, y }: { levels: QueueLevels; series: Series; y: number }) {
  const { samples } = levels;
  const w = WIDTH - MARGIN.left - MARGIN.right;
  const h = PANEL_HEIGHT - MARGIN.top - MARGIN.bottom;
  const tMax = Math.max(1, samples[samples.length - 1][0]);
  const peak = Math.max(...samples.map((s) => s[series.index]));
  const yMax = Math.max(1, series.limit, peak);
  const x = (t: number) => MARGIN.left + (t / tMax) * w;
  const yy = (v: number) => y + MARGIN.top + h - (v / yMax) * h;

  const points = samples.map((s) => `${x(s[0]).toFixed(1)},${yy(s[series.index]).toFixed(1)}`).join(' ');
  const overrunTimes = samples.filter((s, i) => i > 0 && s[4] > samples[i - 1][4]).map((s) => s[0]);

  return (
    <g>
      <text x={MARGIN.left} y={y + 14} fill="#333">
        {series.title}: peak {series.format(peak)}, limit {series.limit > 0 ? series.format(series.limit) : 'none'}
      </text>
      <line x1={MARGIN.left} y1={yy(0)} x2={MARGIN.left + w} y2={yy(0)} stroke="#ccc" />
      <text x={MARGIN.left - 6} y={yy(yMax) + 4} textAnchor="end" fill="#777">{series.format(yMax)}</text>
      <text x={MARGIN.left - 6} y={yy(0) + 4} textAnchor="end" fill="#777">0</text>
      <text x={MARGIN.left + w} y={yy(0) + 14} textAnchor="end" fill="#777">{(tMax / 1000).toFixed(1)} s</text>
      {series.limit > 0 && (
        <line x1={MARGIN.left} y1={yy(series.limit)} x2={MARGIN.left + w} y2={yy(series.limit)}
          stroke="#c62828" strokeDasharray="4 3" strokeWidth={1} />
      )}
      {overrunTimes.map((t, i) => (
        <line key={i} x1={x(t)} y1={yy(yMax)} x2={x(t)} y2={yy(0)} stroke="#c62828" strokeOpacity={0.25} />
      ))}
      <polyline points={points} fill="none" stroke="#1565c0" strokeWidth={1.5} />
    </g>
  );
}
