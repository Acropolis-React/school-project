"use client";

import { ArrowRight, FlaskConical, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  describeExploration,
  describeExplorationDetails,
  formatExplorationDate,
  type SavedExploration,
} from "@/features/manage-saved-explorations";
import { Button, ButtonLink } from "@/shared/ui";

type SavedExplorationsReportProps = {
  items: SavedExploration[];
  storageError: string | null;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function SavedExplorationsReport({
  items,
  storageError,
  onRemove,
  onClear,
}: SavedExplorationsReportProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <section
      className="border border-border bg-surface p-5 sm:p-6"
      aria-labelledby="saved-progress-heading"
    >
      <div className="flex items-start gap-3">
        <FlaskConical className="mt-0.5 shrink-0 text-accent" size={20} />
        <div className="min-w-0 flex-1">
          <h2 id="saved-progress-heading" className="text-lg font-semibold">
            Сохранённые исследования
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Конфигурации хранятся только в этом браузере. Дата ниже означает
            момент обновления записи, а не время выполнения алгоритма.
          </p>
        </div>
      </div>
      {storageError ? (
        <p
          role="alert"
          className="mt-4 border-l-2 border-error bg-error/8 p-3 text-sm text-error"
        >
          {storageError}
        </p>
      ) : null}
      {items.length === 0 ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm leading-6 text-text-secondary">
            Пока ничего не сохранено. Соберите сравнение в лаборатории и
            сохраните его текущую конфигурацию.
          </p>
          <ButtonLink href="/lab" variant="secondary" className="mt-4">
            Открыть лабораторию <ArrowRight size={15} />
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs font-medium text-accent">
                    {describeExploration(item.config)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    {describeExplorationDetails(item.config)} · обновлено{" "}
                    {formatExplorationDate(item.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <ButtonLink
                    href={`/lab?exploration=${encodeURIComponent(item.id)}`}
                    variant="secondary"
                    className="flex-1 sm:flex-none"
                  >
                    Открыть <ArrowRight size={15} />
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-border-strong bg-app text-text-secondary hover:border-error hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Удалить исследование «${item.title}»`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {confirmClear ? (
            <div className="mt-4 border-l-2 border-error bg-error/8 p-4">
              <p className="text-sm leading-6 text-text-primary">
                Удалить все сохранённые исследования? Это действие нельзя
                отменить.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                >
                  Удалить все
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmClear(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmClear(true)}
              className="mt-3"
            >
              <Trash2 size={15} />
              Удалить все сохранённые
            </Button>
          )}
        </>
      )}
    </section>
  );
}
