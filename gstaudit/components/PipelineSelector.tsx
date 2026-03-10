import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { GstPipeline } from '@/lib/gst';

interface PipelineSelectorProps {
  pipelines: { name: string; pipeline: GstPipeline }[];
  selectedPipeline: GstPipeline | null;
  onPipelineChange: (pipeline: GstPipeline) => void;
}

export function PipelineSelector({ pipelines, selectedPipeline, onPipelineChange }: PipelineSelectorProps) {
  // Automatically select the first pipeline when pipelines list changes
  useEffect(() => {
    if (pipelines.length > 0 && !selectedPipeline) {
      onPipelineChange(pipelines[0].pipeline);
    }
  }, [pipelines, selectedPipeline, onPipelineChange]);

  const handleChange = (event: SelectChangeEvent) => {
    const pipelinePtr = event.target.value;
    const found = pipelines.find(item => item.pipeline.ptr === pipelinePtr);
    if (found) {
      onPipelineChange(found.pipeline);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <FormControl fullWidth size="small">
        <InputLabel id="pipeline-select-label">Pipeline</InputLabel>
        <Select
          labelId="pipeline-select-label"
          id="pipeline-select"
          value={selectedPipeline?.ptr || ''}
          label="Pipeline"
          onChange={handleChange}
        >
          {pipelines.map((item) => (
            <MenuItem key={item.pipeline.ptr} value={item.pipeline.ptr}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
