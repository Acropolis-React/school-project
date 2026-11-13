import type { AlgorithmFamily, AlgorithmId } from "./types";

export type SearchAlgorithmId = Extract<
  AlgorithmId,
  "linear-search" | "binary-search"
>;

export type SortingAlgorithmId = Exclude<AlgorithmId, SearchAlgorithmId>;

export type ArrayKind =
  | "random"
  | "sorted"
  | "reverse-sorted"
  | "nearly-sorted";

export type SearchTargetPosition =
  | "first"
  | "middle"
  | "last"
  | "random"
  | "missing";

export type OperationCounts = {
  comparisons: number;
  swaps: number;
  arrayReads: number;
  arrayWrites: number;
  total: number;
};

export type ComparisonOperator = "==" | "<" | "<=" | ">";

export type OperationTraceStep =
  | {
      sequence: number;
      type: "read";
      array: "input" | "auxiliary";
      index: number;
      value: number;
    }
  | {
      sequence: number;
      type: "write";
      array: "input" | "auxiliary";
      index: number;
      value: number;
    }
  | {
      sequence: number;
      type: "compare";
      left: number;
      right: number;
      operator: ComparisonOperator;
      result: boolean;
    }
  | {
      sequence: number;
      type: "swap";
      array: "input";
      leftIndex: number;
      rightIndex: number;
    };

export type AlgorithmExecutionMetadata = {
  algorithmId: AlgorithmId;
  family: AlgorithmFamily;
  variant: string;
  inputSize: number;
  inputWasCopied: true;
  deterministic: true;
  countingModelVersion: "1";
  requiresSortedInput: boolean;
  stable: boolean | null;
  traceCaptured: boolean;
};

type ExecutionOptions = {
  captureTrace?: boolean;
};

export type SearchExecutionRequest = {
  algorithmId: SearchAlgorithmId;
  input: readonly number[];
  target: number;
  options?: ExecutionOptions;
};

export type SortingExecutionRequest = {
  algorithmId: SortingAlgorithmId;
  input: readonly number[];
  options?: ExecutionOptions;
};

export type AlgorithmExecutionRequest =
  | SearchExecutionRequest
  | SortingExecutionRequest;

type ExecutionResultBase = {
  input: readonly number[];
  counts: OperationCounts;
  trace: readonly OperationTraceStep[];
  metadata: AlgorithmExecutionMetadata;
};

export type SearchExecutionResult = ExecutionResultBase & {
  result: {
    kind: "search";
    target: number;
    found: boolean;
    index: number;
  };
};

export type SortingExecutionResult = ExecutionResultBase & {
  result: {
    kind: "sorting";
    values: readonly number[];
  };
};

export type AlgorithmExecutionResult =
  | SearchExecutionResult
  | SortingExecutionResult;

export type ArrayGenerationConfig = {
  size: number;
  kind: ArrayKind;
  seed: number;
};

export type GeneratedArray = {
  values: readonly number[];
  metadata: {
    kind: ArrayKind;
    size: number;
    seed: number;
    deterministic: true;
    appliedAdjacentSwaps: number;
  };
};

export type SearchInputGenerationConfig = ArrayGenerationConfig & {
  targetPosition: SearchTargetPosition;
};

export type GeneratedSearchInput = GeneratedArray & {
  target: number;
  expectedIndex: number;
  metadata: GeneratedArray["metadata"] & {
    targetPosition: SearchTargetPosition;
  };
};

export type AlgorithmEngineErrorCode =
  | "INVALID_INPUT"
  | "INPUT_TOO_LARGE"
  | "TRACE_INPUT_TOO_LARGE"
  | "UNSORTED_INPUT"
  | "INVALID_TARGET"
  | "INVALID_GENERATOR_CONFIG";

export class AlgorithmEngineError extends Error {
  readonly code: AlgorithmEngineErrorCode;

  constructor(code: AlgorithmEngineErrorCode, message: string) {
    super(message);
    this.name = "AlgorithmEngineError";
    this.code = code;
  }
}
