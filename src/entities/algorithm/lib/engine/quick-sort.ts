import type { Instrumentation } from "./counting";

// Lomuto partition with the last element as pivot. Self-swaps are skipped.
function partition(
  values: number[],
  left: number,
  right: number,
  instrumentation: Instrumentation,
): number {
  const pivot = instrumentation.read(values, right);
  let boundary = left;

  for (let index = left; index < right; index += 1) {
    const value = instrumentation.read(values, index);
    if (instrumentation.compare(value, pivot, "<=")) {
      if (boundary !== index) instrumentation.swap(values, boundary, index);
      boundary += 1;
    }
  }
  if (boundary !== right) instrumentation.swap(values, boundary, right);
  return boundary;
}

export function quickSort(
  values: number[],
  instrumentation: Instrumentation,
): void {
  const pending: Array<[number, number]> = [[0, values.length - 1]];

  while (pending.length > 0) {
    const range = pending.pop();
    if (!range) break;
    let [left, right] = range;
    while (left < right) {
      const pivot = partition(values, left, right, instrumentation);
      // Defer the larger range and process the smaller one immediately.
      // This bounds the explicit stack independently of partition quality.
      if (pivot - left < right - pivot) {
        if (pivot + 1 < right) pending.push([pivot + 1, right]);
        right = pivot - 1;
      } else {
        if (left < pivot - 1) pending.push([left, pivot - 1]);
        left = pivot + 1;
      }
    }
  }
}
