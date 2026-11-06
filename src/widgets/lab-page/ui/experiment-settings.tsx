import { RotateCcw } from "lucide-react";
import { type AlgorithmFamily, algorithmFamilies } from "@/entities/algorithm";
import { Button } from "@/shared/ui";
import type {
  ComparisonMode,
  LabConfig,
  SeriesDefinition,
} from "../model/lab-config";

type ExperimentSettingsProps = {
  draft: LabConfig;
  availableSeries: SeriesDefinition[];
  error: string;
  onModeChange: (mode: ComparisonMode) => void;
  onFamilyChange: (family: AlgorithmFamily) => void;
  onToggleSeries: (id: string) => void;
  onConfigChange: (patch: Partial<LabConfig>) => void;
  onApply: () => void;
  onReset: () => void;
};

function isAlgorithmFamily(value: string): value is AlgorithmFamily {
  return value === "search" || value === "sorting";
}

export function ExperimentSettings({
  draft,
  availableSeries,
  error,
  onModeChange,
  onFamilyChange,
  onToggleSeries,
  onConfigChange,
  onApply,
  onReset,
}: ExperimentSettingsProps) {
  return (
    <aside
      className="border border-border bg-surface p-5"
      aria-labelledby="settings-heading"
    >
      <h2 id="settings-heading" className="text-base font-semibold">
        Настройки эксперимента
      </h2>
      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Что сравниваем</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["algorithms", "complexities"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={draft.mode === mode}
              onClick={() => onModeChange(mode)}
              className={`min-h-10 rounded-lg border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent ${draft.mode === mode ? "border-accent bg-accent/10 text-text-primary" : "border-border-strong bg-app text-text-secondary"}`}
            >
              {mode === "algorithms" ? "Алгоритмы" : "Классы Big O"}
            </button>
          ))}
        </div>
      </fieldset>
      {draft.mode === "algorithms" ? (
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
            className="mt-2 min-h-10 w-full rounded-lg border border-border-strong bg-app px-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-accent"
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
          {draft.mode === "algorithms" ? "Алгоритмы" : "Модели сложности"}
        </legend>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          Можно выбрать несколько вариантов для сравнения.
        </p>
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
                <span className="block truncate text-text-primary">
                  {series.label}
                </span>
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
            <p
              id="min-size-hint"
              className="mt-1 text-xs leading-4 text-text-muted"
            >
              Начальный размер входа.
            </p>
            <input
              id="min-size"
              aria-describedby="min-size-hint"
              type="number"
              min="1"
              max="490"
              value={draft.minSize}
              onChange={(event) =>
                onConfigChange({ minSize: Number(event.target.value) })
              }
              className="mt-2 min-h-10 w-full rounded-lg border border-border-strong bg-app px-3 font-mono text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="samples">
              Кол-во точек
            </label>
            <p
              id="samples-hint"
              className="mt-1 text-xs leading-4 text-text-muted"
            >
              Кол-во значений на графике.
            </p>
            <select
              id="samples"
              aria-describedby="samples-hint"
              value={draft.samples}
              onChange={(event) =>
                onConfigChange({ samples: Number(event.target.value) })
              }
              className="mt-2 min-h-10 w-full rounded-lg border border-border-strong bg-app px-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            >
              {[5, 7, 10, 12].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="mt-4 block text-sm font-medium" htmlFor="max-size">
          Максимум n
        </label>
        <p
          id="max-size-hint"
          className="mt-1 text-xs leading-4 text-text-muted"
        >
          Конечный размер входа.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            id="max-size"
            aria-describedby="max-size-hint"
            type="range"
            min="40"
            max="500"
            step="10"
            value={draft.maxSize}
            onChange={(event) =>
              onConfigChange({ maxSize: Number(event.target.value) })
            }
            className="min-w-0 flex-1 accent-[#4cc9a6]"
          />
          <output
            htmlFor="max-size"
            className="w-16 rounded-md border border-border-strong bg-app px-2 py-1.5 text-right font-mono text-xs"
          >
            {draft.maxSize}
          </output>
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          className="mt-4 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
      <Button type="button" onClick={onApply} className="mt-5 w-full">
        Построить сравнение
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
