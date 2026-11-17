import type {
  ExperimentTargetPosition,
  InputDistribution,
  OperationMetric,
} from "@/entities/experiment";
import {
  inputDistributionOptions,
  operationMetricOptions,
  targetPositionOptions,
} from "@/features/run-experiment";
import type { LabConfig } from "../model/lab-config";

type InstrumentedSettingsProps = {
  draft: LabConfig;
  hasBinarySearch: boolean;
  onConfigChange: (patch: Partial<LabConfig>) => void;
};

const controlClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border-strong bg-app px-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function isInputDistribution(value: string): value is InputDistribution {
  return inputDistributionOptions.some((option) => option.id === value);
}

function isOperationMetric(value: string): value is OperationMetric {
  return operationMetricOptions.some((option) => option.id === value);
}

function isTargetPosition(value: string): value is ExperimentTargetPosition {
  return targetPositionOptions.some((option) => option.id === value);
}

export function InstrumentedSettings({
  draft,
  hasBinarySearch,
  onConfigChange,
}: InstrumentedSettingsProps) {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="distribution">
            Распределение входа
          </label>
          <select
            id="distribution"
            value={draft.distribution}
            onChange={(event) => {
              if (isInputDistribution(event.target.value))
                onConfigChange({ distribution: event.target.value });
            }}
            className={controlClass}
          >
            {inputDistributionOptions.map((option) => (
              <option
                key={option.id}
                value={option.id}
                disabled={hasBinarySearch && option.id !== "sorted"}
              >
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            {hasBinarySearch
              ? "Для бинарного поиска зафиксирован отсортированный вход."
              : inputDistributionOptions.find(
                  (option) => option.id === draft.distribution,
                )?.explanation}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="metric">
            Метрика операций
          </label>
          <select
            id="metric"
            value={draft.metric}
            onChange={(event) => {
              if (isOperationMetric(event.target.value))
                onConfigChange({ metric: event.target.value });
            }}
            className={controlClass}
          >
            {operationMetricOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            {
              operationMetricOptions.find(
                (option) => option.id === draft.metric,
              )?.explanation
            }
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="seed">
            Начальное значение (seed)
          </label>
          <input
            id="seed"
            type="number"
            min="0"
            max="4294967295"
            value={draft.seed}
            onChange={(event) =>
              onConfigChange({ seed: Number(event.target.value) })
            }
            className={`${controlClass} font-mono`}
          />
          <p className="mt-1 text-xs leading-5 text-text-muted">
            Тот же seed и конфигурация дают те же массивы и результаты.
          </p>
        </div>
        {draft.family === "search" ? (
          <div>
            <label
              className="block text-sm font-medium"
              htmlFor="target-position"
            >
              Положение искомого значения
            </label>
            <select
              id="target-position"
              value={draft.targetPosition}
              onChange={(event) => {
                if (isTargetPosition(event.target.value))
                  onConfigChange({ targetPosition: event.target.value });
              }}
              className={controlClass}
            >
              {targetPositionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </>
  );
}
