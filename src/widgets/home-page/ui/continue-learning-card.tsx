import { ArrowRight } from "lucide-react";
import type { Lesson } from "@/entities/lesson";
import { ButtonLink } from "@/shared/ui";

type ContinueLearningCardProps = {
  lesson: Lesson;
  currentStep: number;
  hydrated: boolean;
  hasCompletedFirstLesson: boolean;
};

export function ContinueLearningCard({
  lesson,
  currentStep,
  hydrated,
  hasCompletedFirstLesson,
}: ContinueLearningCardProps) {
  const isReturningLearner = hydrated && hasCompletedFirstLesson;

  return (
    <section
      className="border-y border-border py-6 sm:py-8"
      aria-labelledby="continue-heading"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              {isReturningLearner ? "Продолжить обучение" : "Начать обучение"}
            </p>
          </div>
          <h2
            id="continue-heading"
            className="mt-4 text-2xl font-bold tracking-tight sm:text-[2rem]"
          >
            {lesson.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {lesson.description}
          </p>
          <div className="mt-5 flex max-w-md items-center gap-3">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-track"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-text-secondary">
              Шаг {currentStep + 1} из 5
            </span>
          </div>
        </div>
        <ButtonLink
          href={`/learn/${lesson.slug}`}
          className="w-full px-6 lg:min-w-40 lg:w-auto"
        >
          {hydrated && currentStep > 0 ? "Продолжить урок" : "Начать урок"}
          <ArrowRight size={16} />
        </ButtonLink>
      </div>
    </section>
  );
}
