import { lessons } from "@/entities/lesson";
import { PageHeader } from "@/shared/ui";

export function CourseProgressHeading({ completed }: { completed: number }) {
  return (
    <PageHeader
      title="Курс"
      description="Короткие уроки: от смысла Big O до анализа незнакомого кода."
      aside={
        <div className="min-w-52">
          <p className="text-xs text-text-secondary">
            {completed}/{lessons.length} основных уроков завершено
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-track">
            <div
              className="h-full bg-accent"
              style={{ width: `${(completed / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      }
    />
  );
}
