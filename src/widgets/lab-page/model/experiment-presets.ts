import type { LabExperimentConfig } from "@/entities/experiment";

export type ExperimentPreset = {
  id: string;
  title: string;
  objective: string;
  config: LabExperimentConfig;
};

const sortingBase: LabExperimentConfig = {
  source: "instrumented",
  subject: "algorithms",
  family: "sorting",
  selectedIds: ["bubble-sort", "insertion-sort"],
  minSize: 10,
  maxSize: 100,
  samples: 7,
  distribution: "random",
  metric: "arrayWrites",
  seed: 42,
  targetPosition: "missing",
};

export const experimentPresets: ExperimentPreset[] = [
  {
    id: "same-complexity",
    title: "Одна сложность — разные затраты",
    objective:
      "Сравните записи пузырьковой сортировки и сортировки вставками на одном случайном входе.",
    config: { ...sortingBase, selectedIds: [...sortingBase.selectedIds] },
  },
  {
    id: "input-sorted",
    title: "Влияние входных данных: упорядоченный вход",
    objective:
      "Посмотрите число сравнений сортировок на отсортированном входе и сопоставьте со случайным случаем ниже.",
    config: {
      ...sortingBase,
      selectedIds: [...sortingBase.selectedIds],
      metric: "comparisons",
      distribution: "sorted",
    },
  },
  {
    id: "input-random",
    title: "Влияние входных данных: случайный вход",
    objective:
      "Сравните те же сортировки и размеры на случайном входе с предыдущим упорядоченным случаем.",
    config: {
      ...sortingBase,
      selectedIds: [...sortingBase.selectedIds],
      metric: "comparisons",
      distribution: "random",
    },
  },
  {
    id: "linear-vs-binary",
    title: "Линейный и бинарный поиск",
    objective:
      "Сравните число сравнений при поиске отсутствующего элемента в отсортированном массиве.",
    config: {
      ...sortingBase,
      family: "search",
      selectedIds: ["linear-search", "binary-search"],
      distribution: "sorted",
      metric: "comparisons",
    },
  },
  {
    id: "quadratic-vs-nlogn",
    title: "O(n²) против O(n log n)",
    objective:
      "Сопоставьте сравнения пузырьковой сортировки и сортировки слиянием на случайном входе.",
    config: {
      ...sortingBase,
      selectedIds: ["bubble-sort", "merge-sort"],
      metric: "comparisons",
    },
  },
];

export function getExperimentPreset(id: string): ExperimentPreset | undefined {
  return experimentPresets.find((preset) => preset.id === id);
}
