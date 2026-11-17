import {
  type ExperimentPreset,
  experimentPresets,
} from "../model/experiment-presets";

type ExperimentPresetsProps = {
  onSelect: (preset: ExperimentPreset) => void;
};

export function ExperimentPresets({ onSelect }: ExperimentPresetsProps) {
  return (
    <details className="border-y border-border">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Готовые эксперименты
      </summary>
      <p className="mt-1 text-xs leading-5 text-text-muted">
        Выберите пример: настройки и результаты загрузятся сразу, затем их можно
        изменить.
      </p>
      <ul className="mt-3 divide-y divide-border">
        {experimentPresets.map((preset) => (
          <li
            key={preset.id}
            className="flex items-center justify-between gap-3 py-3 sm:gap-5"
          >
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-text-primary">
                {preset.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                {preset.objective}
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                onSelect(preset);
                const disclosure = event.currentTarget.closest("details");
                if (disclosure) {
                  disclosure.open = false;
                  disclosure.querySelector("summary")?.focus();
                }
              }}
              aria-label={`Загрузить: ${preset.title}`}
              className="min-h-11 shrink-0 rounded-lg border border-border-strong bg-app px-3 text-sm text-text-primary hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4"
            >
              Загрузить
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
