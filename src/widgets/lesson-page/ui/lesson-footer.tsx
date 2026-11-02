import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, ButtonLink } from "@/shared/ui";

type LessonFooterProps = {
  step: number;
  practicePassed: boolean;
  onStepChange: (step: number) => void;
  onFinish: () => void;
};

export function LessonFooter({
  step,
  practicePassed,
  onStepChange,
  onFinish,
}: LessonFooterProps) {
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-border pt-5">
      <Button
        type="button"
        variant="secondary"
        disabled={step === 0}
        onClick={() => onStepChange(step - 1)}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Назад</span>
      </Button>
      {step < 4 ? (
        <Button type="button" onClick={() => onStepChange(step + 1)}>
          Далее <ArrowRight size={16} />
        </Button>
      ) : practicePassed ? (
        <ButtonLink href="/learn" onClick={onFinish}>
          Завершить урок <CheckCircle2 size={16} />
        </ButtonLink>
      ) : (
        <span className="text-right text-xs leading-5 text-text-muted">
          Ответьте верно,
          <br />
          чтобы завершить урок
        </span>
      )}
    </footer>
  );
}
