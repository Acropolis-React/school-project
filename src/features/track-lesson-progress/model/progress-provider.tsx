"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AnswerRecord,
  clearProgress,
  emptyProgress,
  type LearningProgress,
  readProgress,
  writeProgress,
} from "@/entities/learning-progress";

type ProgressContextValue = {
  progress: LearningProgress;
  hydrated: boolean;
  visitStep: (lessonSlug: string, step: number) => void;
  recordAnswer: (
    lessonSlug: string,
    questionId: string,
    choiceId: string,
    correct: boolean,
  ) => void;
  completeLesson: (lessonSlug: string) => void;
  completeAssignment: (assignmentId: string) => void;
  recordPrediction: (assignmentId: string, choice: string) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function retainAnswers(answers: AnswerRecord[]): AnswerRecord[] {
  if (answers.length <= 200) return answers;
  const protectedIndexes = new Set<number>();
  const seen = new Set<string>();
  answers.forEach((answer, index) => {
    if (!answer.correct || !answer.questionId || !answer.choiceId) return;
    const key = JSON.stringify([answer.lessonSlug, answer.questionId]);
    if (!seen.has(key)) {
      seen.add(key);
      protectedIndexes.add(index);
    }
  });
  const retained = new Set(protectedIndexes);
  for (
    let index = answers.length - 1;
    index >= 0 && retained.size < 200;
    index -= 1
  ) {
    retained.add(index);
  }
  return answers.filter((_, index) => retained.has(index)).slice(-200);
}

export function LearningProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setHydrated(true);
  }, []);

  const commit = useCallback(
    (update: (current: LearningProgress) => LearningProgress) => {
      setProgress((current) => {
        const next = update(current);
        writeProgress(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      visitStep: (lessonSlug, step) => {
        commit((current) => ({
          ...current,
          lastLessonSlug: lessonSlug,
          lessonSteps: {
            ...current.lessonSteps,
            [lessonSlug]: step,
          },
        }));
      },
      recordAnswer: (lessonSlug, questionId, choiceId, correct) => {
        commit((current) => ({
          ...current,
          answers: retainAnswers([
            ...current.answers,
            {
              lessonSlug,
              questionId,
              choiceId,
              correct,
              answeredAt: new Date().toISOString(),
            },
          ]),
        }));
      },
      completeLesson: (lessonSlug) => {
        commit((current) => ({
          ...current,
          completedLessonSlugs: current.completedLessonSlugs.includes(
            lessonSlug,
          )
            ? current.completedLessonSlugs
            : [...current.completedLessonSlugs, lessonSlug],
        }));
      },
      recordPrediction: (assignmentId, choice) => {
        commit((current) => ({
          ...current,
          researchPredictions: {
            ...current.researchPredictions,
            [assignmentId]: choice,
          },
        }));
      },
      completeAssignment: (assignmentId) => {
        commit((current) => ({
          ...current,
          completedAssignments: current.completedAssignments.includes(
            assignmentId,
          )
            ? current.completedAssignments
            : [...current.completedAssignments, assignmentId],
        }));
      },
      resetProgress: () => {
        clearProgress();
        setProgress(emptyProgress);
      },
    }),
    [commit, hydrated, progress],
  );

  return <ProgressContext value={value}>{children}</ProgressContext>;
}

export function useLearningProgress(): ProgressContextValue {
  const context = use(ProgressContext);
  if (!context)
    throw new Error(
      "useLearningProgress must be used within LearningProgressProvider",
    );
  return context;
}
