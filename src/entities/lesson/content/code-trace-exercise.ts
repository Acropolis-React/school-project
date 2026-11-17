import type { LessonQuestion } from "../model/types";

export const codeTraceExercise: LessonQuestion = {
  id: "code-trace-exercise",
  prompt: "Сколько раз вызовется inspect при n = 10?",
  code: "for (int i = 1; i < 10; i *= 2) {\n  for (int j = 0; j < 10; ++j) {\n    inspect(i, j);\n  }\n}",
  choices: [
    { id: "30", label: "30 вызовов" },
    { id: "100", label: "100 вызовов" },
    { id: "40", label: "40 вызовов" },
  ],
  correctChoiceId: "40",
  explanation:
    "i принимает значения 1, 2, 4 и 8: четыре внешних прохода по десять вызовов, всего 4 · 10 = 40.",
};
