import { getAlgorithmsByFamily } from "@/entities/algorithm";
import {
  type ComparisonSubject,
  complexityModels,
  type ExperimentAlgorithmFamily,
  type LabExperimentConfig,
} from "@/entities/experiment";

export type LabConfig = LabExperimentConfig;

export type ResearchFields = {
  title: string;
  hypothesis: string;
  conclusion: string;
};

export const emptyResearch: ResearchFields = {
  title: "",
  hypothesis: "",
  conclusion: "",
};

export const defaultConfig: LabConfig = {
  source: "theoretical",
  subject: "algorithms",
  family: "search",
  selectedIds: ["linear-search", "binary-search"],
  minSize: 10,
  maxSize: 100,
  samples: 7,
  distribution: "sorted",
  metric: "comparisons",
  seed: 42,
  targetPosition: "missing",
};

export function defaultIds(
  subject: ComparisonSubject,
  family: ExperimentAlgorithmFamily,
): string[] {
  if (subject === "algorithms" && family === "sorting") {
    return ["bubble-sort", "merge-sort"];
  }
  return subject === "algorithms"
    ? getAlgorithmsByFamily(family).map((algorithm) => algorithm.id)
    : complexityModels.map((model) => model.id);
}

export function copyLabConfig(config: LabConfig): LabConfig {
  return { ...config, selectedIds: [...config.selectedIds] };
}
