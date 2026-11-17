"use client";

import { bonusGuide, getCoreCourseProgress, lessons } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { ButtonLink } from "@/shared/ui";
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
      {hydrated &&
      getCoreCourseProgress(progress.completedLessonSlugs).unlocked ? (
        <section
          className="border-t border-border pt-6"
          aria-labelledby="bonus-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Бонус
          </p>
          <h2 id="bonus-heading" className="mt-2 text-lg font-semibold">
            {bonusGuide.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {bonusGuide.description}
          </p>
          <ButtonLink
            href={`/learn/${bonusGuide.slug}`}
            variant="secondary"
            className="mt-4"
          >
            Открыть справочник
          </ButtonLink>
        </section>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.55fr)] lg:gap-12">
        <CourseProgressSummary
          completedLessonSlugs={progress.completedLessonSlugs}
        />
        <LabCard />
      </div>
    </div>
  );
}
