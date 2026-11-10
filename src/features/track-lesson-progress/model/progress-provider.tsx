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
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

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
          answers: [
            ...current.answers,
            {
              lessonSlug,
              questionId,
              choiceId,
              correct,
              answeredAt: new Date().toISOString(),
            },
          ].slice(-200),
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
