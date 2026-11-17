"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { getLessonStepAccess } from "../model/step-access";
import { LessonFooter } from "./lesson-footer";
import { LessonHeader } from "./lesson-header";
import { LessonStepContent } from "./lesson-step-content";
import type { QuestionState } from "./question-block";

function createInitialQuestionStates(lesson: Lesson) {
  return [lesson.hypothesis, ...lesson.practice].reduce<
    Record<string, QuestionState>
  >((states, question) => {
    states[question.id] = { choice: "", submitted: false };
    return states;
  }, {});
}

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { progress, hydrated, visitStep, completeLesson } =
    useLearningProgress();
  const [step, setStep] = useState(progress.lessonSteps[lesson.slug] ?? 0);
  const [questionStates, setQuestionStates] = useState(() =>
    createInitialQuestionStates(lesson),
  );
  const initializedLessonSlug = useRef<string | null>(null);
  const access = getLessonStepAccess(lesson, progress);

  useEffect(() => {
    if (!hydrated || initializedLessonSlug.current === lesson.slug) return;

    initializedLessonSlug.current = lesson.slug;
    const savedStep = progress.lessonSteps[lesson.slug] ?? 0;
    const restoredStep = Math.min(savedStep, access.maxAccessibleStep);
    setStep(restoredStep);
    if (savedStep !== restoredStep) visitStep(lesson.slug, restoredStep);
    setQuestionStates(createInitialQuestionStates(lesson));
  }, [
    hydrated,
    lesson,
    progress.lessonSteps,
    access.maxAccessibleStep,
    visitStep,
  ]);

  const goTo = (nextStep: number) => {
    if (!hydrated) return;
    const bounded = Math.max(
      0,
      Math.min(access.maxAccessibleStep, 4, nextStep),
    );
    setStep(bounded);
    visitStep(lesson.slug, bounded);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateQuestionState = (questionId: string, state: QuestionState) => {
    setQuestionStates((current) => ({ ...current, [questionId]: state }));
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
      <LessonHeader
        lesson={lesson}
        step={step}
        maxAccessibleStep={hydrated ? access.maxAccessibleStep : 0}
        completedSteps={access.completedSteps}
        onStepChange={goTo}
      />
      <LessonStepContent
        lesson={lesson}
        step={step}
        questionStates={questionStates}
        practicePassed={hydrated && access.allRequiredPassed}
        onQuestionStateChange={updateQuestionState}
      />
      <LessonFooter
        step={step}
        practicePassed={hydrated && access.allRequiredPassed}
        canContinue={hydrated && step < access.maxAccessibleStep}
        onStepChange={goTo}
        onFinish={() => {
          if (hydrated && access.allRequiredPassed) completeLesson(lesson.slug);
        }}
      />
    </div>
  );
}
