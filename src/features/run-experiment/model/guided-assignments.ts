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
    question:
      "У какой модели сильнее вырастет значение, если удвоить n: у одного прохода или у перебора всех пар?",
    hypothesis:
      "Предположите, какая модель будет расти быстрее, и объясните почему.",
    config: {
      ...base,
      source: "theoretical",
      subject: "complexities",
      selectedIds: ["linear", "quadratic"],
      maxSize: 64,
      samples: 4,
    },
    conclusion: "Какой вывод согласуется с таблицей?",
    choices: [
      {
        id: "same",
        label: "Значения обеих моделей увеличатся в одинаковое число раз.",
      },
      {
        id: "linear",
        label:
          "Модель всех пар n² вырастет сильнее, чем модель одного прохода n.",
      },
    ],
    correctChoice: "linear",
    explanation:
      "Сравните строки для 16 и 32 элементов. Число посещений за проход удвоилось (16 → 32), число пар выросло вчетверо (256 → 1024).",
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
    conclusion: "Во сколько раз выросло значение n² при переходе от 10 к 20?",
    choices: [
      { id: "two", label: "Увеличилось вдвое." },
      { id: "four", label: "Увеличилось в четыре раза." },
    ],
    correctChoice: "four",
    explanation:
      "Сравните 10 · 10 = 100 и 20 · 20 = 400. Оба множителя удвоились, поэтому произведение выросло в четыре раза.",
  },
  "same-complexity-different-costs": {
    id: "same-complexity-sorting-writes",
    hint: "Сравните записи для одного размера и вспомните, что оценка не задаёт точный счётчик или время.",
    question:
      "Совпадёт ли число записей у пузырьковой сортировки и сортировки вставками, если обе получат один массив в обратном порядке?",
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
        id: "equal",
        label: "Число записей у обеих реализаций совпадёт.",
      },
      {
        id: "timing",
        label:
          "Из-за одинаковой сложности по счётчикам нельзя сравнить число записей.",
      },
      {
        id: "different",
        label: "Число записей у реализаций будет различаться.",
      },
    ],
    correctChoice: "different",
    explanation:
      "При n = 10 видно 90 записей у пузырьковой сортировки и 54 у вставок. Обмен даёт две записи, а сдвиг — одну. Сортировка вставками дополнительно записывает ключ после сдвигов.",
  },
  logarithmic: {
    id: "search-comparison",
    hint: "Сравните числа сравнений в обеих колонках и их изменение при увеличении n.",
    question:
      "Будет ли бинарный поиск делать меньше сравнений, чем линейный, при поиске отсутствующего значения в отсортированных массивах от 16 до 128 элементов?",
    hypothesis:
      "Предположите, как число сравнений изменится с ростом отсортированного массива.",
    config: base,
    conclusion: "Что видно при увеличении n?",
    choices: [
      {
        id: "binary",
        label:
          "Бинарный поиск сделает меньше сравнений на каждом из этих размеров.",
      },
      {
        id: "same",
        label: "Число сравнений бинарного поиска будет таким же или большим.",
      },
    ],
    correctChoice: "binary",
    explanation:
      "Для отсутствующей цели линейный поиск проверяет все n элементов. Бинарный поиск выполняет по два сравнения на шаг, но каждый раз оставляет примерно половину диапазона.",
  },
  "n-log-n": {
    id: "sort-growth",
    hint: "Сравните столбцы при нескольких размерах и обратите внимание на разницу в их приросте.",
    question:
      "Увеличим массив в обратном порядке с 16 до 128 элементов. У какой сортировки отношение нового числа сравнений к исходному будет больше?",
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
        id: "merge",
        label: "У сортировки слиянием.",
      },
      {
        id: "bubble",
        label: "У пузырьковой сортировки.",
      },
    ],
    correctChoice: "bubble",
    explanation:
      "У пузырьковой сортировки число сравнений выросло со 120 до 8128, почти в 68 раз. У сортировки слиянием — с 32 до 448, в 14 раз. Деление на уровни помогает объяснить разницу.",
  },
  "input-cases": {
    id: "search-cases",
    hint: "Если совпадений нет, может ли поиск остановиться, не проверив оставшиеся элементы?",
    question:
      "Как отличается число сравнений линейного поиска, если цель стоит первой или отсутствует?",
    hypothesis:
      "Предположите, как отличается поиск первого элемента от поиска отсутствующего.",
    config: {
      ...base,
      selectedIds: ["linear-search"],
      targetPosition: "first",
    },
    conclusion: "Сравните результаты для одного и того же n в двух таблицах.",
    choices: [
      {
        id: "all",
        label:
          "Первый элемент потребует одно сравнение, отсутствующий — n сравнений.",
      },
      { id: "one", label: "В обоих случаях потребуется одно сравнение." },
    ],
    correctChoice: "all",
    explanation:
      "При совпадении поиск сразу возвращает позицию. При отсутствии цели проверяются все n элементов. Например, при n = 16 в таблицах стоят 1 и 16.",
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
