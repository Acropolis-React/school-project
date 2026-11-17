import type { LabExperimentResult } from "../model/types";

export function ExperimentTable({ result }: { result: LabExperimentResult }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px] border-collapse text-right text-sm">
        <caption className="py-2 text-left text-xs text-text-secondary">
          {result.tableCaption} · {result.yAxisLabel}
        </caption>
        <thead className="bg-surface-raised">
          <tr>
            <th className="p-3 text-left">Размер n</th>
            {result.series.map((series) => (
              <th key={series.id} className="p-3">
                {series.shortLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {result.points.map((point) => (
            <tr key={point.inputSize}>
              <th className="p-3 text-left font-mono">{point.inputSize}</th>
              {result.series.map((series) => (
                <td key={series.id} className="p-3 font-mono">
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
