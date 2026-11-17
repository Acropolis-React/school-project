import type { LabExperimentResult } from "../model/types";

export function ExperimentTable({
  result,
  compact = false,
}: {
  result: LabExperimentResult;
  compact?: boolean;
}) {
  const cellPadding = compact ? "px-2 py-3 sm:px-3" : "p-3";

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse text-right text-sm ${compact ? "" : "min-w-[400px]"}`}
      >
        <caption className="py-2 text-left text-xs text-text-secondary">
          {result.tableCaption} · {result.yAxisLabel}
        </caption>
        <thead
          className={`bg-surface-raised ${compact ? "text-xs sm:text-sm" : ""}`}
        >
          <tr>
            <th scope="col" className={`${cellPadding} text-left`}>
              Размер n
            </th>
            {result.series.map((series) => (
              <th key={series.id} scope="col" className={cellPadding}>
                {compact
                  ? (series.formula ?? series.shortLabel)
                  : series.shortLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {result.points.map((point) => (
            <tr key={point.inputSize}>
              <th scope="row" className={`${cellPadding} text-left font-mono`}>
                {point.inputSize}
              </th>
              {result.series.map((series) => (
                <td key={series.id} className={`${cellPadding} font-mono`}>
                  {point[series.id]?.toLocaleString("ru-RU")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
