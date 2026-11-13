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
import {
  getMetricLabel,
  type LabExperimentResult,
} from "@/features/run-experiment";

const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type ExperimentChartProps = {
  result: LabExperimentResult;
};

export function ExperimentChart({ result }: ExperimentChartProps) {
  const isInstrumented = result.source === "instrumented";
  const chartTitle = isInstrumented
    ? "Фактические операции алгоритмов"
    : "Теоретический рост";
  const yAxisShortLabel =
    result.metric === "model-value"
      ? "Условные единицы"
      : getMetricLabel(result.metric);

  return (
    <section
      className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 sm:p-5"
      aria-labelledby="chart-heading"
    >
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="chart-heading" className="font-semibold">
            {chartTitle}
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            Ось X — размер входа n · ось Y — {result.yAxisLabel.toLowerCase()}
          </p>
        </div>
        <span
          className={`max-w-xs text-xs font-medium leading-5 ${isInstrumented ? "text-warning" : "text-accent"}`}
        >
          {result.disclosure}
        </span>
      </div>
      <div
        className="mt-4 h-[340px] w-full sm:h-[420px] xl:h-auto xl:min-h-[420px] xl:flex-1"
        role="img"
        aria-label={`${chartTitle}. ${result.yAxisLabel} в зависимости от размера входа n.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={result.points}
            margin={{ top: 8, right: 12, left: 8, bottom: 12 }}
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
                offset: -6,
                fill: "#94a3b8",
                fontSize: 12,
              }}
              height={46}
            />
            <YAxis
              stroke="#718096"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value: number) => compactFormatter.format(value)}
              label={{
                value: yAxisShortLabel,
                angle: -90,
                position: "insideLeft",
                fill: "#94a3b8",
                fontSize: 11,
              }}
              width={74}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#111821",
                border: "1px solid #293241",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#e6edf3" }}
              labelFormatter={(label) => `Размер входа n = ${label}`}
              formatter={(value, name) => [
                Number(value).toLocaleString("ru-RU"),
                result.series.find((item) => item.id === name)?.shortLabel ??
                  name,
              ]}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) =>
                result.series.find((item) => item.id === value)?.shortLabel ??
                value
              }
            />
            {result.series.map((item) => (
              <Line
                key={item.id}
                type="linear"
                dataKey={item.id}
                stroke={item.color}
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: item.color, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
