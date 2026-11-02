export type LessonSlug =
  | "what-is-big-o"
  | "linear-and-quadratic"
  | "logarithmic"
  | "n-log-n"
  | "input-cases"
  | "analyze-code";

export type LessonChoice = {
  id: string;
  label: string;
};

export type LessonQuestion = {
  prompt: string;
  choices: LessonChoice[];
  correctChoiceId: string;
  explanation: string;
};

export type Lesson = {
  slug: LessonSlug;
  number: number;
  title: string;
  description: string;
  duration: string;
  theory: string[];
  code: string;
  codeCaption: string;
  hypothesis: LessonQuestion;
  experimentModels: ["linear" | "logarithmic" | "linearithmic", "quadratic"];
  interpretation: string[];
  practice: LessonQuestion;
};

export const LESSON_STEPS = [
  "Теория",
  "Гипотеза",
  "Эксперимент",
  "Интерпретация",
  "Практика",
] as const;

export const isLessonSlug = (value: string): value is LessonSlug =>
  [
    "what-is-big-o",
    "linear-and-quadratic",
    "logarithmic",
    "n-log-n",
    "input-cases",
    "analyze-code",
  ].includes(value);
