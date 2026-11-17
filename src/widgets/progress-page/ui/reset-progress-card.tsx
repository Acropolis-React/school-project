"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/ui";

export function ResetProgressCard({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section
      className="rounded-xl border border-border bg-surface/70 p-5"
      aria-labelledby="reset-heading"
    >
      <h2 id="reset-heading" className="font-semibold">
        Управление данными
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Сброс удалит завершённые уроки и историю ответов из этого браузера.
        Действие нельзя отменить.
      </p>
      {confirming ? (
        <div className="mt-4 border-l-2 border-error bg-error/8 p-4">
          <p className="text-sm leading-6 text-text-primary">
            Подтвердите удаление прогресса и истории ответов. Сохранённые
            исследования останутся на месте.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onReset();
                setConfirming(false);
              }}
            >
              Удалить прогресс
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirming(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setConfirming(true)}
          className="mt-4"
        >
          <RotateCcw size={15} />
          Сбросить прогресс
        </Button>
      )}
    </section>
  );
}
