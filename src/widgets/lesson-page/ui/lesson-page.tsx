"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { LessonFooter } from "./lesson-footer";
import { LessonHeader } from "./lesson-header";
import { LessonStepContent } from "./lesson-step-content";
import type { QuestionKind, QuestionState } from "./question-block";

const initialQuestionStates: Record<QuestionKind, QuestionState> = {
  hypothesis: { choice: "", submitted: false },
  practice: { choice: "", submitted: false },
};

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { progress, hydrated, visitStep, completeLesson } =
    useLearningProgress();
  const [step, setStep] = useState(progress.lessonSteps[lesson.slug] ?? 0);
  const [practicePassed, setPracticePassed] = useState(
    progress.completedLessonSlugs.includes(lesson.slug),
  );
  const [questionStates, setQuestionStates] = useState(initialQuestionStates);
  const initializedLessonSlug = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || initializedLessonSlug.current === lesson.slug) return;

    initializedLessonSlug.current = lesson.slug;
    setStep(progress.lessonSteps[lesson.slug] ?? 0);
    setPracticePassed(progress.completedLessonSlugs.includes(lesson.slug));
    setQuestionStates(initialQuestionStates);
  }, [
    hydrated,
    lesson.slug,
    progress.completedLessonSlugs,
    progress.lessonSteps,
  ]);

  const goTo = (nextStep: number) => {
    const bounded = Math.max(0, Math.min(4, nextStep));
    setStep(bounded);
    visitStep(lesson.slug, bounded);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateQuestionState = (kind: QuestionKind, state: QuestionState) => {
    setQuestionStates((current) => ({ ...current, [kind]: state }));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <ArrowLeft size={16} />
        Назад к курсу
      </Link>
      <LessonHeader lesson={lesson} step={step} onStepChange={goTo} />
      <LessonStepContent
        lesson={lesson}
        step={step}
        questionStates={questionStates}
        onQuestionStateChange={updateQuestionState}
        onPracticePassed={() => setPracticePassed(true)}
      />
      <LessonFooter
        step={step}
        practicePassed={practicePassed}
        onStepChange={goTo}
        onFinish={() => completeLesson(lesson.slug)}
      />
    </div>
  );
}
