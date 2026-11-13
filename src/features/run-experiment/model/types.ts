import type {
  ExperimentSource,
  LabExperimentConfig,
  OperationMetric,
} from "@/entities/experiment";

export type ExperimentSeriesDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  complexity: string;
  formula: string | null;
  assumption: string;
  color: string;
};

export type ExperimentDataPoint = { inputSize: number } & Record<
  string,
  number
>;

export type LabExperimentResult = {
  source: ExperimentSource;
  metric: OperationMetric | "model-value";
  points: ExperimentDataPoint[];
  series: ExperimentSeriesDefinition[];
  disclosure: string;
  yAxisLabel: string;
  tableCaption: string;
  assumptions: string[];
  observations: string[];
  config: LabExperimentConfig;
};

export type ExperimentValidationError = {
  field: "selectedIds" | "range" | "samples" | "distribution" | "seed";
  message: string;
};
