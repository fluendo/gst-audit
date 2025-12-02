import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface PipelineSelectorProps {
  pipelines: { name: string; ptr: string }[];
  selectedPipeline: string | null;
  onPipelineChange: (pipelinePtr: string) => void;
}

export function PipelineSelector({ pipelines, selectedPipeline, onPipelineChange }: PipelineSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onPipelineChange(event.target.value);
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <FormControl fullWidth size="small">
        <InputLabel id="pipeline-select-label">Pipeline</InputLabel>
        <Select
          labelId="pipeline-select-label"
          id="pipeline-select"
          value={selectedPipeline || ''}
          label="Pipeline"
          onChange={handleChange}
        >
          {pipelines.map((pipeline) => (
            <MenuItem key={pipeline.ptr} value={pipeline.ptr}>
              {pipeline.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
