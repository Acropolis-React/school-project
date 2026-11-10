import { BookmarkPlus, FolderOpen, Trash2 } from "lucide-react";
import {
  describeExploration,
  formatExplorationDate,
  type SavedExploration,
} from "@/features/manage-saved-explorations";
import { Button } from "@/shared/ui";

type SavedExplorationsPanelProps = {
  items: SavedExploration[];
  hydrated: boolean;
  storageError: string | null;
  onSave: () => void;
  onOpen: (item: SavedExploration) => void;
  onRemove: (id: string) => void;
};

export function SavedExplorationsPanel({
  items,
  hydrated,
  storageError,
  onSave,
  onOpen,
  onRemove,
}: SavedExplorationsPanelProps) {
  return (
    <section
      className="border border-border bg-surface p-4 sm:p-5"
      aria-labelledby="saved-explorations-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="saved-explorations-heading" className="font-semibold">
            Сохранённые исследования
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-text-muted">
            Сохраняется компактная конфигурация. Теоретические значения
            рассчитываются заново и всегда остаются детерминированными.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onSave}
          disabled={!hydrated}
          className="w-full shrink-0 sm:w-auto"
        >
          <BookmarkPlus size={16} />
          Сохранить текущее
        </Button>
      </div>
      {storageError ? (
        <p
          role="alert"
          className="mt-4 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
        >
          {storageError}
        </p>
      ) : null}
      {!hydrated ? (
        <output
          className="mt-4 block h-16 animate-pulse rounded-lg bg-surface-raised"
          aria-label="Загрузка сохранённых исследований"
        />
      ) : items.length === 0 ? (
        <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-text-secondary">
          Сохранённых конфигураций пока нет. Настройте сравнение, постройте его
          и сохраните результат для повторного открытия.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {describeExploration(item.config)}
                </p>
                <p className="mt-1 text-xs leading-5 text-text-muted">
                  n: {item.config.minSize}–{item.config.maxSize} · точек:{" "}
                  {item.config.samples} · сохранено{" "}
                  {formatExplorationDate(item.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpen(item)}
                  className="flex-1 sm:flex-none"
                >
                  <FolderOpen size={15} />
                  Открыть
                </Button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-border-strong bg-app text-text-secondary hover:border-error hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={`Удалить: ${describeExploration(item.config)}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
