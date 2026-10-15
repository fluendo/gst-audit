export type QueueSample = [number, number, number, number, number];

export interface QueueLevels {
  name: string;
  interval_ms: number;
  leaky: 'no' | 'upstream' | 'downstream';
  counts_overruns: boolean;
  max: { buffers: number; bytes: number; time: number };
  samples: QueueSample[];
  stopped_early?: string;
}

export async function sampleQueueLevels(
  gstauditBaseUrl: string,
  elementPtr: string,
  seconds: number,
  intervalMs: number,
): Promise<QueueLevels> {
  const response = await fetch(
    `${gstauditBaseUrl}/GstAudit/queue-levels?element=${elementPtr}&seconds=${seconds}&interval=${intervalMs}`
  );
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error ?? `HTTP error! status: ${response.status}`);
  }
  return body;
}
