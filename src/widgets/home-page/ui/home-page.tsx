"use client";

import { lessons } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { ContinueLearningCard } from "./continue-learning-card";
import { CourseProgressSummary } from "./course-progress-summary";
import { HomeHeader } from "./home-header";
import { LabCard } from "./lab-card";

export function HomePage() {
  const { progress, hydrated } = useLearningProgress();
  const hasCompletedFirstLesson = progress.completedLessonSlugs.includes(
    lessons[0].slug,
  );
  const lastLesson =
    lessons.find((lesson) => lesson.slug === progress.lastLessonSlug) ??
    lessons[0];
  const lastIndex = lessons.findIndex(
    (lesson) => lesson.slug === lastLesson.slug,
  );
  const currentLesson = progress.completedLessonSlugs.includes(lastLesson.slug)
    ? (lessons
        .slice(lastIndex + 1)
        .find(
          (lesson) => !progress.completedLessonSlugs.includes(lesson.slug),
        ) ??
      lessons.find(
        (lesson) => !progress.completedLessonSlugs.includes(lesson.slug),
      ) ??
      lastLesson)
    : lastLesson;
  const currentStep = progress.lessonSteps[currentLesson.slug] ?? 0;

  return (
    <div className="space-y-10">
      <HomeHeader
        hydrated={hydrated}
        hasCompletedFirstLesson={hasCompletedFirstLesson}
      />
      <ContinueLearningCard
        lesson={currentLesson}
        currentStep={currentStep}
        hydrated={hydrated}
        hasCompletedFirstLesson={hasCompletedFirstLesson}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.55fr)] lg:gap-12">
        <CourseProgressSummary
          completedLessonSlugs={progress.completedLessonSlugs}
        />
        <LabCard />
      </div>
    </div>
  );
}
