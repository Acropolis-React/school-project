import type {
  ComplexityId,
  ComplexityModel,
  ExperimentConfig,
  ExperimentPoint,
} from "../model/types";

export const complexityModels: ComplexityModel[] = [
  {
    id: "constant",
    label: "Константная",
    shortLabel: "O(1)",
    color: "#60a5fa",
    evaluate: () => 1,
  },
  {
    id: "logarithmic",
    label: "Логарифмическая",
    shortLabel: "O(log n)",
    color: "#4cc9a6",
    evaluate: (n) => Math.log2(n),
  },
  {
    id: "linear",
    label: "Линейная",
    shortLabel: "O(n)",
    color: "#facc15",
    evaluate: (n) => n,
  },
  {
    id: "linearithmic",
    label: "Линейно-логарифмическая",
    shortLabel: "O(n log n)",
    color: "#fb923c",
    evaluate: (n) => n * Math.log2(n),
  },
  {
    id: "quadratic",
    label: "Квадратичная",
    shortLabel: "O(n²)",
    color: "#f87171",
    evaluate: (n) => n * n,
  },
];

export const getComplexityModel = (id: ComplexityId) =>
  complexityModels.find((model) => model.id === id);

export function generateExperiment(
  config: ExperimentConfig,
): ExperimentPoint[] {
  const safeSamples = Math.max(2, Math.min(config.samples, 12));
  const step = (config.maxSize - config.minSize) / (safeSamples - 1);

  return Array.from({ length: safeSamples }, (_, index) => {
    const inputSize = Math.max(1, Math.round(config.minSize + step * index));
    const point: ExperimentPoint = { inputSize };
    for (const modelId of config.modelIds) {
      const model = getComplexityModel(modelId);
      if (model) point[modelId] = Math.round(model.evaluate(inputSize));
    }
    return point;
  });
}
