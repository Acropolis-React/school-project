import { LESSON_STEPS, type Lesson, lessons } from "@/entities/lesson";

type LessonHeaderProps = {
  lesson: Lesson;
  step: number;
  maxAccessibleStep: number;
  completedSteps: boolean[];
  onStepChange: (step: number) => void;
};

export function LessonHeader({
  lesson,
  step,
  maxAccessibleStep,
  completedSteps,
  onStepChange,
}: LessonHeaderProps) {
  return (
    <header className="mt-6 border-b border-border pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Урок {lesson.number} из {lessons.length}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {lesson.title}
          </h1>
        </div>
        <span className="text-sm text-text-secondary">
          Шаг {step + 1} из {LESSON_STEPS.length}
        </span>
      </div>
      <fieldset className="mt-5 grid grid-cols-5 gap-1.5">
        <legend className="sr-only">Прогресс урока: шаг {step + 1} из 5</legend>
        {LESSON_STEPS.map((label, index) => (
          <button
            key={label}
            type="button"
            disabled={index > maxAccessibleStep}
            aria-current={index === step ? "step" : undefined}
            aria-label={`${label}: ${index === step ? "текущий шаг" : index > maxAccessibleStep ? "закрыт" : completedSteps[index] || index < step ? "пройден" : "доступен"}`}
            title={`${label}: ${index === step ? "текущий шаг" : index > maxAccessibleStep ? "закрыт" : completedSteps[index] || index < step ? "пройден" : "доступен"}`}
            onClick={() => onStepChange(index)}
            className={`h-1.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${index === step ? "bg-accent ring-2 ring-accent/40" : index > maxAccessibleStep ? "cursor-not-allowed bg-track opacity-50" : completedSteps[index] || index < step ? "bg-accent/60" : "bg-text-secondary"}`}
          >
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </fieldset>
    </header>
  );
}
