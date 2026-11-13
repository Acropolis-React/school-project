export {
  getDistributionLabel,
  getMetricLabel,
  inputDistributionOptions,
  operationMetricOptions,
  targetPositionOptions,
} from "./lib/experiment-options";
export {
  getAvailableExperimentSeries,
  runExperiment,
} from "./lib/run-experiment";
export {
  getMaximumInputSize,
  validateExperimentConfig,
} from "./lib/validate-config";
export type {
  ExperimentDataPoint,
  ExperimentSeriesDefinition,
  ExperimentValidationError,
  LabExperimentResult,
} from "./model/types";
