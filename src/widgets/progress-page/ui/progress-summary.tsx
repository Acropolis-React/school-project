import type { AnswerStats } from "@/entities/learning-progress";
import { lessons } from "@/entities/lesson";

type ProgressSummaryProps = {
  completed: number;
  answerStats: AnswerStats;
  unresolvedMistakes: number;
};

export function ProgressSummary({
  completed,
  answerStats,
  unresolvedMistakes,
}: ProgressSummaryProps) {
  const completionPercent = Math.round((completed / lessons.length) * 100);

  return (
    <section
      className="grid gap-5 border-y border-border py-6 md:grid-cols-3 md:gap-6"
      aria-label="Сводка прогресса"
    >
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-text-secondary">Курс завершён</p>
            <p className="mt-1 font-mono text-2xl font-semibold">
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
      <div className="border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <p className="text-sm text-text-secondary">Точность ответов</p>
        {answerStats.accuracy === null ? (
          <p className="mt-2 text-sm text-text-muted">
            Пока нет проверенных ответов.
          </p>
        ) : (
          <>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {answerStats.accuracy}%
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {answerStats.correct} верных из {answerStats.total} попыток
            </p>
          </>
        )}
      </div>
      <div className="border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <p className="text-sm text-text-secondary">Нужно повторить</p>
        <p className="mt-1 font-mono text-2xl font-semibold">
          {unresolvedMistakes}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          вопросов с последним неверным ответом
        </p>
      </div>
    </section>
  );
}
