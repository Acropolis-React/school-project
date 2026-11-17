import {
  describeExploration,
  describeExplorationDetails,
} from "@/features/manage-saved-explorations";
import {
  experimentSourceMetadata,
  type LabExperimentResult,
  targetPositionOptions,
} from "@/features/run-experiment";
import { getPointComparison } from "../model/point-comparison";
import { PointComparison } from "./point-comparison";

type ExperimentResultsProps = {
  result: LabExperimentResult;
  inputSize: number | null;
  onInputSizeChange: (inputSize: number) => void;
};

export function ExperimentResults({
  result,
  inputSize,
  onInputSizeChange,
}: ExperimentResultsProps) {
  const point = result.points.at(-1);
  const comparison = getPointComparison(result, point?.inputSize ?? null);
  const format = (value: number) => value.toLocaleString("ru-RU");
  return (
    <section
      className="border-t border-border pt-4"
      aria-labelledby="interpret-heading"
    >
      <h2 id="interpret-heading" className="font-semibold">
        Анализ результата
      </h2>
      {point ? (
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          При n = {format(point.inputSize)}:{" "}
          {result.series
            .map((item) => `${item.label} — ${format(point[item.id])}`)
            .join("; ")}{" "}
          ({result.yAxisLabel.toLowerCase()}).
          {comparison?.complete
            ? ` Разница: ${format(comparison.difference)}.`
            : ""}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-5 text-text-muted">
        {experimentSourceMetadata[result.source].description} Одна точка не
        доказывает класс роста.
      </p>
      <details className="mt-4 border-t border-border">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent">
          Почему так происходит?
        </summary>
        <ul className="space-y-2 text-sm leading-6 text-text-secondary">
          {result.observations.map((observation) => (
            <li key={observation}>{observation}</li>
          ))}
        </ul>
        <div className="mt-4">
          {result.series.map((item) => (
            <div key={item.id} className="border-t border-border py-3">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium">{item.label}</h3>
                <span className="text-right font-mono text-xs text-accent">
                  {item.complexity}
                </span>
              </div>
              {item.formula ? (
                <p className="mt-1 font-mono text-xs text-text-primary">
                  f(n) = {item.formula}
                </p>
              ) : null}
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                {item.assumption}
              </p>
            </div>
          ))}
        </div>
        <PointComparison
          result={result}
          inputSize={inputSize}
          onInputSizeChange={onInputSizeChange}
        />
      </details>
      <details className="border-t border-border">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent">
          Методика и ограничения
        </summary>
        <p className="text-xs leading-5 text-text-secondary">
          {describeExploration(result.config)} ·{" "}
          {describeExplorationDetails(result.config)}
          {result.source === "instrumented" && result.config.family === "search"
            ? ` · цель: ${targetPositionOptions.find((option) => option.id === result.config.targetPosition)?.label}`
            : ""}
          .
        </p>
        <ul className="mt-3 list-disc space-y-2 pb-4 pl-4 text-xs leading-5 text-text-secondary">
          {result.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
