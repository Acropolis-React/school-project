import {
  experimentSourceMetadata,
  type LabExperimentResult,
} from "@/features/run-experiment";
import { getPointComparison } from "../model/point-comparison";

type PointComparisonProps = {
  result: LabExperimentResult;
  inputSize: number | null;
  onInputSizeChange: (inputSize: number) => void;
};

const formatValue = (value: number) => value.toLocaleString("ru-RU");

export function PointComparison({
  result,
  inputSize,
  onInputSizeChange,
}: PointComparisonProps) {
  const comparison = getPointComparison(result, inputSize);
  if (!comparison) return null;
  const isModel = result.source === "theoretical";

  return (
    <section
      className="border-y border-border py-5"
      aria-labelledby="point-comparison-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="point-comparison-heading" className="font-semibold">
            Сравнение в точке
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            {experimentSourceMetadata[result.source].label} ·{" "}
            {result.yAxisLabel}
          </p>
        </div>
        <label
          className="text-sm text-text-secondary"
          htmlFor="comparison-size"
        >
          Размер n
          <select
            id="comparison-size"
            value={inputSize ?? ""}
            onChange={(event) => onInputSizeChange(Number(event.target.value))}
            className="ml-2 min-h-11 rounded-lg border border-border-strong bg-app px-3 font-mono text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-accent"
          >
            {inputSize === null ? <option value="">Нет точек</option> : null}
            {result.points.map((point) => (
              <option key={point.inputSize} value={point.inputSize}>
                {formatValue(point.inputSize)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-text-secondary">{comparison.first.label}</dt>
            <dd className="mt-1 font-mono text-text-primary">
              {comparison.firstValue === null
                ? "Нет данных"
                : formatValue(comparison.firstValue)}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">{comparison.second.label}</dt>
            <dd className="mt-1 font-mono text-text-primary">
              {comparison.secondValue === null
                ? "Нет данных"
                : formatValue(comparison.secondValue)}
            </dd>
          </div>
        </dl>
        {!comparison.complete ? (
          <p className="text-text-secondary">
            Разница и отношение недоступны: для выбранного размера нет полных
            данных.
          </p>
        ) : (
          <>
            <p className="text-text-secondary">
              Абсолютная разница:{" "}
              <span className="font-mono text-text-primary">
                {formatValue(comparison.difference)}
              </span>{" "}
              {isModel ? "усл. ед." : "по выбранной метрике."}
            </p>
            <p className="text-text-secondary">
              {comparison.ratio === null
                ? comparison.firstValue === comparison.secondValue
                  ? "Оба значения равны нулю; отношение 0 / 0 не определено."
                  : "Одно значение равно нулю; отношение большего к меньшему не определено."
                : comparison.difference === 0
                  ? "Значения совпадают; отношение равно 1."
                  : `Отношение большего значения к меньшему (${comparison.larger.label} / ${comparison.smaller.label}): ${comparison.ratio.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}${Number(comparison.ratio.toFixed(2)) === comparison.ratio ? "" : " (округлено)"}.`}
            </p>
          </>
        )}
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-5 text-text-muted">
        {isModel
          ? "Это сравнение иллюстративных формул: их коэффициенты условны и не показывают фактическое число операций или время."
          : result.metric === "total"
            ? "Сравнивается невзвешенная сумма сравнений, чтений и записей на одинаковых входных данных. Она не является универсальной мерой производительности и не измеряет время."
            : "Сравнивается одна выбранная категория операций на одинаковых входных данных; счётчики не измеряют время выполнения."}{" "}
        Даже алгоритмы с одинаковой асимптотической оценкой могут выполнять
        разное число операций из-за постоянных множителей, деталей реализации и
        распределения входа. Одна точка не доказывает класс роста.
      </p>
    </section>
  );
}
