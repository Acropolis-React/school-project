import type { LearningProgress } from "@/entities/learning-progress";
import type { Lesson, LessonQuestion } from "@/entities/lesson";
import { evaluateAnswer } from "@/features/answer-exercise";
import { getGuidedAssignment } from "@/features/run-experiment";

export function getLessonStepAccess(
  lesson: Lesson,
  progress: LearningProgress,
) {
  const completed = progress.completedLessonSlugs.includes(lesson.slug);
  const answeredCorrectly = (question: LessonQuestion) =>
    progress.answers.some(
      (answer) =>
        answer.lessonSlug === lesson.slug &&
        answer.questionId === question.id &&
        answer.correct &&
        answer.choiceId !== null &&
        evaluateAnswer(question, answer.choiceId).correct,
    );

  const hypothesisPassed =
    completed || !lesson.hypothesis || answeredCorrectly(lesson.hypothesis);
  const assignment = getGuidedAssignment(lesson.slug);
  const assignmentPassed =
    completed ||
    !assignment ||
    progress.completedAssignments.includes(assignment.id);
  const practicePassed = completed || lesson.practice.every(answeredCorrectly);
  const maxAccessibleStep = !hypothesisPassed ? 1 : !assignmentPassed ? 2 : 4;

  return {
    maxAccessibleStep,
    completedSteps: [
      completed,
      hypothesisPassed,
      assignmentPassed,
      completed,
      practicePassed,
    ],
    allRequiredPassed: hypothesisPassed && assignmentPassed && practicePassed,
  };
}
