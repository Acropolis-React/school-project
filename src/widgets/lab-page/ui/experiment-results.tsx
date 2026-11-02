import type { LabPoint, SeriesDefinition } from "../model/lab-config";

type ExperimentResultsProps = {
  points: LabPoint[];
  series: SeriesDefinition[];
  resultKind: string;
};

export function ExperimentResults({
  points,
  series,
  resultKind,
}: ExperimentResultsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <section
        className="min-w-0 border border-border bg-surface"
        aria-labelledby="table-heading"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 id="table-heading" className="font-semibold">
            Таблица значений
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Детерминированные значения выбранных формул
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-right text-sm">
            <caption className="sr-only">
              Теоретические модельные значения {resultKind}
            </caption>
            <thead className="bg-surface-raised text-xs text-text-secondary">
              <tr>
                <th className="px-4 py-3 text-left">n</th>
                {series.map((item) => (
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
              {points.map((point) => (
                <tr
                  key={point.inputSize}
                  className="hover:bg-surface-raised/60"
                >
                  <th className="px-4 py-3 text-left font-mono font-normal text-text-secondary">
                    {point.inputSize}
                  </th>
                  {series.map((item) => (
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
        className="border border-border bg-surface p-5"
        aria-labelledby="interpret-heading"
      >
        <h2 id="interpret-heading" className="font-semibold">
          Формулы и допущения
        </h2>
        <div className="mt-4 space-y-4">
          {series.map((item) => (
            <div
              key={item.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium">{item.label}</h3>
                <span className="shrink-0 font-mono text-xs text-accent">
                  {item.complexity}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-text-primary">
                f(n) = {item.formula}
              </p>
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                {item.assumption}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 border-l-2 border-accent pl-3 text-xs leading-5 text-text-primary">
          Формулы показывают характер роста без запуска кода и измерения
          устройства. Коэффициенты нужны только для наглядного сравнения.
        </p>
      </section>
    </div>
  );
}
