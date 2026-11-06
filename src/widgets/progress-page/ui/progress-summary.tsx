import { lessons } from "@/entities/lesson";

type ProgressSummaryProps = {
  completed: number;
  correct: number;
  answerCount: number;
};

export function ProgressSummary({
  completed,
  correct,
  answerCount,
}: ProgressSummaryProps) {
  const accuracy =
    answerCount > 0 ? Math.round((correct / answerCount) * 100) : null;
  const completionPercent = Math.round((completed / lessons.length) * 100);

  return (
    <section
      className="grid gap-6 rounded-xl border border-border-strong bg-surface p-5 shadow-[0_4px_12px_rgba(0,0,0,0.16)] sm:grid-cols-2 sm:p-6"
      aria-label="Сводка прогресса"
    >
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-text-secondary">Курс завершён</p>
            <p className="mt-1 text-3xl font-bold">
              {completed}{" "}
              <span className="text-base font-normal text-text-muted">
                из {lessons.length}
              </span>
            </p>
          </div>
          <span className="font-mono text-accent">{completionPercent}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-track">
          <div
            className="h-full bg-accent"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
      <div className="border-t border-border pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <p className="text-sm text-text-secondary">Точность ответов</p>
        {accuracy === null ? (
          <p className="mt-2 text-sm text-text-muted">
            Пока нет проверенных ответов.
          </p>
        ) : (
          <>
            <p className="mt-1 text-3xl font-bold">{accuracy}%</p>
            <p className="mt-1 text-xs text-text-muted">
              {correct} верных из {answerCount} попыток
            </p>
          </>
        )}
      </div>
    </section>
  );
}
