import type { LessonQuestion } from "../model/types";

export const analyzeCodePractice: LessonQuestion[] = [
  {
    id: "analyze-code-practice-n-log-n",
    prompt: "Какова тесная временная оценка фрагмента?",
    code: "for (int i = 1; i < n; i *= 2) {\n  for (int j = 0; j < n; ++j) {\n    inspect(i, j);\n  }\n}",
    codeCaption: "Сначала определите число итераций каждого цикла.",
    choices: [
      { id: "linear", label: "Θ(n)" },
      { id: "nlogn", label: "Θ(n log n)" },
      { id: "square", label: "Θ(n²)" },
    ],
    correctChoiceId: "nlogn",
    explanation:
      "Внешний цикл выполняется Θ(log n) раз, а внутренний — Θ(n) на каждой итерации.",
  },
  {
    id: "analyze-code-practice-triangle",
    prompt: "Определите тесную оценку для зависимой границы внутреннего цикла.",
    code: "for (int i = 0; i < n; ++i) {\n  for (int j = 0; j < i; ++j) {\n    inspect(i, j);\n  }\n}",
    codeCaption: "Внутренний цикл выполняется i раз, а не всегда n раз.",
    choices: [
      { id: "linear", label: "Θ(n)" },
      { id: "nlogn", label: "Θ(n log n)" },
      { id: "square", label: "Θ(n²)" },
    ],
    correctChoiceId: "square",
    explanation:
      "Сумма 0 + 1 + … + (n − 1) равна n(n − 1) / 2, поэтому рост квадратичный.",
  },
  {
    id: "analyze-code-practice-halving",
    prompt: "Какова тесная оценка этого фрагмента с делением пополам?",
    code: "for (int i = 0; i < n; ++i) {\n  for (int j = n; j > 1; j /= 2) {\n    inspect(i, j);\n  }\n}",
    codeCaption: "Внешний цикл линейный, внутренний каждый раз делит j на 2.",
    choices: [
      { id: "linear", label: "Θ(n)" },
      { id: "nlogn", label: "Θ(n log n)" },
      { id: "square", label: "Θ(n²)" },
    ],
    correctChoiceId: "nlogn",
    explanation:
      "Для каждой из n внешних итераций внутренний цикл выполняет Θ(log n) шагов.",
  },
];
