"use client";

import { useEffect, useState } from "react";
import { bonusGuide, getCoreCourseProgress } from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { ButtonLink } from "@/shared/ui";
import { CourseProgressHeading } from "./course-progress-heading";
import { LessonList } from "./lesson-list";

export function LearnPage() {
  const { progress, hydrated } = useLearningProgress();
  const { completed, unlocked } = getCoreCourseProgress(
    progress.completedLessonSlugs,
  );
  const [announced, setAnnounced] = useState(false);
  useEffect(() => {
    if (!hydrated || !unlocked) return;
    if (sessionStorage.getItem("algolab-guide-unlocked") === "1") {
      sessionStorage.removeItem("algolab-guide-unlocked");
      setAnnounced(true);
    }
  }, [hydrated, unlocked]);

  return (
    <div className="space-y-7">
      <CourseProgressHeading completed={completed} />
      {announced ? (
        <output className="border-l-2 border-accent pl-4 text-sm leading-6">
          Все 7 основных уроков завершены. Открыт бонусный урок — Повторение
          курса.
        </output>
      ) : null}
      <LessonList progress={progress} />
      {hydrated && unlocked ? (
        <section className="grid gap-4 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-xs font-semibold text-accent">
              Бонус · необязательно
            </p>
            <h2 className="mt-1 font-semibold">{bonusGuide.title}</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {bonusGuide.description}
            </p>
          </div>
          <ButtonLink href={`/learn/${bonusGuide.slug}`} variant="secondary">
            Открыть справочник
          </ButtonLink>
        </section>
      ) : null}
    </div>
  );
}
