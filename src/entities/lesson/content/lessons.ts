import type { Lesson } from "../model/types";
import { analyzeCodePractice } from "./analyze-code-questions";
import { codeTraceExercise } from "./code-trace-exercise";
import { introductoryLessons } from "./introductory-lessons";
import { lessonAdditions } from "./lesson-additions";
import { lessonTheory } from "./lesson-theory";

const analyzeCodeExample =
  "for (int i = 1; i < n; i *= 2) {\n  for (int j = 0; j < n; ++j) {\n    inspect(i, j);\n  }\n}";

const baseLessons: Omit<Lesson, "theory" | "takeaway">[] = [
  ...introductoryLessons,
  {
    slug: "logarithmic",
    number: 4,
    title: "O(log n)",
    description: "Почему деление пополам сокращает число шагов поиска.",
    duration: "14 мин",
    code: "// a отсортирован; left = 0, right = n - 1\nwhile (left <= right) {\n  int mid = left + (right - left) / 2;\n  if (a[mid] == target) return mid;\n  if (a[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1; // цель не найдена",
    codeCaption: "Если совпадения нет, остаётся не больше половины диапазона.",
    hypothesis: {
      id: "logarithmic-hypothesis",
      prompt:
        "В учебной схеме делим диапазон пополам, пока не останется один кандидат. Сколько делений добавится, если начать с 64 кандидатов вместо 32?",
      choices: [
        { id: "one", label: "Одно деление" },
        { id: "double", label: "Число делений удвоится" },
        { id: "none", label: "Ни одного деления" },
      ],
      correctChoiceId: "one",
      explanation:
        "Из 64 первым делением получаем 32. Дальше обе цепочки одинаковы. Поэтому log₂(2n) = log₂ n + 1 для n > 0.",
    },
    experimentModels: ["logarithmic", "linear"],
    interpretation: [
      "На графике значение log₂ n растёт медленнее, чем n. Линии показывают формулы роста: значения логарифма в таблице округлены до целых.",
      "В исследовании линейный поиск сравнил цель с каждым элементом. Бинарный поиск сравнивал её со средними элементами уменьшающихся диапазонов, пользуясь тем, что массив отсортирован.",
    ],
    practice: [
      {
        id: "logarithmic-practice",
        prompt:
          "Можно ли применять обычный бинарный поиск к неотсортированному массиву?",
        choices: [
          { id: "yes", label: "Да, всегда" },
          { id: "only-even", label: "Только при чётном n" },
          { id: "no", label: "Нет, результат не гарантирован" },
        ],
        correctChoiceId: "no",
        explanation:
          "Например, в [1, 5, 2] ищем 2. Середина равна 5. Алгоритм уйдёт влево, хотя искомое число находится справа.",
      },
    ],
  },
  {
    slug: "n-log-n",
    number: 5,
    title: "O(n log n)",
    description: "От деления пополам к сортировке слиянием.",
    duration: "16 мин",
    code: "if (left >= right) return;\nint mid = left + (right - left) / 2;\nmergeSort(a, left, mid);\nmergeSort(a, mid + 1, right);\nmerge(a, left, mid, right);",
    codeCaption:
      "Схема сортировки отрезка массива. Части длины 0 или 1 уже отсортированы.",
    hypothesis: {
      id: "n-log-n-hypothesis",
      prompt: "Какая модель быстрее растёт на больших n?",
      choices: [
        { id: "nlogn", label: "n log₂ n" },
        { id: "square", label: "n²" },
        { id: "same", label: "Одинаково" },
      ],
      correctChoiceId: "square",
      explanation:
        "У формул общий множитель n. Второй множитель у n² — ещё одно n. Оно растёт быстрее, чем log₂ n.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "На графике n² опережает n · log₂ n. При удвоении входа n² растёт вчетверо. В модели слияний удваивается число элементов, а число уровней увеличивается всего на один.",
      "Счётчики исследования согласуются с этим порядком роста на выбранных входах. Чтобы обосновать оценку для произвольного n, нужно разобрать работу алгоритма на каждом уровне.",
    ],
    practice: [
      {
        id: "n-log-n-practice",
        prompt: "Почему сортировка слиянием относится к Θ(n log n)?",
        choices: [
          {
            id: "levels",
            label: "Порядка log n уровней, на каждом суммарно Θ(n) работы",
          },
          {
            id: "nested",
            label: "На каждом уровне снова выполняется полный перебор всех пар",
          },
          {
            id: "constant",
            label: "На каждом уровне обрабатывается только один элемент",
          },
        ],
        correctChoiceId: "levels",
        explanation:
          "Деление пополам даёт порядка log n уровней. Слияния одного уровня обрабатывают суммарно порядка n элементов. Произведение даёт Θ(n log n).",
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
      prompt:
        "Какова тесная оценка числа сравнений в лучшем случае линейного поиска по непустому массиву?",
      choices: [
        { id: "linear", label: "Θ(n)" },
        { id: "log", label: "Θ(log n)" },
        { id: "constant", label: "Θ(1)" },
      ],
      correctChoiceId: "constant",
      explanation: "Если искомый элемент первый, достаточно одной проверки.",
    },
    experimentModels: ["linear", "quadratic"],
    showModelChart: false,
    interpretation: [
      "В первой таблице всегда одно сравнение: цель найдена в первой позиции. Во второй число сравнений совпадает с n: при отсутствии цели нужно проверить весь массив.",
      "Первая таблица иллюстрирует Θ(1) в лучшем случае, вторая — Θ(n) в худшем. Чтобы получить среднее, задайте вероятности всех возможных входов.",
    ],
    practice: [
      {
        id: "input-cases-practice",
        prompt: "Что обязательно указать для оценки среднего случая?",
        choices: [
          { id: "color", label: "Только размер входа" },
          { id: "distribution", label: "Возможные входы и их вероятности" },
          {
            id: "cpu",
            label: "Только число сравнений в лучшем и худшем случаях",
          },
        ],
        correctChoiceId: "distribution",
        explanation:
          "Если первая позиция встречается чаще, а остальные по-прежнему равновероятны между собой, среднее число сравнений уменьшается. Одного размера массива для вычисления среднего недостаточно.",
      },
    ],
  },
  {
    slug: "analyze-code",
    number: 7,
    title: "Анализ незнакомого кода",
    description: "Как вывести оценку сложности из границ циклов в коде на C++.",
    duration: "18 мин",
    code: analyzeCodeExample,
    codeCaption: "Внешний цикл удваивает i, внутренний проходит n элементов.",
    hypothesis: {
      id: "analyze-code-hypothesis",
      prompt: "Какой порядок роста у числа итераций внешнего цикла при n ≥ 2?",
      code: analyzeCodeExample,
      choices: [
        { id: "n", label: "n" },
        { id: "log", label: "log₂ n" },
        { id: "square", label: "n²" },
      ],
      correctChoiceId: "log",
      explanation:
        "После k удвоений i равно 2ᵏ. Цикл завершается при первом 2ᵏ ≥ n, поэтому число итераций равно ⌈log₂ n⌉.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "При n = 10 после четырёх удвоений i становится равным 16, и цикл останавливается. На четырёх внешних проходах было по 10 вызовов: всего 40.",
      "Подставьте произвольное n вместо 10. Внутренний цикл по-прежнему выполняется одинаковое число раз для каждого i. Поэтому число вызовов равно n · ⌈log₂ n⌉, что даёт Θ(n log n).",
      "В следующих задачах проверьте, меняется ли длина внутреннего цикла от одного внешнего шага к другому. Это определяет, можно ли заменить сумму произведением.",
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
  if (lessonSlug === "analyze-code" && questionId === codeTraceExercise.id)
    return codeTraceExercise;
  if (lesson.hypothesis.id === questionId) return lesson.hypothesis;
  return lesson.practice.find((question) => question.id === questionId);
}

// The optional guide is outside the core curriculum and its progress.
export const bonusGuide = {
  kind: "bonus" as const,
  slug: "course-reference",
  title: "Повторение курса",
  description:
    "Краткий справочник по всем изученным темам: определения, формулы, примеры и основные правила.",
};
export function getCoreCourseProgress(completedSlugs: readonly string[]) {
  const completed = lessons.filter((lesson) =>
    completedSlugs.includes(lesson.slug),
  ).length;
  return {
    completed,
    total: lessons.length,
    unlocked: completed === lessons.length,
  };
}
