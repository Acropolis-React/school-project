import type { LabExperimentResult } from "@/features/run-experiment";

type ExperimentResultsProps = {
  result: LabExperimentResult;
};

export function ExperimentResults({ result }: ExperimentResultsProps) {
  const isInstrumented = result.source === "instrumented";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <section
        className="min-w-0 rounded-xl border border-border bg-surface"
        aria-labelledby="table-heading"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 id="table-heading" className="font-semibold">
            Точные значения точек
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            {isInstrumented
              ? `${result.yAxisLabel}. Повторный запуск совпадёт при неизменных настройках и seed.`
              : `${result.yAxisLabel}. Значения детерминированно вычислены по выбранным формулам.`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-right text-sm">
            <caption className="sr-only">{result.tableCaption}</caption>
            <thead className="bg-surface-raised text-xs text-text-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Размер n</th>
                {result.series.map((item) => (
                  <th
                    key={item.id}
                    className="px-4 py-3"
                    style={{ color: item.color }}
                  >
                    {item.shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {result.points.map((point) => (
                <tr
                  key={point.inputSize}
                  className="hover:bg-surface-raised/60"
                >
                  <th className="px-4 py-3 text-left font-mono font-normal text-text-secondary">
                    {point.inputSize.toLocaleString("ru-RU")}
                  </th>
                  {result.series.map((item) => (
                    <td key={item.id} className="px-4 py-3 font-mono text-xs">
                      {point[item.id]?.toLocaleString("ru-RU")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="rounded-xl border border-border bg-surface p-5"
        aria-labelledby="interpret-heading"
      >
        <h2 id="interpret-heading" className="font-semibold">
          Что показывает результат
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-text-secondary">
          {result.observations.map((observation) => (
            <li key={observation} className="border-l-2 border-accent pl-3">
              {observation}
            </li>
          ))}
        </ul>

        <h3 className="mt-6 border-t border-border pt-5 text-sm font-semibold">
          Условия эксперимента
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-text-secondary">
          {result.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-5">
          {result.series.map((item) => (
            <div
              key={item.id}
              className="border-b border-border py-3 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium">{item.label}</h3>
                <span className="shrink-0 font-mono text-xs text-accent">
                  {item.complexity}
                </span>
              </div>
              {item.formula ? (
                <p className="mt-1 font-mono text-xs text-text-primary">
                  f(n) = {item.formula}
                </p>
              ) : null}
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                {item.assumption}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
