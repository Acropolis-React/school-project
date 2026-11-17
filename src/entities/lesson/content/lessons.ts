import type { Lesson } from "../model/types";
import { analyzeCodePractice } from "./analyze-code-questions";
import { lessonAdditions } from "./lesson-additions";
import { lessonTheory } from "./lesson-theory";

const sumExample =
  "int sum = 0;\nfor (int i = 0; i < n; ++i) {\n  sum += values[i];\n}\nreturn sum;";

const baseLessons: Omit<Lesson, "theory" | "takeaway">[] = [
  {
    slug: "what-is-big-o",
    number: 1,
    title: "Введение в Big O",
    description:
      "Что такое асимптотический рост и почему важен размер входа n.",
    duration: "12 мин",
    code: sumExample,
    codeCaption: "Цикл проходит по каждому элементу один раз.",
    hypothesis: {
      id: "what-is-big-o-hypothesis",
      prompt:
        "Если n увеличить в 2 раза, как примерно изменится число шагов линейного алгоритма?",
      choices: [
        { id: "same", label: "Не изменится" },
        { id: "double", label: "Увеличится примерно в 2 раза" },
        { id: "four", label: "Увеличится примерно в 4 раза" },
      ],
      correctChoiceId: "double",
      explanation:
        "Для модели f(n) = n удвоение n удваивает модельное значение.",
    },
    experimentModels: ["linear", "quadratic"],
    interpretation: [
      "Линейная кривая растёт равномерно: удвоение n удваивает значение модели.",
      "Квадратичная кривая быстро отрывается: при удвоении n значение n² увеличивается в четыре раза.",
    ],
    practice: [
      {
        id: "what-is-big-o-practice",
        code: sumExample,
        codeCaption: "Считаем добавления элементов к сумме.",
        prompt:
          "Какая из предложенных верхних границ наиболее точна для показанного цикла? Считайте сложение и доступ к элементу постоянными по стоимости.",
        choices: [
          { id: "constant", label: "O(1) — константная" },
          { id: "linear", label: "O(n) — линейная" },
          { id: "quadratic", label: "O(n²) — квадратичная" },
        ],
        correctChoiceId: "linear",
        explanation:
          "Тело цикла выполняется n раз, поэтому рост линейный: Θ(n), а значит и O(n).",
      },
    ],
  },
  {
    slug: "linear-and-quadratic",
    number: 2,
    title: "O(1), O(n), O(n²)",
    description:
      "Последовательные и вложенные циклы, константный и квадратичный рост.",
    duration: "15 мин",
    code: "for (int i = 0; i < n; ++i) {\n  for (int j = 0; j < n; ++j) {\n    visit(i, j);\n  }\n}",
    codeCaption:
      "Для каждой из n итераций внешний цикл запускает n внутренних.",
    hypothesis: {
      id: "linear-and-quadratic-hypothesis",
      prompt: "Что произойдёт с моделью n² при удвоении n?",
      choices: [
        { id: "double", label: "Рост примерно в 2 раза" },
        { id: "four", label: "Рост примерно в 4 раза" },
        { id: "eight", label: "Рост примерно в 8 раз" },
      ],
      correctChoiceId: "four",
      explanation:
        "(2n)² = 4n², поэтому модельное значение увеличивается в четыре раза.",
    },
    experimentModels: ["linear", "quadratic"],
    interpretation: [
      "Разница между n и n² невелика на малых n, но быстро становится существенной.",
      "Два последовательных цикла — не то же самое, что два вложенных.",
    ],
    practice: [
      {
        id: "linear-and-quadratic-practice",
        prompt:
          "Два последовательных полных цикла по n элементов делают постоянную работу за итерацию. Какая из предложенных верхних границ наиболее точна?",
        choices: [
          { id: "linear", label: "O(n)" },
          { id: "quadratic", label: "O(n²)" },
          { id: "constant", label: "O(1)" },
        ],
        correctChoiceId: "linear",
        explanation:
          "n + n = 2n; постоянный множитель не меняет асимптотический класс.",
      },
    ],
  },
  {
    slug: "same-complexity-different-costs",
    number: 3,
    title: "Одинаковая сложность — разные затраты",
    description: "Константы, входные данные и различия между реализациями.",
    duration: "8 мин",
    code: "for (int i = 0; i < n; ++i) {\n  work(); work();\n}\n// Другой цикл вызывает work() 8 раз за итерацию.",
    codeCaption: "Если вызовы считать отдельно, получаются 2n и 8n вызовов.",
    hypothesis: {
      id: "same-complexity-hypothesis",
      prompt:
        "Две программы выполняют соответственно 2n и 8n одинаковых операций. Что можно заключить при одном и том же положительном n?",
      choices: [
        {
          id: "factor",
          label:
            "Обе линейны; вторая выполняет в четыре раза больше этих операций.",
        },
        { id: "class", label: "Вторая квадратична, потому что 8 больше 2." },
        {
          id: "time",
          label: "Вторая обязательно работает ровно в четыре раза дольше.",
        },
      ],
      correctChoiceId: "factor",
      explanation:
        "8n / 2n = 4 при n > 0; обе функции имеют рост Θ(n). Число операций само по себе не определяет точное время.",
    },
    experimentModels: ["linear", "quadratic"],
    showModelChart: false,
    interpretation: [
      "В исследовании считались записи в массив при выполнении двух конкретных реализаций на одинаковом обратном входе. Это реальные счётчики выбранной операции, а не время выполнения.",
      "На обратном входе каждый обмен пузырьковой сортировки даёт две записи, а сортировка вставками записывает сдвиги и ключ. Поэтому при одном n сравнивайте столбцы записей, а не время.",
      "Теоретические выражения 2n и 8n показывают роль постоянного множителя; они не являются формулами для результатов сортировок. Одинаковая оценка O(n²) в худшем случае не означает одинаковых точных затрат.",
    ],
    practice: [
      {
        id: "same-complexity-practice-input",
        prompt:
          "Две сортировки имеют оценку O(n²) в худшем случае. Почему их счётчики на массивах одинаковой длины могут различаться?",
        choices: [
          {
            id: "details",
            label:
              "Из-за порядка входных данных, выбранной операции и деталей реализации.",
          },
          {
            id: "equal",
            label:
              "Не могут: одинаковый Big O гарантирует одинаковое число операций.",
          },
          {
            id: "class",
            label: "Различие всегда доказывает, что одна из оценок неверна.",
          },
        ],
        correctChoiceId: "details",
        explanation:
          "Big O не задаёт точное число операций: разные входы и реализации приводят к разным счётчикам при одной асимптотической оценке.",
      },
      {
        id: "same-complexity-practice-metric",
        prompt:
          "В одном запуске насчитали меньше записей. Следует ли из этого, что алгоритм всегда быстрее?",
        choices: [
          {
            id: "no",
            label: "Нет: другие операции и время выполнения могут отличаться.",
          },
          { id: "yes", label: "Да: число записей полностью определяет время." },
        ],
        correctChoiceId: "no",
        explanation:
          "Записи — только одна категория операций. Без отдельного измерения и условий нельзя утверждать, какой алгоритм быстрее по времени.",
      },
    ],
  },
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
