"use client";

import { useLearningProgress } from "@/features/track-lesson-progress";
import { PageHeader } from "@/shared/ui";
import { LessonProgressList } from "./lesson-progress-list";
import { ProgressEmptyState } from "./progress-empty-state";
import { ProgressSummary } from "./progress-summary";
import { ResetProgressCard } from "./reset-progress-card";

export function ProgressPage() {
  const { progress, hydrated, resetProgress } = useLearningProgress();
  const completed = progress.completedLessonSlugs.length;
  const correct = progress.answers.filter((answer) => answer.correct).length;
  const isEmpty = completed === 0 && progress.answers.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Прогресс"
        description="Ваши результаты сохраняются локально в этом браузере и не синхронизируются между устройствами."
      />
      {!hydrated ? (
        <output
          className="h-32 animate-pulse rounded-xl border border-border-strong bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.14)]"
          aria-label="Загрузка прогресса"
        />
      ) : isEmpty ? (
        <ProgressEmptyState />
      ) : (
        <>
          <ProgressSummary
            completed={completed}
            correct={correct}
            answerCount={progress.answers.length}
          />
          <LessonProgressList progress={progress} />
          <ResetProgressCard onReset={resetProgress} />
        </>
      )}
    </div>
  );
}
