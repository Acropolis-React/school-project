import { LESSON_STEPS, type Lesson } from "@/entities/lesson";

type LessonHeaderProps = {
  lesson: Lesson;
  step: number;
  onStepChange: (step: number) => void;
};

export function LessonHeader({
  lesson,
  step,
  onStepChange,
}: LessonHeaderProps) {
  return (
    <header className="mt-6 border-b border-border pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Урок {lesson.number} из 6
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
            title={label}
            onClick={() => onStepChange(index)}
            className={`h-1.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${index <= step ? "bg-accent" : "bg-track"}`}
          >
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </fieldset>
    </header>
  );
}
