import type { AlgorithmFamily, AlgorithmModel } from "./types";

export const algorithmFamilies: Array<{
  id: AlgorithmFamily;
  label: string;
  description: string;
}> = [
  {
    id: "search",
    label: "Поиск",
    description: "Сравнение поиска элемента в коллекции.",
  },
  {
    id: "sorting",
    label: "Сортировка",
    description: "Сравнение моделей сортировки массива.",
  },
];

export const algorithms: AlgorithmModel[] = [
  {
    id: "linear-search",
    family: "search",
    label: "Линейный поиск",
    shortLabel: "Линейный поиск",
    complexity: "O(n)",
    formula: "n",
    assumption: "Худший случай: нужный элемент последний или отсутствует.",
    color: "#facc15",
    evaluate: (n) => n,
  },
  {
    id: "binary-search",
    family: "search",
    label: "Бинарный поиск",
    shortLabel: "Бинарный поиск",
    complexity: "O(log n)",
    formula: "⌈log₂(n)⌉ + 1",
    assumption: "Массив заранее отсортирован; показан худший случай.",
    color: "#4cc9a6",
    evaluate: (n) => Math.ceil(Math.log2(n)) + 1,
  },
  {
    id: "bubble-sort",
    family: "sorting",
    label: "Пузырьковая сортировка",
    shortLabel: "Пузырьковая",
    complexity: "O(n²)",
    formula: "n²",
    assumption: "Нормализованная модель квадратичного роста.",
    color: "#f87171",
    evaluate: (n) => n * n,
  },
  {
    id: "insertion-sort",
    family: "sorting",
    label: "Сортировка вставками",
    shortLabel: "Вставками",
    complexity: "O(n²)",
    formula: "n² / 2",
    assumption: "Иллюстративная модель среднего квадратичного роста.",
    color: "#c084fc",
    evaluate: (n) => (n * n) / 2,
  },
  {
    id: "merge-sort",
    family: "sorting",
    label: "Сортировка слиянием",
    shortLabel: "Слиянием",
    complexity: "O(n log n)",
    formula: "n · ⌈log₂(n)⌉",
    assumption: "Модель количества уровней разбиения и слияния.",
    color: "#60a5fa",
    evaluate: (n) => n * Math.ceil(Math.log2(n)),
  },
  {
    id: "quick-sort",
    family: "sorting",
    label: "Быстрая сортировка",
    shortLabel: "Быстрая",
    complexity: "O(n log n) в среднем · O(n²) в худшем случае",
    formula: "n · ⌈log₂(n)⌉",
    assumption:
      "Иллюстративная модель среднего роста при случайном порядке различных элементов; последний элемент — опорный. Отсортированный или обратный вход даёт квадратичный худший случай.",
    color: "#fb923c",
    evaluate: (n) => n * Math.ceil(Math.log2(n)),
  },
];

export function getAlgorithmsByFamily(
  family: AlgorithmFamily,
): AlgorithmModel[] {
  return algorithms.filter((algorithm) => algorithm.family === family);
}
