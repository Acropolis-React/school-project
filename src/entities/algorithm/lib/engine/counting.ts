import type {
  ComparisonOperator,
  OperationCounts,
  OperationTraceStep,
} from "../../model/execution";

export const ALGORITHM_ENGINE_LIMITS = {
  maxInputSize: 10_000,
  maxQuadraticSortInputSize: 2_000,
  maxTraceInputSize: 128,
  maxSeed: 0xffff_ffff,
} as const;

export const OPERATION_COUNTING_RULES = {
  comparisons:
    "One comparison is counted for each value-to-value relational check performed by the algorithm.",
  swaps:
    "One swap is counted for each explicit exchange of two input-array positions.",
  arrayReads:
    "One read is counted whenever the algorithm retrieves an element from its input or auxiliary array.",
  arrayWrites:
    "One write is counted whenever the algorithm assigns an element in its input or auxiliary array.",
  total:
    "Total equals comparisons + array reads + array writes. Swaps are not added again because their reads and writes are already counted.",
  exclusions:
    "Loop/index bookkeeping, recursion, allocation, input validation, input copying, generation, and result copying are excluded.",
} as const;

type ArrayName = "input" | "auxiliary";
type UnsequencedTraceStep = OperationTraceStep extends infer Step
  ? Step extends OperationTraceStep
    ? Omit<Step, "sequence">
    : never
  : never;

export type Instrumentation = {
  read: (array: number[], index: number, arrayName?: ArrayName) => number;
  write: (
    array: number[],
    index: number,
    value: number,
    arrayName?: ArrayName,
  ) => void;
  compare: (
    left: number,
    right: number,
    operator: ComparisonOperator,
  ) => boolean;
  swap: (array: number[], leftIndex: number, rightIndex: number) => void;
  snapshot: () => {
    counts: OperationCounts;
    trace: readonly OperationTraceStep[];
  };
};

export function createInstrumentation(captureTrace: boolean): Instrumentation {
  let comparisons = 0;
  let swaps = 0;
  let arrayReads = 0;
  let arrayWrites = 0;
  const trace: OperationTraceStep[] = [];

  const record = (step: UnsequencedTraceStep) => {
    if (!captureTrace) return;
    trace.push({ ...step, sequence: trace.length } as OperationTraceStep);
  };

  const read: Instrumentation["read"] = (array, index, arrayName = "input") => {
    const value = array[index];
    if (value === undefined) {
      throw new RangeError(`Array read is outside the valid range: ${index}`);
    }
    arrayReads += 1;
    record({ type: "read", array: arrayName, index, value });
    return value;
  };

  const write: Instrumentation["write"] = (
    array,
    index,
    value,
    arrayName = "input",
  ) => {
    if (index < 0 || index >= array.length) {
      throw new RangeError(`Array write is outside the valid range: ${index}`);
    }
    array[index] = value;
    arrayWrites += 1;
    record({ type: "write", array: arrayName, index, value });
  };

  const compare: Instrumentation["compare"] = (left, right, operator) => {
    comparisons += 1;
    const result =
      operator === "=="
        ? left === right
        : operator === "<"
          ? left < right
          : operator === "<="
            ? left <= right
            : left > right;
    record({ type: "compare", left, right, operator, result });
    return result;
  };

  const swap: Instrumentation["swap"] = (array, leftIndex, rightIndex) => {
    const left = read(array, leftIndex);
    const right = read(array, rightIndex);
    write(array, leftIndex, right);
    write(array, rightIndex, left);
    swaps += 1;
    record({ type: "swap", array: "input", leftIndex, rightIndex });
  };

  return {
    read,
    write,
    compare,
    swap,
    snapshot: () => ({
      counts: {
        comparisons,
        swaps,
        arrayReads,
        arrayWrites,
        total: comparisons + arrayReads + arrayWrites,
      },
      trace,
    }),
  };
}
