import type { LabExperimentResult } from "@/features/run-experiment";

function validValue(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

export function getPointComparison(
  result: LabExperimentResult,
  inputSize: number | null,
) {
  if (result.config.subject !== "algorithms" || result.series.length !== 2)
    return null;

  const point = result.points.find((item) => item.inputSize === inputSize);
  const [first, second] = result.series;
  const firstValue = validValue(point?.[first.id]);
  const secondValue = validValue(point?.[second.id]);
  if (firstValue === null || secondValue === null) {
    return { complete: false as const, first, second, firstValue, secondValue };
  }

  const difference = Math.abs(firstValue - secondValue);
  const larger = firstValue >= secondValue ? first : second;
  const smaller = firstValue >= secondValue ? second : first;
  const smallerValue = Math.min(firstValue, secondValue);
  const ratio =
    smallerValue === 0
      ? null
      : Math.max(firstValue, secondValue) / smallerValue;
  return {
    complete: true as const,
    first,
    second,
    firstValue,
    secondValue,
    difference,
    larger,
    smaller,
    ratio,
  };
}
