import { BookmarkPlus, FolderOpen, Pencil, Trash2, X } from "lucide-react";
import {
  describeExploration,
  describeExplorationDetails,
  formatExplorationDate,
  type SavedExploration,
} from "@/features/manage-saved-explorations";
import { Button } from "@/shared/ui";
import type { ResearchFields } from "../model/lab-config";

type SavedExplorationsPanelProps = {
  items: SavedExploration[];
  hydrated: boolean;
  storageError: string | null;
  researchError: string;
  research: ResearchFields;
  editingId: string | null;
  onResearchChange: (patch: Partial<ResearchFields>) => void;
  onPersist: () => void;
  onCancelEditing: () => void;
  onOpen: (item: SavedExploration) => void;
  onRemove: (id: string) => void;
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-border-strong bg-app px-3 py-2.5 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function SavedExplorationsPanel({
  items,
  hydrated,
  storageError,
  researchError,
  research,
  editingId,
  onResearchChange,
  onPersist,
  onCancelEditing,
  onOpen,
  onRemove,
}: SavedExplorationsPanelProps) {
  return (
    <section
      className="border-y border-border"
      aria-labelledby="saved-explorations-heading"
    >
      <div className="py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="saved-explorations-heading" className="font-semibold">
              Исследовательская запись
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-text-muted">
              Сохраняются настройки и заметки, но не большие массивы. Результаты
              заново воспроизводятся по конфигурации и seed. В запись попадёт
              результат, показанный выше.
            </p>
          </div>
          {editingId ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-accent">
              <Pencil size={13} /> Редактирование сохранённой записи
            </span>
          ) : null}
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <label className="block text-sm font-medium" htmlFor="research-title">
            Название исследования
          </label>
          <input
            id="research-title"
            value={research.title}
            maxLength={80}
            onChange={(event) =>
              onResearchChange({ title: event.target.value })
            }
            placeholder="Например: Сортировки на почти упорядоченном массиве"
            className={fieldClass}
          />
          <div className="mt-1 text-right font-mono text-xs text-text-muted">
            {research.title.length}/80
          </div>

          <details className="mt-3 border-t border-border pt-3">
            <summary className="cursor-pointer text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent">
              Добавить гипотезу и вывод
            </summary>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="hypothesis"
                >
                  Гипотеза{" "}
                  <span className="text-text-muted">(необязательно)</span>
                </label>
                <textarea
                  id="hypothesis"
                  value={research.hypothesis}
                  maxLength={2_000}
                  rows={4}
                  onChange={(event) =>
                    onResearchChange({ hypothesis: event.target.value })
                  }
                  placeholder="Что, по вашему мнению, покажет сравнение?"
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  htmlFor="conclusion"
                >
                  Вывод <span className="text-text-muted">(необязательно)</span>
                </label>
                <textarea
                  id="conclusion"
                  value={research.conclusion}
                  maxLength={2_000}
                  rows={4}
                  onChange={(event) =>
                    onResearchChange({ conclusion: event.target.value })
                  }
                  placeholder="Что подтвердилось и как вы объясняете результат?"
                  className={fieldClass}
                />
              </div>
            </div>
          </details>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={onPersist}
              disabled={!hydrated}
              className="w-full sm:w-auto"
            >
              <BookmarkPlus size={16} />
              {editingId ? "Сохранить изменения" : "Сохранить исследование"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancelEditing}
                className="w-full sm:w-auto"
              >
                <X size={15} /> Новая запись
              </Button>
            ) : null}
          </div>
          {researchError ? (
            <p
              role="alert"
              className="mt-3 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
            >
              {researchError}
            </p>
          ) : null}
        </div>
      </div>

      {storageError ? (
        <p
          role="alert"
          className="mb-4 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
        >
          {storageError}
        </p>
      ) : null}

      <div className="border-t border-border py-5">
        <h3 className="text-sm font-semibold">Сохранённые исследования</h3>
        {!hydrated ? (
          <output
            className="mt-4 block h-16 animate-pulse rounded-lg bg-surface-raised"
            aria-label="Загрузка сохранённых исследований"
          />
        ) : items.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Сохранённых записей пока нет. Запустите сравнение, назовите его и
            сохраните воспроизводимую конфигурацию.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-accent">
                      {describeExploration(item.config)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      {describeExplorationDetails(item.config)} · обновлено{" "}
                      {formatExplorationDate(item.updatedAt)}
                    </p>
                    {item.hypothesis ? (
                      <p className="mt-2 text-xs leading-5 text-text-secondary">
                        <span className="font-medium text-text-primary">
                          Гипотеза:
                        </span>{" "}
                        {item.hypothesis}
                      </p>
                    ) : null}
                    {item.conclusion ? (
                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        <span className="font-medium text-text-primary">
                          Вывод:
                        </span>{" "}
                        {item.conclusion}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onOpen(item)}
                      className="flex-1 sm:flex-none"
                    >
                      <FolderOpen size={15} /> Открыть
                    </Button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-border-strong bg-app text-text-secondary hover:border-error hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label={`Удалить исследование «${item.title}»`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
