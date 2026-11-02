import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { LearningProgress } from "@/entities/learning-progress";
import { lessons } from "@/entities/lesson";
import { ButtonLink } from "@/shared/ui";

export function LessonProgressList({
  progress,
}: {
  progress: LearningProgress;
}) {
  return (
    <section aria-labelledby="lessons-progress-heading">
      <h2 id="lessons-progress-heading" className="text-lg font-semibold">
        Уроки
      </h2>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {lessons.map((lesson) => {
          const done = progress.completedLessonSlugs.includes(lesson.slug);
          const step = progress.lessonSteps[lesson.slug];
          return (
            <li
              key={lesson.slug}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
            >
              {done ? (
                <CheckCircle2 className="shrink-0 text-accent" size={20} />
              ) : (
                <Circle className="shrink-0 text-text-muted" size={20} />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{lesson.title}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {done
                    ? "Завершён"
                    : step === undefined
                      ? "Не начат"
                      : `Остановились на шаге ${step + 1} из 5`}
                </p>
              </div>
              <ButtonLink
                href={`/learn/${lesson.slug}`}
                variant="ghost"
                className="w-full sm:w-auto"
              >
                {done
                  ? "Повторить"
                  : step === undefined
                    ? "Начать"
                    : "Продолжить"}
                <ArrowRight size={15} />
              </ButtonLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
