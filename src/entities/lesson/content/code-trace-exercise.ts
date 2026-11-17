import type { LessonQuestion } from "../model/types";

export const codeTraceExercise: LessonQuestion = {
  id: "code-trace-exercise",
  prompt:
    "При n = 10 сколько раз вызовется inspect? Считайте, что каждый вызов выполняется за постоянное время.",
  code: "for (int i = 1; i < 10; i *= 2) {\n  for (int j = 0; j < 10; ++j) {\n    inspect(i, j);\n  }\n}",
  choices: [
    { id: "40", label: "40 вызовов" },
    { id: "30", label: "30 вызовов" },
    { id: "100", label: "100 вызовов" },
  ],
  correctChoiceId: "40",
  explanation:
    "i принимает значения 1, 2, 4 и 8: четыре внешних прохода по десять вызовов, всего 4 · 10 = 40.",
};
