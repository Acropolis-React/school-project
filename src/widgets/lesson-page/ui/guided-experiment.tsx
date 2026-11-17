import { useState } from "react";
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

export function GuidedExperiment({ slug }: { slug: LessonSlug }) {
  const assignment = getGuidedAssignment(slug);
  const { progress, completeAssignment, recordPrediction } =
    useLearningProgress();
  const [choice, setChoice] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [ran, setRan] = useState(false);
  const [repeating, setRepeating] = useState(false);
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
            <legend className="mb-2 text-sm font-medium">
              Выберите прогноз
            </legend>
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
                  onChange={() => setChoice(item.id)}
                />
                {item.label}
              </label>
            ))}
          </fieldset>
          <Button
            type="button"
            className="mt-5 w-full sm:w-auto"
            disabled={!choice}
            onClick={() => setConfirmed(true)}
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
            Размеры: {assignment.config.minSize}–{assignment.config.maxSize}.
          </p>
          <Button
            type="button"
            className="mt-5 w-full sm:w-auto"
            onClick={() => setRan(true)}
          >
            Провести эксперимент
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
          <ExperimentTable result={result} />
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
            setRepeating(false);
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
          onClick={() => {
            setChoice("");
            setConfirmed(false);
            setRan(false);
            setRepeating(true);
          }}
        >
          Повторить исследование
        </Button>
      ) : null}
    </section>
  );
}
