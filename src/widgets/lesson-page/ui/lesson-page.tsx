"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
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
  const [passedQuestionIds, setPassedQuestionIds] = useState<string[]>([]);
  const [questionStates, setQuestionStates] = useState(() =>
    createInitialQuestionStates(lesson),
  );
  const initializedLessonSlug = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || initializedLessonSlug.current === lesson.slug) return;

    initializedLessonSlug.current = lesson.slug;
    setStep(progress.lessonSteps[lesson.slug] ?? 0);
    setPassedQuestionIds([]);
    setQuestionStates(createInitialQuestionStates(lesson));
  }, [hydrated, lesson, progress.lessonSteps]);

  const goTo = (nextStep: number) => {
    const bounded = Math.max(0, Math.min(4, nextStep));
    setStep(bounded);
    visitStep(lesson.slug, bounded);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateQuestionState = (questionId: string, state: QuestionState) => {
    setQuestionStates((current) => ({ ...current, [questionId]: state }));
  };

  const markQuestionPassed = (questionId: string) => {
    setPassedQuestionIds((current) =>
      current.includes(questionId) ? current : [...current, questionId],
    );
  };

  const practicePassed =
    progress.completedLessonSlugs.includes(lesson.slug) ||
    lesson.practice.every((question) =>
      passedQuestionIds.includes(question.id),
    );

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
        onQuestionPassed={markQuestionPassed}
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
