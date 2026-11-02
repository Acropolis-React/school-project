"use client";

import { useLearningProgress } from "@/features/track-lesson-progress";
import { CourseProgressHeading } from "./course-progress-heading";
import { LessonList } from "./lesson-list";

export function LearnPage() {
  const { progress } = useLearningProgress();

  return (
    <div className="space-y-7">
      <CourseProgressHeading completed={progress.completedLessonSlugs.length} />
      <LessonList progress={progress} />
    </div>
  );
}
