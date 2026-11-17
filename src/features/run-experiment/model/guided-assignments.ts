import type { LabExperimentConfig } from "@/entities/experiment";
import type { LessonSlug } from "@/entities/lesson";

type GuidedAssignment = {
  id: string;
  question: string;
  hypothesis: string;
  config: LabExperimentConfig;
  conclusion: string;
  choices: { id: string; label: string }[];
  correctChoice: string;
  explanation: string;
  hint: string;
};

const base: LabExperimentConfig = {
  source: "instrumented",
  subject: "algorithms",
  family: "search",
  selectedIds: ["linear-search", "binary-search"],
  minSize: 16,
  maxSize: 128,
  samples: 5,
  distribution: "sorted",
  metric: "comparisons",
  seed: 42,
  targetPosition: "missing",
};

const assignments: Record<LessonSlug, GuidedAssignment> = {
  "what-is-big-o": {
    id: "growth-linear-log",
    hint: "Сравните изменения обоих столбцов между одинаковыми размерами входа.",
    question: "Какая модель растёт быстрее при увеличении n: n или n²?",
    hypothesis:
      "Предположите, какая модель будет расти быстрее, и объясните почему.",
    config: {
      ...base,
      source: "theoretical",
      subject: "complexities",
      selectedIds: ["linear", "quadratic"],
    },
    conclusion: "Какой вывод согласуется с таблицей?",
    choices: [
      {
        id: "linear",
        label: "Квадратичная модель растёт быстрее линейной.",
      },
      { id: "same", label: "Обе модели растут одинаково." },
    ],
    correctChoice: "linear",
    explanation:
      "При удвоении n модель n удваивается, а n² увеличивается вчетверо; таблица показывает модель, а не замер времени.",
  },
  "linear-and-quadratic": {
    id: "growth-quadratic",
    hint: "Посмотрите на значения при n = 10 и n = 20 и разделите второе на первое.",
    question:
      "Во сколько раз увеличится значение n², если n увеличится с 10 до 20?",
    hypothesis: "Предположите, во сколько раз изменится n² при удвоении n.",
    config: {
      ...base,
      source: "theoretical",
      subject: "complexities",
      selectedIds: ["linear", "quadratic"],
      minSize: 10,
      maxSize: 40,
      samples: 4,
    },
    conclusion: "Сравните n = 10 и n = 20. Что произошло с n²?",
    choices: [
      { id: "two", label: "Увеличилось вдвое." },
      { id: "four", label: "Увеличилось в четыре раза." },
    ],
    correctChoice: "four",
    explanation: "(2n)² = 4n²: значения 100 и 400 отличаются в четыре раза.",
  },
  "same-complexity-different-costs": {
    id: "same-complexity-sorting-writes",
    hint: "Сравните записи для одного размера и вспомните, что оценка не задаёт точный счётчик или время.",
    question:
      "Одинаково ли число записей у пузырьковой сортировки и сортировки вставками на обратном входе?",
    hypothesis: "Предположите, совпадут ли счётчики записей и почему.",
    config: {
      ...base,
      family: "sorting",
      selectedIds: ["bubble-sort", "insertion-sort"],
      distribution: "reverse-sorted",
      metric: "arrayWrites",
      minSize: 10,
      maxSize: 50,
      samples: 5,
    },
    conclusion:
      "Сравните записи в двух столбцах для одинаковых размеров. Какой вывод подтверждается?",
    choices: [
      {
        id: "different",
        label:
          "Число записей различается, хотя обе сортировки квадратичны в худшем случае.",
      },
      {
        id: "equal",
        label: "Одинаковая оценка O(n²) требует одинакового числа записей.",
      },
      {
        id: "timing",
        label: "По таблице можно установить точное время выполнения.",
      },
    ],
    correctChoice: "different",
    explanation:
      "В этих реализациях обмен пузырьковой сортировки записывает два элемента, а сортировка вставками использует сдвиги и запись ключа. Таблица считает записи, а не время.",
  },
  logarithmic: {
    id: "search-comparison",
    hint: "Сравните числа сравнений в обеих колонках и их изменение при увеличении n.",
    question:
      "Для отсутствующего значения в отсортированных массивах от 16 до 128 элементов какой результат покажут счётчики сравнений?",
    hypothesis:
      "Предположите, как число сравнений изменится с ростом отсортированного массива.",
    config: base,
    conclusion: "Что видно при увеличении n?",
    choices: [
      {
        id: "binary",
        label: "Бинарный поиск использует меньше сравнений и растёт медленнее.",
      },
      {
        id: "same",
        label: "Оба поиска всегда выполняют одинаковое число сравнений.",
      },
    ],
    correctChoice: "binary",
    explanation:
      "Линейный поиск проверяет весь массив, бинарный сокращает отсортированный диапазон примерно вдвое.",
  },
  "n-log-n": {
    id: "sort-growth",
    hint: "Сравните столбцы при нескольких размерах и обратите внимание на разницу в их приросте.",
    question:
      "На обратном входе от 16 до 128 элементов как будет расти число сравнений пузырьковой сортировки и сортировки слиянием?",
    hypothesis:
      "Предположите, какой алгоритм будет делать больше сравнений при росте массива.",
    config: {
      ...base,
      family: "sorting",
      selectedIds: ["bubble-sort", "merge-sort"],
      distribution: "reverse-sorted",
      minSize: 16,
      maxSize: 128,
    },
    conclusion: "Какое наблюдение подтверждается данными?",
    choices: [
      {
        id: "bubble",
        label: "Число сравнений пузырьковой сортировки растёт быстрее.",
      },
      {
        id: "merge",
        label:
          "Число сравнений сортировки слиянием растёт квадратично и быстрее.",
      },
    ],
    correctChoice: "bubble",
    explanation:
      "На обратном входе пузырьковая сортировка делает квадратичное число сравнений; слияние растёт медленнее.",
  },
  "input-cases": {
    id: "search-cases",
    hint: "Если совпадений нет, может ли поиск остановиться, не проверив оставшиеся элементы?",
    question:
      "Если цель отсутствует в массиве из n элементов, сколько сравнений выполнит линейный поиск?",
    hypothesis:
      "Предположите, как отличается поиск первого элемента от поиска отсутствующего.",
    config: {
      ...base,
      selectedIds: ["linear-search"],
      targetPosition: "first",
    },
    conclusion:
      "Первый элемент найден за одно сравнение. Что произойдёт, если цель отсутствует?",
    choices: [
      { id: "all", label: "Линейный поиск проверит все n элементов." },
      { id: "one", label: "Всегда потребуется одно сравнение." },
    ],
    correctChoice: "all",
    explanation:
      "Первый элемент даёт лучший случай; при отсутствии цели линейный поиск проверяет все n элементов.",
  },
  "analyze-code": {
    id: "identify-growth",
    hint: "Сравните число сравнений с размером входа в каждой строке.",
    question:
      "Какой характер роста демонстрируют реальные сравнения линейного поиска отсутствующей цели?",
    hypothesis: "Предположите, как изменится число сравнений при увеличении n.",
    config: {
      ...base,
      selectedIds: ["linear-search"],
      minSize: 20,
      maxSize: 80,
      samples: 4,
    },
    conclusion: "Какой характер роста соответствует данным?",
    choices: [
      { id: "linear", label: "Линейный: число сравнений равно n." },
      {
        id: "log",
        label: "Логарифмический: число сравнений примерно равно log₂(n).",
      },
    ],
    correctChoice: "linear",
    explanation:
      "При отсутствии цели проверяется каждый элемент. Наблюдения помогают сформулировать гипотезу; доказательство следует из анализа кода.",
  },
};

export function getGuidedAssignment(slug: LessonSlug): GuidedAssignment {
  return assignments[slug];
}

export function evaluateGuidedConclusion(
  assignment: GuidedAssignment,
  choice: string,
) {
  return {
    correct: choice === assignment.correctChoice,
    explanation:
      choice === assignment.correctChoice
        ? assignment.explanation
        : assignment.hint,
  };
}
