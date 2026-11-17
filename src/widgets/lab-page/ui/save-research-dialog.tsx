import { useRef } from "react";
import { Button, ButtonLink } from "@/shared/ui";
import type { ResearchFields } from "../model/lab-config";

type SaveResearchDialogProps = {
  hydrated: boolean;
  storageError: string | null;
  researchError: string;
  research: ResearchFields;
  editingId: string | null;
  onResearchChange: (patch: Partial<ResearchFields>) => void;
  onPersist: () => boolean;
  onCancelEditing: () => void;
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-border-strong bg-app px-3 py-2.5 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function SaveResearchDialog({
  hydrated,
  storageError,
  researchError,
  research,
  editingId,
  onResearchChange,
  onPersist,
  onCancelEditing,
}: SaveResearchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="border-t border-border pt-4">
      <div ref={triggerRef} className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          disabled={!hydrated}
        >
          {editingId ? "Изменить исследование" : "Сохранить исследование"}
        </Button>
        <ButtonLink href="/progress#saved-progress-heading" variant="secondary">
          Мои исследования
        </ButtonLink>
      </div>
      {editingId ? (
        <p className="mt-2 text-xs text-text-secondary">
          Редактируется сохранённая запись «{research.title}».
        </p>
      ) : null}
      {storageError ? (
        <p role="alert" className="mt-3 text-sm text-error">
          {storageError}
        </p>
      ) : null}
      <dialog
        ref={dialogRef}
        onClose={() => triggerRef.current?.querySelector("button")?.focus()}
        aria-labelledby="save-dialog-heading"
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-border bg-surface p-5 text-text-primary backdrop:bg-black/70 sm:p-6"
      >
        <h2 id="save-dialog-heading" className="text-lg font-semibold">
          {editingId ? "Обновить исследование" : "Сохранить исследование"}
        </h2>
        <p className="mt-2 text-xs leading-5 text-text-secondary">
          Сохраняются показанная конфигурация и заметки; результаты
          воспроизводятся по настройкам и seed. В браузере хранится до 20
          записей; при добавлении новой после достижения лимита самая старая
          запись удаляется.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (onPersist()) dialogRef.current?.close();
          }}
        >
          <label
            className="mt-4 block text-sm font-medium"
            htmlFor="research-title"
          >
            Название исследования
          </label>
          <input
            autoFocus
            id="research-title"
            value={research.title}
            maxLength={80}
            onChange={(event) =>
              onResearchChange({ title: event.target.value })
            }
            className={fieldClass}
          />
          <label
            className="mt-4 block text-sm font-medium"
            htmlFor="hypothesis"
          >
            Гипотеза <span className="text-text-muted">(необязательно)</span>
          </label>
          <textarea
            id="hypothesis"
            value={research.hypothesis}
            maxLength={2000}
            rows={2}
            onChange={(event) =>
              onResearchChange({ hypothesis: event.target.value })
            }
            className={fieldClass}
          />
          <label
            className="mt-4 block text-sm font-medium"
            htmlFor="conclusion"
          >
            Вывод <span className="text-text-muted">(необязательно)</span>
          </label>
          <textarea
            id="conclusion"
            value={research.conclusion}
            maxLength={2000}
            rows={2}
            onChange={(event) =>
              onResearchChange({ conclusion: event.target.value })
            }
            className={fieldClass}
          />
          {researchError ? (
            <p role="alert" className="mt-3 text-sm text-error">
              {researchError}
            </p>
          ) : null}
          {storageError ? (
            <p role="alert" className="mt-3 text-sm text-error">
              {storageError}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="submit">
              {editingId ? "Сохранить изменения" : "Сохранить"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Отмена
            </Button>
            {editingId ? (
              <Button type="button" variant="ghost" onClick={onCancelEditing}>
                Новая запись
              </Button>
            ) : null}
          </div>
        </form>
      </dialog>
    </div>
  );
}
