import type { Instrumentation } from "./counting";

export function bubbleSort(
  values: number[],
  instrumentation: Instrumentation,
): void {
  for (let end = values.length - 1; end > 0; end -= 1) {
    let swapped = false;
    for (let index = 0; index < end; index += 1) {
      const left = instrumentation.read(values, index);
      const right = instrumentation.read(values, index + 1);
      if (instrumentation.compare(left, right, ">")) {
        instrumentation.swap(values, index, index + 1);
        swapped = true;
      }
    }
    if (!swapped) return;
  }
}

export function insertionSort(
  values: number[],
  instrumentation: Instrumentation,
): void {
  for (let index = 1; index < values.length; index += 1) {
    const key = instrumentation.read(values, index);
    let position = index - 1;

    while (position >= 0) {
      const current = instrumentation.read(values, position);
      if (!instrumentation.compare(current, key, ">")) break;
      instrumentation.write(values, position + 1, current);
      position -= 1;
    }

    instrumentation.write(values, position + 1, key);
  }
}

function merge(
  values: number[],
  auxiliary: number[],
  left: number,
  middle: number,
  right: number,
  instrumentation: Instrumentation,
): void {
  for (let index = left; index <= right; index += 1) {
    const value = instrumentation.read(values, index);
    instrumentation.write(auxiliary, index, value, "auxiliary");
  }

  let leftIndex = left;
  let rightIndex = middle + 1;

  for (let outputIndex = left; outputIndex <= right; outputIndex += 1) {
    if (leftIndex > middle) {
      const value = instrumentation.read(auxiliary, rightIndex, "auxiliary");
      instrumentation.write(values, outputIndex, value);
      rightIndex += 1;
    } else if (rightIndex > right) {
      const value = instrumentation.read(auxiliary, leftIndex, "auxiliary");
      instrumentation.write(values, outputIndex, value);
      leftIndex += 1;
    } else {
      const leftValue = instrumentation.read(auxiliary, leftIndex, "auxiliary");
      const rightValue = instrumentation.read(
        auxiliary,
        rightIndex,
        "auxiliary",
      );
      if (instrumentation.compare(leftValue, rightValue, "<=")) {
        instrumentation.write(values, outputIndex, leftValue);
        leftIndex += 1;
      } else {
        instrumentation.write(values, outputIndex, rightValue);
        rightIndex += 1;
      }
    }
  }
}

function sortRange(
  values: number[],
  auxiliary: number[],
  left: number,
  right: number,
  instrumentation: Instrumentation,
): void {
  if (left >= right) return;
  const middle = left + Math.floor((right - left) / 2);
  sortRange(values, auxiliary, left, middle, instrumentation);
  sortRange(values, auxiliary, middle + 1, right, instrumentation);
  merge(values, auxiliary, left, middle, right, instrumentation);
}

export function mergeSort(
  values: number[],
  instrumentation: Instrumentation,
): void {
  const auxiliary = new Array<number>(values.length);
  sortRange(values, auxiliary, 0, values.length - 1, instrumentation);
}
