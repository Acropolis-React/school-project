import type { AnswerRecord } from "./progress";

export type AnswerStats = {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number | null;
};

export function getAnswerStats(answers: AnswerRecord[]): AnswerStats {
  const correct = answers.reduce(
    (count, answer) => count + Number(answer.correct),
    0,
  );
  return {
    total: answers.length,
    correct,
    incorrect: answers.length - correct,
    accuracy:
      answers.length > 0 ? Math.round((correct / answers.length) * 100) : null,
  };
}

export function getLatestMistakes(answers: AnswerRecord[]): AnswerRecord[] {
  const latestByQuestion = new Map<string, AnswerRecord>();

  for (const answer of answers) {
    if (answer.questionId) {
      latestByQuestion.set(`${answer.lessonSlug}:${answer.questionId}`, answer);
    }
  }

  return Array.from(latestByQuestion.values())
    .filter((answer) => !answer.correct)
    .sort(
      (left, right) =>
        Date.parse(right.answeredAt) - Date.parse(left.answeredAt),
    );
}
