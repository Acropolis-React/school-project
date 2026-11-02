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
