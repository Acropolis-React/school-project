export type ComplexityId =
  | "constant"
  | "logarithmic"
  | "linear"
  | "linearithmic"
  | "quadratic";

export type ComplexityModel = {
  id: ComplexityId;
  label: string;
  shortLabel: string;
  color: string;
  evaluate: (n: number) => number;
};

export type ExperimentConfig = {
  modelIds: ComplexityId[];
  minSize: number;
  maxSize: number;
  samples: number;
};

export type ExperimentPoint = { inputSize: number } & Partial<
  Record<ComplexityId, number>
>;

export type ExperimentSource = "theoretical" | "instrumented";

export type ComparisonSubject = "algorithms" | "complexities";

export type ExperimentAlgorithmFamily = "search" | "sorting";

export type InputDistribution =
  | "random"
  | "sorted"
  | "reverse-sorted"
  | "nearly-sorted";

export type OperationMetric =
  | "total"
  | "comparisons"
  | "swaps"
  | "arrayReads"
  | "arrayWrites";

export type ExperimentTargetPosition =
  | "first"
  | "middle"
  | "last"
  | "random"
  | "missing";

export type LabExperimentConfig = {
  source: ExperimentSource;
  subject: ComparisonSubject;
  family: ExperimentAlgorithmFamily;
  selectedIds: string[];
  minSize: number;
  maxSize: number;
  samples: number;
  distribution: InputDistribution;
  metric: OperationMetric;
  seed: number;
  targetPosition: ExperimentTargetPosition;
};
