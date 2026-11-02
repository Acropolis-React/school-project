import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui";

export function ResetProgressCard({ onReset }: { onReset: () => void }) {
  return (
    <section
      className="border border-border bg-surface p-5"
      aria-labelledby="reset-heading"
    >
      <h2 id="reset-heading" className="font-semibold">
        Управление данными
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Сброс удалит завершённые уроки и историю ответов из этого браузера.
        Действие нельзя отменить.
      </p>
      <Button
        type="button"
        variant="secondary"
        onClick={onReset}
        className="mt-4"
      >
        <RotateCcw size={15} />
        Сбросить прогресс
      </Button>
    </section>
  );
}
