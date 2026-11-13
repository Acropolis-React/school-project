import type { Instrumentation } from "./counting";

export function linearSearch(
  values: number[],
  target: number,
  instrumentation: Instrumentation,
): number {
  for (let index = 0; index < values.length; index += 1) {
    const value = instrumentation.read(values, index);
    if (instrumentation.compare(value, target, "==")) return index;
  }
  return -1;
}

export function binarySearch(
  values: number[],
  target: number,
  instrumentation: Instrumentation,
): number {
  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    const value = instrumentation.read(values, middle);

    if (instrumentation.compare(value, target, "==")) return middle;
    if (instrumentation.compare(value, target, "<")) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
