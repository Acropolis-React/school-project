import type { SavedExplorationConfig } from "../model/types";

export function describeExploration(config: SavedExplorationConfig): string {
  if (config.mode === "complexities") return "Сравнение классов Big O";
  return config.family === "search"
    ? "Сравнение алгоритмов поиска"
    : "Сравнение алгоритмов сортировки";
}

export function formatExplorationDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
