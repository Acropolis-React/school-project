import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateExperiment, getComplexityModel } from "@/entities/experiment";
import type { Lesson } from "@/entities/lesson";

const formatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function MiniExperimentChart({ lesson }: { lesson: Lesson }) {
  const data = useMemo(
    () =>
      generateExperiment({
        modelIds: lesson.experimentModels,
        minSize: 10,
        maxSize: 80,
        samples: 5,
      }),
    [lesson.experimentModels],
  );
  const models = lesson.experimentModels
    .map(getComplexityModel)
    .filter((model) => model !== undefined);

  return (
    <section
      className="mt-6 border border-border bg-surface p-4 sm:p-5"
      aria-labelledby="lesson-chart-heading"
    >
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 id="lesson-chart-heading" className="font-semibold">
            Дополнительный график моделей
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            Ось X — размер входа n · ось Y — модельное значение, усл. ед.
          </p>
        </div>
        <span className="text-xs font-medium text-accent">
          Теоретическая модель · не реальные измерения
        </span>
      </div>
      <div
        className="mt-4 h-[280px] w-full sm:h-[340px]"
        role="img"
        aria-label="Линейный график сравнения теоретических моделей роста"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: -8, bottom: 8 }}
          >
            <CartesianGrid
              stroke="#263141"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="inputSize"
              stroke="#718096"
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              label={{
                value: "Размер входа n",
                position: "insideBottom",
                offset: -4,
                fill: "#94a3b8",
                fontSize: 12,
              }}
              height={42}
            />
            <YAxis
              stroke="#718096"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value: number) => formatter.format(value)}
              width={58}
            />
            <Tooltip
              contentStyle={{
                background: "#111821",
                border: "1px solid #293241",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#e6edf3" }}
              formatter={(value, name) => [
                Number(value).toLocaleString("ru-RU"),
                models.find((model) => model.id === name)?.shortLabel ?? name,
              ]}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) =>
                models.find((model) => model.id === value)?.shortLabel ?? value
              }
            />
            {models.map((model) => (
              <Line
                key={model.id}
                type="monotone"
                dataKey={model.id}
                stroke={model.color}
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: model.color, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-4 border-t border-border pt-3 text-sm">
        <summary className="cursor-pointer text-text-secondary">
          Таблица модельных значений
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="pb-2 text-left text-xs text-text-muted">
              Теоретические функции, условные единицы; не счётчики и не время.
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4">
                  Размер n
                </th>
                {models.map((model) => (
                  <th key={model.id} scope="col" className="py-2 text-right">
                    {model.shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.inputSize} className="border-b border-border">
                  <th scope="row" className="py-2 pr-4 font-normal">
                    {point.inputSize}
                  </th>
                  {models.map((model) => (
                    <td key={model.id} className="py-2 text-right font-mono">
                      {point[model.id]?.toLocaleString("ru-RU")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
