import type { LessonSlug } from "@/entities/lesson";
import {
  ExperimentTable,
  experimentSourceMetadata,
  getGuidedAssignment,
  runGuidedExperiment,
} from "@/features/run-experiment";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { Button } from "@/shared/ui";
import { QuadraticComparison } from "./quadratic-comparison";

export const initialGuidedAttempt = {
  choice: "",
  phase: "prediction",
  repeating: false,
} satisfies GuidedAttempt;

export type GuidedAttempt = {
  choice: string;
  phase: "prediction" | "experiment" | "result";
  repeating: boolean;
};

export function GuidedExperiment({
  slug,
  attempt,
  onAttemptChange,
}: {
  slug: LessonSlug;
  attempt: GuidedAttempt;
  onAttemptChange: (attempt: GuidedAttempt) => void;
}) {
  const assignment = getGuidedAssignment(slug);
  const { progress, completeAssignment, recordPrediction } =
    useLearningProgress();
  const { choice, phase, repeating } = attempt;
  const confirmed = phase !== "prediction";
  const ran = phase === "result";
  const completed =
    progress.completedAssignments.includes(assignment.id) ||
    progress.completedLessonSlugs.includes(slug);
  const savedChoice = progress.researchPredictions[assignment.id];
  const savedOption = assignment.choices.find(
    (item) => item.id === savedChoice,
  );
  const showSaved = completed && !repeating;
  const activeChoice = showSaved ? savedOption?.id : choice;
  const option = assignment.choices.find((item) => item.id === activeChoice);
  const results =
    ran || (showSaved && savedOption) ? runGuidedExperiment(slug) : [];
  const correctOption = assignment.choices.find(
    (item) => item.id === assignment.correctChoice,
  );

  return (
    <section>
      <h2 className="text-xl font-semibold">Исследование</h2>
      <p className="mt-3 text-sm text-text-secondary">
        {showSaved
          ? "Исследование завершено"
          : ran
            ? "3 из 3 · Результат"
            : confirmed
              ? "2 из 3 · Эксперимент"
              : "1 из 3 · Прогноз"}
      </p>
      <p className="mt-3 leading-7">{assignment.question}</p>
      {showSaved && !savedOption ? (
        <p className="mt-4 text-sm leading-6 text-text-secondary">
          Это задание было завершено ранее. Прежний ответ не сохранялся;
          повторите исследование, чтобы записать прогноз.
        </p>
      ) : null}
      {!showSaved && !confirmed ? (
        <>
          <fieldset className="mt-5 space-y-2">
            <legend className="mb-2 text-sm font-medium">Ваш прогноз</legend>
            {assignment.choices.map((item) => (
              <label
                key={item.id}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-strong bg-surface-raised px-4 py-3 text-sm"
              >
                <input
                  type="radio"
                  name={`prediction-${assignment.id}`}
                  className="size-4 shrink-0 accent-[#4cc9a6]"
                  checked={choice === item.id}
                  onChange={() =>
                    onAttemptChange({ ...attempt, choice: item.id })
                  }
                />
                {item.label}
              </label>
            ))}
          </fieldset>
          <Button
            type="button"
            className="mt-5 w-full sm:w-auto"
            disabled={!choice}
            onClick={() => onAttemptChange({ ...attempt, phase: "experiment" })}
          >
            Подтвердить прогноз
          </Button>
        </>
      ) : null}
      {!showSaved && confirmed && !ran ? (
        <div className="mt-5">
          <p className="text-sm leading-6">Ваш прогноз: {option?.label}</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {experimentSourceMetadata[assignment.config.source].description}{" "}
            Размеры входа — от {assignment.config.minSize} до{" "}
            {assignment.config.maxSize}.
          </p>
          <Button
            type="button"
            className="mt-5 w-full sm:w-auto"
            onClick={() => onAttemptChange({ ...attempt, phase: "result" })}
          >
            {assignment.config.source === "theoretical"
              ? "Рассчитать модель"
              : "Запустить эксперимент"}
          </Button>
        </div>
      ) : null}
      {results.map((result, index) => (
        <div
          key={result.config.targetPosition}
          className="mt-5 rounded-lg border border-border p-4"
        >
          {results.length > 1 ? (
            <h3 className="font-medium">
              {index === 0 ? "Первый элемент" : "Элемент отсутствует"}
            </h3>
          ) : null}
          <p className="text-xs leading-5 text-accent">{result.disclosure}</p>
          {slug === "linear-and-quadratic" ? (
            <QuadraticComparison result={result} />
          ) : null}
          <ExperimentTable result={result} compact />
        </div>
      ))}
      {(ran || (showSaved && savedOption)) && option ? (
        <div
          className={`mt-5 border-l-2 p-4 text-sm leading-6 ${option.id === assignment.correctChoice ? "border-accent bg-accent/8" : "border-error bg-error/8"}`}
          aria-live="polite"
        >
          <p>
            <strong>Ваш прогноз:</strong> {option.label}
          </p>
          <p className="mt-2">
            <strong>Результат:</strong> {correctOption?.label}
          </p>
          <p className="mt-2">
            <strong>
              {option.id === assignment.correctChoice
                ? "Прогноз подтвердился."
                : "Прогноз не подтвердился."}
            </strong>{" "}
            {assignment.explanation}
          </p>
        </div>
      ) : null}
      {!showSaved && ran ? (
        <Button
          type="button"
          className="mt-5 w-full sm:w-auto"
          onClick={() => {
            recordPrediction(assignment.id, choice);
            completeAssignment(assignment.id);
            onAttemptChange(initialGuidedAttempt);
          }}
        >
          Завершить исследование
        </Button>
      ) : null}
      {showSaved ? (
        <Button
          type="button"
          variant="secondary"
          className="mt-5 w-full sm:w-auto"
          onClick={() =>
            onAttemptChange({ ...initialGuidedAttempt, repeating: true })
          }
        >
          Повторить исследование
        </Button>
      ) : null}
    </section>
  );
}
