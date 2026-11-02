import type { LessonQuestion } from "@/entities/lesson";

export type AnswerResult = {
  correct: boolean;
  explanation: string;
};

export function evaluateAnswer(
  question: LessonQuestion,
  choiceId: string,
): AnswerResult {
  return {
    correct: choiceId === question.correctChoiceId,
    explanation: question.explanation,
  };
}
