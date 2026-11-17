export type LessonSlug =
  | "what-is-big-o"
  | "linear-and-quadratic"
  | "same-complexity-different-costs"
  | "logarithmic"
  | "n-log-n"
  | "input-cases"
  | "analyze-code";

export type LessonChoice = {
  id: string;
  label: string;
};

export type LessonQuestion = {
  id: string;
  prompt: string;
  code?: string;
  codeCaption?: string;
  choices: LessonChoice[];
  correctChoiceId: string;
  explanation: string;
};

export type TheoryBlock =
  | { kind: "demonstration"; title: string }
  | { kind: "idea" | "section" | "note"; title: string; text: string }
  | {
      kind: "comparison" | "classes";
      title: string;
      text?: string;
      items: { label: string; detail: string }[];
    };

export type Lesson = {
  slug: LessonSlug;
  number: number;
  title: string;
  description: string;
  duration: string;
  theory: TheoryBlock[];
  code: string;
  codeCaption: string;
  hypothesis: LessonQuestion;
  experimentModels: [
    "linear" | "logarithmic" | "linearithmic",
    "linear" | "quadratic",
  ];
  interpretation: string[];
  takeaway: string;
  showModelChart?: boolean;
  practice: LessonQuestion[];
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
    "same-complexity-different-costs",
    "logarithmic",
    "n-log-n",
    "input-cases",
    "analyze-code",
  ].includes(value);
