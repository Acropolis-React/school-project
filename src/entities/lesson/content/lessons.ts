import type { Lesson } from "../model/types";
import { analyzeCodePractice } from "./analyze-code-questions";
import { introductoryLessons } from "./introductory-lessons";
import { lessonAdditions } from "./lesson-additions";
import { lessonTheory } from "./lesson-theory";

const baseLessons: Omit<Lesson, "theory" | "takeaway">[] = [
  ...introductoryLessons,
  {
    slug: "logarithmic",
    number: 4,
    title: "O(log n)",
    description: "Повторное деление задачи пополам и условие бинарного поиска.",
    duration: "14 мин",
    code: "// a отсортирован; left = 0, right = n - 1\nwhile (left <= right) {\n  int mid = left + (right - left) / 2;\n  if (a[mid] == target) return mid;\n  if (a[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1; // цель не найдена",
    codeCaption: "После каждой проверки остаётся примерно половина диапазона.",
    hypothesis: {
      id: "logarithmic-hypothesis",
      prompt:
        "В модели бинарного поиска делим диапазон пополам до одного кандидата. Если размер отсортированного массива удвоить, сколько делений добавится?",
      choices: [
        { id: "one", label: "Около одного шага" },
        { id: "double", label: "Число шагов удвоится" },
        { id: "none", label: "Ни одного" },
      ],
      correctChoiceId: "one",
      explanation: "log₂(2n) = log₂(n) + 1.",
    },
    experimentModels: ["logarithmic", "linear"],
    interpretation: [
      "Логарифм растёт очень медленно даже на больших входах.",
      "Форма кривой не отменяет предусловия: бинарный поиск требует сортировки.",
    ],
    practice: [
      {
        id: "logarithmic-practice",
        prompt:
          "Можно ли применять обычный бинарный поиск к неотсортированному массиву?",
        choices: [
          { id: "yes", label: "Да, всегда" },
          { id: "no", label: "Нет, результат не гарантирован" },
          { id: "only-even", label: "Только при чётном n" },
        ],
        correctChoiceId: "no",
        explanation:
          "Без порядка нельзя корректно отбросить половину диапазона после сравнения.",
      },
    ],
  },
  {
    slug: "n-log-n",
    number: 5,
    title: "O(n log n)",
    description:
      "Линейно-логарифмический рост и эффективные алгоритмы сортировки.",
    duration: "16 мин",
    code: "mergeSort(a, left, mid);\nmergeSort(a, mid + 1, right);\nmerge(a, left, mid, right);",
    codeCaption:
      "log n уровней разбиения, на каждом уровне — линейное слияние.",
    hypothesis: {
      id: "n-log-n-hypothesis",
      prompt: "Какая модель быстрее растёт на больших n?",
      choices: [
        { id: "nlogn", label: "n log₂ n" },
        { id: "square", label: "n²" },
        { id: "same", label: "Одинаково" },
      ],
      correctChoiceId: "square",
      explanation: "Отношение n² / (n log n) = n / log n растёт с n.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "На малых входах накладные расходы реализации могут быть заметны, но модель описывает асимптотический рост.",
      "Big O не сравнивает конкретные реализации по времени на одном устройстве.",
    ],
    practice: [
      {
        id: "n-log-n-practice",
        prompt: "Почему сортировка слиянием относится к Θ(n log n)?",
        choices: [
          { id: "levels", label: "log n уровней по n работы" },
          { id: "nested", label: "Всегда два вложенных цикла" },
          { id: "constant", label: "Данные не просматриваются" },
        ],
        correctChoiceId: "levels",
        explanation:
          "Разбиение создаёт логарифмическое число уровней, а суммарное слияние на уровне линейно.",
      },
    ],
  },
  {
    slug: "input-cases",
    number: 6,
    title: "Лучший, средний и худший случаи",
    description: "Как свойства входа меняют работу алгоритма и смысл оценки.",
    duration: "15 мин",
    code: "for (int i = 0; i < n; ++i) {\n  if (a[i] == target) return i;\n}\nreturn -1;",
    codeCaption:
      "Линейный поиск может завершиться сразу или проверить весь массив.",
    hypothesis: {
      id: "input-cases-hypothesis",
      prompt: "Каков лучший случай линейного поиска?",
      choices: [
        { id: "constant", label: "Θ(1)" },
        { id: "linear", label: "Θ(n)" },
        { id: "log", label: "Θ(log n)" },
      ],
      correctChoiceId: "constant",
      explanation: "Если искомый элемент первый, достаточно одной проверки.",
    },
    experimentModels: ["linear", "quadratic"],
    showModelChart: false,
    interpretation: [
      "Худший случай линейного поиска — Θ(n): элемент последний или отсутствует.",
      "Средняя оценка требует модели распределения входных данных; её нельзя просто выдумать.",
    ],
    practice: [
      {
        id: "input-cases-practice",
        prompt: "Что обязательно указать для оценки среднего случая?",
        choices: [
          { id: "distribution", label: "Предположения о входных данных" },
          { id: "color", label: "Цвет интерфейса" },
          { id: "cpu", label: "Только модель процессора" },
        ],
        correctChoiceId: "distribution",
        explanation:
          "Среднее вычисляется относительно явно заданного распределения возможных входов.",
      },
    ],
  },
  {
    slug: "analyze-code",
    number: 7,
    title: "Анализ незнакомого кода",
    description:
      "Итоговый алгоритм рассуждения и смешанные задачи по короткому C++ коду.",
    duration: "18 мин",
    code: "for (int i = 1; i < n; i *= 2) {\n  for (int j = 0; j < n; ++j) {\n    inspect(i, j);\n  }\n}",
    codeCaption: "Внешний цикл удваивает i, внутренний проходит n элементов.",
    hypothesis: {
      id: "analyze-code-hypothesis",
      prompt: "Сколько раз примерно выполняется внешний цикл?",
      choices: [
        { id: "log", label: "log₂ n" },
        { id: "n", label: "n" },
        { id: "square", label: "n²" },
      ],
      correctChoiceId: "log",
      explanation:
        "i удваивается, пока не достигнет n, поэтому итераций около log₂ n.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "Умножаем число внешних итераций log n на n внутренних: получаем Θ(n log n).",
      "Название переменной и синтаксис цикла не заменяют анализ границ.",
    ],
    practice: analyzeCodePractice,
  },
];

export const lessons: Lesson[] = baseLessons.map((lesson) => ({
  ...lesson,
  theory: lessonTheory[lesson.slug],
  takeaway: lessonAdditions[lesson.slug].conclusion,
  practice: [
    ...lesson.practice,
    ...(lessonAdditions[lesson.slug].practice ?? []),
  ],
}));

export const getLesson = (slug: string) =>
  lessons.find((lesson) => lesson.slug === slug);

export function getLessonQuestion(lessonSlug: string, questionId: string) {
  const lesson = getLesson(lessonSlug);
  if (!lesson) return undefined;
  if (lesson.hypothesis.id === questionId) return lesson.hypothesis;
  return lesson.practice.find((question) => question.id === questionId);
}
