import type { Lesson } from "@/entities/lesson";
import { LessonPage } from "@/widgets/lesson-page";

export function LessonView({ lesson }: { lesson: Lesson }) {
  return <LessonPage lesson={lesson} />;
}
