import type { SavedExplorationConfig } from "../model/types";

const metricLabels: Record<SavedExplorationConfig["metric"], string> = {
  total: "все операции",
  comparisons: "сравнения",
  swaps: "обмены",
  arrayReads: "чтения",
  arrayWrites: "записи",
};

const distributionLabels: Record<
  SavedExplorationConfig["distribution"],
  string
> = {
  random: "случайный вход",
  sorted: "отсортированный вход",
  "reverse-sorted": "обратный порядок",
  "nearly-sorted": "почти отсортированный вход",
};

export function describeExploration(config: SavedExplorationConfig): string {
  if (config.source === "instrumented") {
    return config.family === "search"
      ? "Точные операции · алгоритмы поиска"
      : "Точные операции · алгоритмы сортировки";
  }
  if (config.subject === "complexities")
    return "Теоретическая модель · классы Big O";
  return config.family === "search"
    ? "Теоретическая модель · алгоритмы поиска"
    : "Теоретическая модель · алгоритмы сортировки";
}

export function describeExplorationDetails(
  config: SavedExplorationConfig,
): string {
  const range = `n: ${config.minSize}–${config.maxSize} · ${config.samples} точек`;
  if (config.source === "theoretical") return range;
  return `${range} · ${distributionLabels[config.distribution]} · ${metricLabels[config.metric]} · seed ${config.seed}`;
}

export function formatExplorationDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
