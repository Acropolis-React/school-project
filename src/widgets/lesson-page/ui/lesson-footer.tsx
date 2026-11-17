import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, ButtonLink } from "@/shared/ui";

type LessonFooterProps = {
  step: number;
  practicePassed: boolean;
  canContinue: boolean;
  onStepChange: (step: number) => void;
  onFinish: () => void;
};

export function LessonFooter({
  step,
  practicePassed,
  canContinue,
  onStepChange,
  onFinish,
}: LessonFooterProps) {
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-border pt-5">
      <Button
        type="button"
        variant="secondary"
        disabled={step === 0}
        aria-label="Предыдущий шаг"
        onClick={() => onStepChange(step - 1)}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Назад</span>
      </Button>
      {step < 4 ? (
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            disabled={!canContinue}
            aria-describedby={!canContinue ? "step-locked-hint" : undefined}
            onClick={() => onStepChange(step + 1)}
          >
            Далее <ArrowRight size={16} />
          </Button>
          {!canContinue ? (
            <p
              id="step-locked-hint"
              className="text-right text-xs text-text-muted"
            >
              Выполните задание, чтобы продолжить.
            </p>
          ) : null}
        </div>
      ) : practicePassed ? (
        <ButtonLink href="/learn" onClick={onFinish}>
          Завершить урок <CheckCircle2 size={16} />
        </ButtonLink>
      ) : (
        <span className="text-right text-xs leading-5 text-text-muted">
          Ответьте верно на все вопросы практики, чтобы завершить урок.
        </span>
      )}
    </footer>
  );
}
