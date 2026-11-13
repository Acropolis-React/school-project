import {
  AlgorithmEngineError,
  type AlgorithmExecutionMetadata,
  type AlgorithmExecutionRequest,
  type AlgorithmExecutionResult,
  type SearchAlgorithmId,
  type SortingAlgorithmId,
} from "../../model/execution";
import { ALGORITHM_ENGINE_LIMITS, createInstrumentation } from "./counting";
import { binarySearch, linearSearch } from "./search";
import { bubbleSort, insertionSort, mergeSort } from "./sorting";

const algorithmMetadata: Record<
  SearchAlgorithmId | SortingAlgorithmId,
  Pick<
    AlgorithmExecutionMetadata,
    "family" | "variant" | "requiresSortedInput" | "stable"
  >
> = {
  "linear-search": {
    family: "search",
    variant: "left-to-right early-return search",
    requiresSortedInput: false,
    stable: null,
  },
  "binary-search": {
    family: "search",
    variant: "iterative exact-match binary search",
    requiresSortedInput: true,
    stable: null,
  },
  "bubble-sort": {
    family: "sorting",
    variant: "stable bubble sort with shrinking bound and early exit",
    requiresSortedInput: false,
    stable: true,
  },
  "insertion-sort": {
    family: "sorting",
    variant: "stable insertion sort using shifts",
    requiresSortedInput: false,
    stable: true,
  },
  "merge-sort": {
    family: "sorting",
    variant: "stable top-down merge sort with one auxiliary array",
    requiresSortedInput: false,
    stable: true,
  },
};

function validateValues(values: readonly number[]): void {
  for (const value of values) {
    if (!Number.isSafeInteger(value)) {
      throw new AlgorithmEngineError(
        "INVALID_INPUT",
        "Algorithm inputs must contain only safe integers.",
      );
    }
  }
}

function validateRequest(request: AlgorithmExecutionRequest): void {
  const quadraticLimit =
    request.algorithmId === "bubble-sort" ||
    request.algorithmId === "insertion-sort";
  const maxSize = quadraticLimit
    ? ALGORITHM_ENGINE_LIMITS.maxQuadraticSortInputSize
    : ALGORITHM_ENGINE_LIMITS.maxInputSize;

  if (request.input.length > maxSize) {
    throw new AlgorithmEngineError(
      "INPUT_TOO_LARGE",
      `${request.algorithmId} is limited to ${maxSize} elements.`,
    );
  }
  validateValues(request.input);
  if (
    request.options?.captureTrace &&
    request.input.length > ALGORITHM_ENGINE_LIMITS.maxTraceInputSize
  ) {
    throw new AlgorithmEngineError(
      "TRACE_INPUT_TOO_LARGE",
      `Operation traces are limited to ${ALGORITHM_ENGINE_LIMITS.maxTraceInputSize} elements.`,
    );
  }
  if (
    (request.algorithmId === "linear-search" ||
      request.algorithmId === "binary-search") &&
    !Number.isSafeInteger(request.target)
  ) {
    throw new AlgorithmEngineError(
      "INVALID_TARGET",
      "Search targets must be safe integers.",
    );
  }
  if (request.algorithmId === "binary-search") {
    for (let index = 1; index < request.input.length; index += 1) {
      const previous = request.input[index - 1];
      const current = request.input[index];
      if (
        previous !== undefined &&
        current !== undefined &&
        previous > current
      ) {
        throw new AlgorithmEngineError(
          "UNSORTED_INPUT",
          "Binary search requires an array sorted in ascending order.",
        );
      }
    }
  }
}

export function getAlgorithmExecutionMetadata(
  algorithmId: SearchAlgorithmId | SortingAlgorithmId,
): (typeof algorithmMetadata)[typeof algorithmId] {
  return { ...algorithmMetadata[algorithmId] };
}

export function executeAlgorithm(
  request: AlgorithmExecutionRequest,
): AlgorithmExecutionResult {
  validateRequest(request);
  const values = [...request.input];
  const input = Object.freeze([...request.input]);
  const instrumentation = createInstrumentation(
    request.options?.captureTrace ?? false,
  );
  const definition = getAlgorithmExecutionMetadata(request.algorithmId);
  const metadata: AlgorithmExecutionMetadata = {
    algorithmId: request.algorithmId,
    ...definition,
    inputSize: values.length,
    inputWasCopied: true,
    deterministic: true,
    countingModelVersion: "1",
    traceCaptured: request.options?.captureTrace ?? false,
  };

  if (request.algorithmId === "linear-search") {
    const index = linearSearch(values, request.target, instrumentation);
    const snapshot = instrumentation.snapshot();
    return {
      input,
      ...snapshot,
      metadata,
      result: {
        kind: "search",
        target: request.target,
        found: index !== -1,
        index,
      },
    };
  }

  if (request.algorithmId === "binary-search") {
    const index = binarySearch(values, request.target, instrumentation);
    const snapshot = instrumentation.snapshot();
    return {
      input,
      ...snapshot,
      metadata,
      result: {
        kind: "search",
        target: request.target,
        found: index !== -1,
        index,
      },
    };
  }

  if (request.algorithmId === "bubble-sort") {
    bubbleSort(values, instrumentation);
  } else if (request.algorithmId === "insertion-sort") {
    insertionSort(values, instrumentation);
  } else {
    mergeSort(values, instrumentation);
  }

  const snapshot = instrumentation.snapshot();
  return {
    input,
    ...snapshot,
    metadata,
    result: {
      kind: "sorting",
      values: Object.freeze(values),
    },
  };
}
