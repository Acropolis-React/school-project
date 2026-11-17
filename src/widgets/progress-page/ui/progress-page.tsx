"use client";

import {
  getAnswerStats,
  getLatestMistakes,
} from "@/entities/learning-progress";
import { getCoreCourseProgress } from "@/entities/lesson";
import { useSavedExplorations } from "@/features/manage-saved-explorations";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { PageHeader } from "@/shared/ui";
import { LessonProgressList } from "./lesson-progress-list";
import { MistakeReview } from "./mistake-review";
import { ProgressEmptyState } from "./progress-empty-state";
import { ProgressSummary } from "./progress-summary";
import { ResetProgressCard } from "./reset-progress-card";
import { SavedExplorationsReport } from "./saved-explorations-report";

export function ProgressPage() {
  const { progress, hydrated, resetProgress } = useLearningProgress();
  const savedExplorations = useSavedExplorations();
  const { completed } = getCoreCourseProgress(progress.completedLessonSlugs);
  const answerStats = getAnswerStats(progress.answers);
  const mistakes = getLatestMistakes(progress.answers);
  const isEmpty = completed === 0 && progress.answers.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Прогресс"
        description="Ваши результаты сохраняются локально в этом браузере и не синхронизируются между устройствами."
      />
      {!hydrated || !savedExplorations.hydrated ? (
        <output
          className="h-32 animate-pulse rounded-xl border border-border-strong bg-surface"
          aria-label="Загрузка прогресса"
        />
      ) : (
        <>
          {isEmpty ? (
            <ProgressEmptyState />
          ) : (
            <>
              <ProgressSummary
                completed={completed}
                answerStats={answerStats}
                unresolvedMistakes={mistakes.length}
              />
              <LessonProgressList progress={progress} />
              {progress.answers.length > 0 ? (
                <MistakeReview mistakes={mistakes} />
              ) : null}
            </>
          )}
          <SavedExplorationsReport
            items={savedExplorations.items}
            storageError={savedExplorations.storageError}
            onRemove={savedExplorations.remove}
            onClear={savedExplorations.clear}
          />
          {!isEmpty ? <ResetProgressCard onReset={resetProgress} /> : null}
        </>
      )}
    </div>
  );
}
