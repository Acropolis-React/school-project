import { useState } from "react";
import { codeTraceExercise } from "@/entities/lesson";
import { getGuidedAssignment } from "@/features/run-experiment";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { Button } from "@/shared/ui";
import { QuestionBlock, type QuestionState } from "./question-block";

export function CodeTraceStep({
  state,
  onStateChange,
}: {
  state: QuestionState;
  onStateChange: (state: QuestionState) => void;
}) {
  const { progress, completeAssignment } = useLearningProgress();
  const [repeating, setRepeating] = useState(false);
  const assignment = getGuidedAssignment("analyze-code");
  const completed =
    progress.completedAssignments.includes(assignment.id) ||
    progress.completedLessonSlugs.includes("analyze-code");
  if (completed && !state.submitted && !repeating) {
    return (
      <section>
        <h2 className="text-xl font-semibold">Практика: проследите код</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Этот шаг был выполнен ранее. Ответ для новой задачи ещё не сохранён.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-5"
          onClick={() => setRepeating(true)}
        >
          Решить задачу
        </Button>
      </section>
    );
  }
  return (
    <QuestionBlock
      lessonSlug="analyze-code"
      question={codeTraceExercise}
      heading="Практика: проследите код"
      state={state}
      onStateChange={onStateChange}
      onCorrect={() => completeAssignment(assignment.id)}
    />
  );
}
