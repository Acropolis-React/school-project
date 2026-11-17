"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import type { LearningProgress } from "@/entities/learning-progress";
import {
  codeTraceExercise,
  getCoreCourseProgress,
  type Lesson,
} from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { getLessonStepAccess } from "../model/step-access";
import { LessonFooter } from "./lesson-footer";
import { LessonHeader } from "./lesson-header";
import { LessonStepContent } from "./lesson-step-content";
import type { QuestionState } from "./question-block";

function createInitialQuestionStates(
  lesson: Lesson,
  progress?: LearningProgress,
) {
  return [
    lesson.hypothesis,
    ...lesson.practice,
    ...(lesson.slug === "analyze-code" ? [codeTraceExercise] : []),
  ].reduce<Record<string, QuestionState>>((states, question) => {
    const answer = progress?.answers.findLast(
      (item) =>
        item.lessonSlug === lesson.slug &&
        item.questionId === question.id &&
        question.choices.some((choice) => choice.id === item.choiceId),
    );
    states[question.id] = answer?.choiceId
      ? { choice: answer.choiceId, submitted: true }
      : { choice: "", submitted: false };
    return states;
  }, {});
}

function getReviewStep(lesson: Lesson, questionId: string) {
  if (questionId === lesson.hypothesis.id) return 1;
  if (lesson.slug === "analyze-code" && questionId === codeTraceExercise.id)
    return 2;
  if (lesson.practice.some((question) => question.id === questionId)) return 4;
}

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { progress, hydrated, visitStep, completeLesson } =
    useLearningProgress();
  const [step, setStep] = useState(progress.lessonSteps[lesson.slug] ?? 0);
  const [questionStates, setQuestionStates] = useState(() =>
    createInitialQuestionStates(lesson),
  );
  const access = getLessonStepAccess(lesson, progress);

  const restoreLesson = useEffectEvent(() => {
    const questionId = window.location.hash.slice(1);
    const reviewStep = getReviewStep(lesson, questionId);
    const savedStep = progress.lessonSteps[lesson.slug];
    const restoredStep = Math.min(
      reviewStep ?? savedStep ?? 0,
      access.maxAccessibleStep,
    );
    setStep(restoredStep);
    if (savedStep !== restoredStep || progress.lastLessonSlug !== lesson.slug)
      visitStep(lesson.slug, restoredStep);
    setQuestionStates(createInitialQuestionStates(lesson, progress));

    if (restoredStep === reviewStep) {
      const frame = requestAnimationFrame(() => {
        const question = document.getElementById(questionId);
        question?.focus({ preventScroll: true });
        question?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }
  });

  useEffect(() => {
    if (hydrated) return restoreLesson();
  }, [hydrated]);

  const goTo = (nextStep: number) => {
    if (!hydrated) return;
    const bounded = Math.max(
      0,
      Math.min(access.maxAccessibleStep, 4, nextStep),
    );
    setStep(bounded);
    visitStep(lesson.slug, bounded);
    if (window.location.hash)
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
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
          if (hydrated && access.allRequiredPassed) {
            const before = getCoreCourseProgress(progress.completedLessonSlugs);
            const after = getCoreCourseProgress([
              ...progress.completedLessonSlugs,
              lesson.slug,
            ]);
            if (!before.unlocked && after.unlocked)
              sessionStorage.setItem("algolab-guide-unlocked", "1");
            completeLesson(lesson.slug);
          }
        }}
      />
    </div>
  );
}
