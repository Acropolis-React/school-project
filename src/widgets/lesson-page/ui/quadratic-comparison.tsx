import type { LabExperimentResult } from "@/features/run-experiment";

export function QuadraticComparison({
  result,
}: {
  result: LabExperimentResult;
}) {
  const points = result.points.filter(
    (point) => point.inputSize === 10 || point.inputSize === 20,
  );
  const maximum = Math.max(...points.map((point) => point.quadratic ?? 0));
  if (points.length !== 2 || maximum <= 0) return null;
  return (
    <figure className="mt-5">
      <figcaption className="text-sm font-medium">
        Сравнение значений модели n²
      </figcaption>
      <div className="mt-3 space-y-3">
        {points.map((point) => (
          <div key={point.inputSize}>
            <div className="flex justify-between gap-3 text-sm">
              <span>n = {point.inputSize}</span>
              <span className="font-mono">{point.quadratic}</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-track">
              <div
                className="h-full rounded-full bg-accent"
                style={{
                  width: `${((point.quadratic ?? 0) / maximum) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs leading-5 text-text-secondary">
        Длина полосы пропорциональна модельному значению; это не измерение
        времени.
      </p>
    </figure>
  );
}
