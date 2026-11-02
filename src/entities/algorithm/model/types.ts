export type AlgorithmFamily = "search" | "sorting";

export type AlgorithmId =
  | "linear-search"
  | "binary-search"
  | "bubble-sort"
  | "insertion-sort"
  | "merge-sort";

export type AlgorithmModel = {
  id: AlgorithmId;
  family: AlgorithmFamily;
  label: string;
  shortLabel: string;
  complexity: string;
  formula: string;
  assumption: string;
  color: string;
  evaluate: (n: number) => number;
};
