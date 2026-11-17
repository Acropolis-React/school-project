import { useState } from "react";
import type { LessonSlug } from "@/entities/lesson";
import {
  ExperimentTable,
  evaluateGuidedConclusion,
  experimentSourceMetadata,
  getGuidedAssignment,
  type LabExperimentResult,
  runGuidedExperiment,
} from "@/features/run-experiment";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { Button } from "@/shared/ui";

export function GuidedExperiment({ slug }: { slug: LessonSlug }) {
  const assignment = getGuidedAssignment(slug);
  const { progress, completeAssignment } = useLearningProgress();
  const [results, setResults] = useState<LabExperimentResult[]>([]);
  const [hypothesis, setHypothesis] = useState("");
  const [choice, setChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const completed =
    progress.completedAssignments.includes(assignment.id) ||
    progress.completedLessonSlugs.includes(slug);
  const evaluation = submitted
    ? evaluateGuidedConclusion(assignment, choice)
    : null;

  const run = () => {
    setResults(runGuidedExperiment(slug));
    setSubmitted(false);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold">Исследование</h2>
      <p className="mt-3 text-text-primary">{assignment.question}</p>
      {completed ? (
        <p className="mt-3 text-sm text-accent">
          Задание уже выполнено. Повторять его не требуется.
        </p>
      ) : null}
      <label
        htmlFor="guided-hypothesis"
        className="mt-5 block text-sm font-medium"
      >
        Гипотеза
      </label>
      <p className="mt-1 text-sm text-text-secondary">
        {assignment.hypothesis}
      </p>
      <textarea
        id="guided-hypothesis"
        value={hypothesis}
        onChange={(event) => setHypothesis(event.target.value)}
        rows={2}
        className="mt-2 w-full rounded-lg border border-border-strong bg-app p-3 text-sm"
        placeholder="Запишите своё предположение"
      />
      <p className="mt-4 text-xs leading-5 text-text-muted">
        {experimentSourceMetadata[assignment.config.source].description}{" "}
        Размеры: {assignment.config.minSize}–{assignment.config.maxSize}, точек:{" "}
        {assignment.config.samples}.
      </p>
      <Button
        type="button"
        onClick={run}
        disabled={!hypothesis.trim() && !completed}
        className="mt-4"
      >
        Выполнить исследование
      </Button>
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
          <p className="text-xs text-accent">{result.disclosure}</p>
          <ExperimentTable result={result} />
        </div>
      ))}
      {results.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">Интерпретация и вывод</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {assignment.conclusion}
          </p>
          <fieldset className="mt-3 space-y-2">
            <legend className="sr-only">Выберите вывод</legend>
            {assignment.choices.map((item) => (
              <label
                key={item.id}
                className="flex min-h-11 items-center gap-3 rounded-lg border border-border-strong p-3 text-sm"
              >
                <input
                  className="size-4 shrink-0 accent-[#4cc9a6]"
                  type="radio"
                  name={`guided-${assignment.id}`}
                  checked={choice === item.id}
                  onChange={() => {
                    setChoice(item.id);
                    setSubmitted(false);
                  }}
                />
                {item.label}
              </label>
            ))}
          </fieldset>
          <Button
            type="button"
            disabled={!choice || submitted}
            onClick={() => {
              const answer = evaluateGuidedConclusion(assignment, choice);
              setSubmitted(true);
              if (answer.correct) completeAssignment(assignment.id);
            }}
            className="mt-4 w-full sm:w-auto"
          >
            Проверить вывод
          </Button>
          {evaluation ? (
            <output
              className={`mt-4 block border-l-2 p-4 text-sm leading-6 text-text-primary ${evaluation.correct ? "border-accent bg-accent/8" : "border-error bg-error/8"}`}
            >
              {evaluation.correct
                ? "Верно. "
                : "Пока неверно. Попробуйте ещё раз. "}
              {evaluation.explanation}
            </output>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
