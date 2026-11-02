import { ArrowRight, Check } from "lucide-react";
import { lessons } from "@/entities/lesson";
import { ButtonLink } from "@/shared/ui";

type CourseProgressSummaryProps = {
  completedLessonSlugs: string[];
};

export function CourseProgressSummary({
  completedLessonSlugs,
}: CourseProgressSummaryProps) {
  const completed = completedLessonSlugs.length;
  const coursePercent = Math.round((completed / lessons.length) * 100);

  return (
    <section
      className="border-t border-border pt-5"
      aria-labelledby="progress-heading"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="progress-heading" className="text-lg font-semibold">
            Прогресс курса
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {completed} из {lessons.length} уроков завершено
          </p>
        </div>
        <span className="font-mono text-sm text-accent">{coursePercent}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${coursePercent}%` }}
        />
      </div>
      <ol className="mt-5 space-y-1">
        {lessons.slice(0, 3).map((lesson) => {
          const done = completedLessonSlugs.includes(lesson.slug);
          return (
            <li
              key={lesson.slug}
              className="flex items-center gap-3 border-b border-border/70 py-3 text-sm last:border-0"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${done ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-text-muted"}`}
              >
                {done ? <Check size={13} /> : lesson.number}
              </span>
              <span className="flex-1 font-medium">{lesson.title}</span>
              <span className="text-xs text-text-muted">{lesson.duration}</span>
            </li>
          );
        })}
      </ol>
      <ButtonLink href="/learn" variant="ghost" className="mt-3 px-0">
        Открыть весь курс <ArrowRight size={15} />
      </ButtonLink>
    </section>
  );
}
