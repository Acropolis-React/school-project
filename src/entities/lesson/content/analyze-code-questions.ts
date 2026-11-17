import type { LessonQuestion } from "../model/types";

export const analyzeCodePractice: LessonQuestion[] = [
  {
    id: "analyze-code-practice-n-log-n",
    prompt: "Какова тесная оценка числа вызовов inspect при увеличении n?",
    code: "for (int i = 1; i < n; i *= 3) {\n  for (int j = 0; j < n; ++j) {\n    inspect(i, j);\n  }\n}",
    choices: [
      { id: "nlogn", label: "Θ(n log n)" },
      { id: "linear", label: "Θ(n)" },
      { id: "square", label: "Θ(n²)" },
    ],
    correctChoiceId: "nlogn",
    explanation:
      "i утраивается, пока не достигнет n. Это Θ(log n) внешних итераций. Каждая даёт n вызовов, поэтому всего Θ(n log n).",
  },
  {
    id: "analyze-code-practice-triangle",
    prompt: "Определите тесную оценку для зависимой границы внутреннего цикла.",
    code: "for (int i = 0; i < n; ++i) {\n  for (int j = 0; j < i; ++j) {\n    inspect(i, j);\n  }\n}",
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
    choices: [
      { id: "linear", label: "Θ(n)" },
      { id: "nlogn", label: "Θ(n log n)" },
      { id: "square", label: "Θ(n²)" },
    ],
    correctChoiceId: "nlogn",
    explanation:
      "Каждый раз j начинается с n и делится на 2 до единицы. Внутренний цикл даёт Θ(log n) шагов, и таких запусков n. Всего Θ(n log n).",
  },
];
