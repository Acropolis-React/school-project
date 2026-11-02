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
import type { LabPoint, SeriesDefinition } from "../model/lab-config";

const formatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type ExperimentChartProps = {
  points: LabPoint[];
  series: SeriesDefinition[];
  resultKind: string;
};

export function ExperimentChart({
  points,
  series,
  resultKind,
}: ExperimentChartProps) {
  return (
    <section
      className="border border-border bg-surface p-4 sm:p-5"
      aria-labelledby="chart-heading"
    >
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="chart-heading" className="font-semibold">
            Теоретический рост {resultKind}
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Ось X — размер входа n · ось Y — модельное значение, усл. ед.
          </p>
        </div>
        <span className="text-xs font-medium text-accent">
          Теоретическая модель · не реальные измерения
        </span>
      </div>
      <div
        className="mt-4 h-[310px] w-full sm:h-[400px]"
        role="img"
        aria-label={`Линейный график теоретического роста ${resultKind}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
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
                series.find((item) => item.id === name)?.shortLabel ?? name,
              ]}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) =>
                series.find((item) => item.id === value)?.shortLabel ?? value
              }
            />
            {series.map((item) => (
              <Line
                key={item.id}
                type="monotone"
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
