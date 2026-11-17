import { RotateCcw } from "lucide-react";
import { algorithmFamilies } from "@/entities/algorithm";
import type {
  ComparisonSubject,
  ExperimentAlgorithmFamily,
  ExperimentSource,
} from "@/entities/experiment";
import {
  type ExperimentSeriesDefinition,
  experimentSourceMetadata,
} from "@/features/run-experiment";
import { Button } from "@/shared/ui";
import type { LabConfig } from "../model/lab-config";
import { AdvancedSettings } from "./advanced-settings";

type ExperimentSettingsProps = {
  draft: LabConfig;
  availableSeries: ExperimentSeriesDefinition[];
  maxInputSize: number;
  error: string;
  isPending: boolean;
  onSourceChange: (source: ExperimentSource) => void;
  onSubjectChange: (subject: ComparisonSubject) => void;
  onFamilyChange: (family: ExperimentAlgorithmFamily) => void;
  onToggleSeries: (id: string) => void;
  onConfigChange: (patch: Partial<LabConfig>) => void;
  onApply: () => void;
  onReset: () => void;
};

function isAlgorithmFamily(value: string): value is ExperimentAlgorithmFamily {
  return value === "search" || value === "sorting";
}

const controlClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border-strong bg-app px-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ExperimentSettings({
  draft,
  availableSeries,
  maxInputSize,
  error,
  isPending,
  onSourceChange,
  onSubjectChange,
  onFamilyChange,
  onToggleSeries,
  onConfigChange,
  onApply,
  onReset,
}: ExperimentSettingsProps) {
  const hasBinarySearch = draft.selectedIds.includes("binary-search");
  const isInstrumented = draft.source === "instrumented";

  return (
    <aside
      className="min-w-0 border-b border-border pb-6 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5"
      aria-labelledby="settings-heading"
    >
      <h2 id="settings-heading" className="text-base font-semibold">
        Настройки исследования
      </h2>
      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Источник данных</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["theoretical", "instrumented"] as const).map((source) => (
            <button
              key={source}
              type="button"
              aria-pressed={draft.source === source}
              onClick={() => onSourceChange(source)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${draft.source === source ? "border-accent bg-accent/10 text-text-primary" : "border-border-strong bg-app text-text-secondary hover:bg-surface-raised"}`}
            >
              {experimentSourceMetadata[source].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-text-muted">
          {experimentSourceMetadata[draft.source].description}
        </p>
      </fieldset>

      {!isInstrumented ? (
        <fieldset className="mt-5 border-t border-border pt-5">
          <legend className="text-sm font-medium">Что сравниваем</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["algorithms", "complexities"] as const).map((subject) => (
              <button
                key={subject}
                type="button"
                aria-pressed={draft.subject === subject}
                onClick={() => onSubjectChange(subject)}
                className={`min-h-11 rounded-lg border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${draft.subject === subject ? "border-accent bg-accent/10 text-text-primary" : "border-border-strong bg-app text-text-secondary hover:bg-surface-raised"}`}
              >
                {subject === "algorithms" ? "Алгоритмы" : "Классы Big O"}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {draft.subject === "algorithms" ? (
        <div className="mt-5">
          <label className="block text-sm font-medium" htmlFor="family">
            Семейство алгоритмов
          </label>
          <select
            id="family"
            value={draft.family}
            onChange={(event) => {
              if (isAlgorithmFamily(event.target.value))
                onFamilyChange(event.target.value);
            }}
            className={controlClass}
          >
            {algorithmFamilies.map((family) => (
              <option key={family.id} value={family.id}>
                {family.id === "search" ? "Поиск" : "Сортировка"}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">
          {draft.subject === "algorithms" ? "Алгоритмы" : "Модели сложности"}
        </legend>
        {draft.subject === "algorithms" && draft.family === "sorting" ? (
          <p className="mt-2 text-xs leading-5 text-text-secondary">
            <button
              type="button"
              onClick={() =>
                onConfigChange({ selectedIds: ["bubble-sort", "merge-sort"] })
              }
              className="mt-1 block min-h-11 text-left text-accent underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
            >
              Выбрать рекомендуемую пару
            </button>
          </p>
        ) : null}
        <div className="mt-3 space-y-1.5">
          {availableSeries.map((series) => (
            <label
              key={series.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-text-secondary hover:bg-surface-raised hover:text-text-primary"
            >
              <input
                type="checkbox"
                className="size-4 rounded accent-[#4cc9a6]"
                checked={draft.selectedIds.includes(series.id)}
                onChange={() => onToggleSeries(series.id)}
              />
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: series.color }}
              />
              <span className="min-w-0">
                <span className="block text-text-primary">{series.label}</span>
                <span className="font-mono text-xs text-text-muted">
                  {series.complexity}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 border-t border-border pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium" htmlFor="min-size">
              Минимум n
            </label>
            <input
              id="min-size"
              type="number"
              min="1"
              max={maxInputSize - 1}
              value={Number.isNaN(draft.minSize) ? "" : draft.minSize}
              onChange={(event) =>
                onConfigChange({ minSize: event.target.valueAsNumber })
              }
              className={`${controlClass} font-mono`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="max-size">
              Максимум n
            </label>
            <input
              id="max-size"
              type="number"
              min="2"
              max={maxInputSize}
              value={Number.isNaN(draft.maxSize) ? "" : draft.maxSize}
              onChange={(event) =>
                onConfigChange({ maxSize: event.target.valueAsNumber })
              }
              className={`${controlClass} font-mono`}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Безопасный предел для выбранных алгоритмов:{" "}
          {maxInputSize.toLocaleString("ru-RU")}.
        </p>
      </div>

      {isInstrumented && hasBinarySearch ? (
        <p className="mt-2 text-xs leading-5 text-text-muted">
          Для бинарного поиска нужен отсортированный вход.
        </p>
      ) : null}
      <AdvancedSettings
        draft={draft}
        hasBinarySearch={hasBinarySearch}
        onConfigChange={onConfigChange}
      />

      {error ? (
        <p
          role="alert"
          className="mt-4 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={onApply}
        disabled={isPending}
        className="mt-5 w-full"
      >
        {isPending
          ? "Обновляем…"
          : experimentSourceMetadata[draft.source].action}
      </Button>
      <Button
        type="button"
        onClick={onReset}
        variant="ghost"
        className="mt-2 w-full"
      >
        <RotateCcw size={15} />
        Сбросить настройки
      </Button>
    </aside>
  );
}
