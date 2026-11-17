import type { Lesson } from "@/entities/lesson";
import { LessonPage } from "@/widgets/lesson-page";

export function LessonView({ lesson }: { lesson: Lesson }) {
  return <LessonPage key={lesson.slug} lesson={lesson} />;
}
