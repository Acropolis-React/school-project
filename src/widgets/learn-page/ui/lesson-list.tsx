import { ArrowRight, Check, Clock3 } from "lucide-react";
import type { LearningProgress } from "@/entities/learning-progress";
import { lessons } from "@/entities/lesson";
import { ButtonLink } from "@/shared/ui";

export function LessonList({ progress }: { progress: LearningProgress }) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {lessons.map((lesson) => {
        const done = progress.completedLessonSlugs.includes(lesson.slug);
        const started = progress.lessonSteps[lesson.slug] !== undefined;
        const status = done ? "Завершён" : started ? "В процессе" : "Не начат";

        return (
          <li
            key={lesson.slug}
            className="group grid gap-4 py-5 transition-colors sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:px-3 sm:hover:bg-surface/60"
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${done ? "border-accent/50 bg-accent/10 text-accent" : started ? "border-accent text-text-primary" : "border-border-strong text-text-secondary"}`}
            >
              {done ? <Check size={17} /> : lesson.number}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-semibold text-text-primary">
                  {lesson.title}
                </h2>
                <span
                  className={`text-xs font-medium ${done ? "text-accent" : "text-text-muted"}`}
                >
                  {status}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {lesson.description}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-text-muted">
                <Clock3 size={13} />
                {lesson.duration}
              </span>
            </div>
            <ButtonLink
              href={`/learn/${lesson.slug}`}
              variant={started && !done ? "primary" : "secondary"}
              className="w-full sm:w-auto"
            >
              {done ? "Повторить" : started ? "Продолжить" : "Начать"}
              <ArrowRight size={15} />
            </ButtonLink>
          </li>
        );
      })}
    </ol>
  );
}
