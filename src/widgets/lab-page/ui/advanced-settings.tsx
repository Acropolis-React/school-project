import {
  inputDistributionOptions,
  operationMetricOptions,
  targetPositionOptions,
} from "@/features/run-experiment";
import { defaultConfig, type LabConfig } from "../model/lab-config";
import { InstrumentedSettings } from "./instrumented-settings";

type AdvancedSettingsProps = {
  draft: LabConfig;
  hasBinarySearch: boolean;
  onConfigChange: (patch: Partial<LabConfig>) => void;
};

export function AdvancedSettings({
  draft,
  hasBinarySearch,
  onConfigChange,
}: AdvancedSettingsProps) {
  const instrumented = draft.source === "instrumented";
  const summary = [
    draft.samples !== defaultConfig.samples ? `Точек: ${draft.samples}` : null,
    instrumented && draft.distribution !== defaultConfig.distribution
      ? `Вход: ${inputDistributionOptions.find((option) => option.id === draft.distribution)?.label}`
      : null,
    instrumented && draft.metric !== defaultConfig.metric
      ? `Метрика: ${operationMetricOptions.find((option) => option.id === draft.metric)?.shortLabel}`
      : null,
    instrumented &&
    Number.isFinite(draft.seed) &&
    draft.seed !== defaultConfig.seed
      ? `Seed: ${draft.seed}`
      : null,
    instrumented &&
    draft.family === "search" &&
    draft.targetPosition !== defaultConfig.targetPosition
      ? `Цель: ${targetPositionOptions.find((option) => option.id === draft.targetPosition)?.label}`
      : null,
  ].filter(Boolean);

  return (
    <details className="group mt-4 border-t border-border pt-2">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Дополнительные настройки
        {summary.length > 0 ? (
          <span className="mt-1 block text-xs font-normal leading-5 text-text-secondary group-open:hidden">
            Изменено: {summary.join(" · ")}
          </span>
        ) : null}
      </summary>
      <div className="space-y-4 pb-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="samples">
            Количество точек
          </label>
          <select
            id="samples"
            value={draft.samples}
            onChange={(event) =>
              onConfigChange({ samples: Number(event.target.value) })
            }
            className="mt-2 min-h-11 w-full rounded-lg border border-border-strong bg-app px-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {[5, 7, 10, 12].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        {instrumented ? (
          <InstrumentedSettings
            draft={draft}
            hasBinarySearch={hasBinarySearch}
            onConfigChange={onConfigChange}
          />
        ) : null}
      </div>
    </details>
  );
}
