import {
  type AlgorithmFamily,
  getAlgorithmsByFamily,
} from "@/entities/algorithm";
import { complexityModels } from "@/entities/experiment";
import type { SavedExplorationConfig } from "@/features/manage-saved-explorations";

export type ComparisonMode = "algorithms" | "complexities";

export type LabConfig = SavedExplorationConfig;

export type SeriesDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  complexity: string;
  formula: string;
  assumption: string;
  color: string;
  evaluate: (n: number) => number;
};

export type LabPoint = { inputSize: number } & Record<string, number>;

export const defaultConfig: LabConfig = {
  mode: "algorithms",
  family: "search",
  selectedIds: ["linear-search", "binary-search"],
  minSize: 10,
  maxSize: 100,
  samples: 7,
};

const complexitySeries: SeriesDefinition[] = complexityModels.map((model) => ({
  ...model,
  complexity: model.shortLabel,
  formula:
    model.id === "constant"
      ? "1"
      : model.id === "logarithmic"
        ? "log₂(n)"
        : model.id === "linear"
          ? "n"
          : model.id === "linearithmic"
            ? "n · log₂(n)"
            : "n²",
  assumption: "Нормализованная математическая функция роста.",
}));

export function getAvailableSeries(config: LabConfig): SeriesDefinition[] {
  if (config.mode === "complexities") return complexitySeries;
  return getAlgorithmsByFamily(config.family);
}

export function getSelectedSeries(config: LabConfig): SeriesDefinition[] {
  return getAvailableSeries(config).filter((series) =>
    config.selectedIds.includes(series.id),
  );
}

export function generatePoints(
  config: LabConfig,
  series: SeriesDefinition[],
): LabPoint[] {
  const samples = Math.max(2, Math.min(config.samples, 12));
  const step = (config.maxSize - config.minSize) / (samples - 1);

  return Array.from({ length: samples }, (_, index) => {
    const inputSize = Math.max(1, Math.round(config.minSize + step * index));
    const point: LabPoint = { inputSize };
    for (const item of series)
      point[item.id] = Math.round(item.evaluate(inputSize));
    return point;
  });
}

export function defaultIds(
  mode: ComparisonMode,
  family: AlgorithmFamily,
): string[] {
  return mode === "algorithms"
    ? getAlgorithmsByFamily(family).map((algorithm) => algorithm.id)
    : complexitySeries.map((model) => model.id);
}
