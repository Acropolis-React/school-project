import type { LessonSlug } from "@/entities/lesson";
import {
  ExperimentTable,
  runGuidedExperiment,
} from "@/features/run-experiment";

export function InterpretationResults({ slug }: { slug: LessonSlug }) {
  const results = runGuidedExperiment(slug);

  return (
    <section
      className="mt-6 border-y border-border py-4"
      aria-label="Результаты исследования"
    >
      <h3 className="font-semibold">Данные исследования</h3>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Результаты воспроизведены с настройками предыдущего шага. Входные данные
        и подсчёт детерминированы; время выполнения не измеряется.
      </p>
      {results.map((result, index) => (
        <div key={result.config.targetPosition} className="mt-4">
          {results.length > 1 ? (
            <h4 className="text-sm font-medium">
              {index === 0 ? "Первый элемент" : "Элемент отсутствует"}
            </h4>
          ) : null}
          <ExperimentTable result={result} />
        </div>
      ))}
    </section>
  );
}
