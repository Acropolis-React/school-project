import {
  AlgorithmEngineError,
  type ArrayGenerationConfig,
  type GeneratedArray,
  type GeneratedSearchInput,
  type SearchInputGenerationConfig,
} from "../../model/execution";
import { ALGORITHM_ENGINE_LIMITS } from "./counting";

function validateGenerationConfig(config: ArrayGenerationConfig): void {
  if (
    config.kind !== "random" &&
    config.kind !== "sorted" &&
    config.kind !== "reverse-sorted" &&
    config.kind !== "nearly-sorted"
  ) {
    throw new AlgorithmEngineError(
      "INVALID_GENERATOR_CONFIG",
      "Unknown array generation kind.",
    );
  }
  if (!Number.isInteger(config.size) || config.size < 0) {
    throw new AlgorithmEngineError(
      "INVALID_GENERATOR_CONFIG",
      "Generated array size must be a non-negative integer.",
    );
  }
  if (config.size > ALGORITHM_ENGINE_LIMITS.maxInputSize) {
    throw new AlgorithmEngineError(
      "INPUT_TOO_LARGE",
      `Generated arrays are limited to ${ALGORITHM_ENGINE_LIMITS.maxInputSize} elements.`,
    );
  }
  if (
    !Number.isInteger(config.seed) ||
    config.seed < 0 ||
    config.seed > ALGORITHM_ENGINE_LIMITS.maxSeed
  ) {
    throw new AlgorithmEngineError(
      "INVALID_GENERATOR_CONFIG",
      `Seed must be an integer from 0 to ${ALGORITHM_ENGINE_LIMITS.maxSeed}.`,
    );
  }
}

function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b_79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function shuffle(values: number[], random: () => number): void {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [values[index], values[target]] = [values[target], values[index]];
  }
}

export function generateArray(config: ArrayGenerationConfig): GeneratedArray {
  validateGenerationConfig(config);
  const values = Array.from({ length: config.size }, (_, index) => index);
  const random = createRandom(config.seed);
  let appliedAdjacentSwaps = 0;

  if (config.kind === "random") {
    shuffle(values, random);
    if (values.length > 1 && values.every((value, index) => value === index)) {
      [values[0], values[1]] = [values[1], values[0]];
    }
  } else if (config.kind === "reverse-sorted") {
    values.reverse();
  } else if (config.kind === "nearly-sorted" && values.length > 1) {
    const candidateIndexes = Array.from(
      { length: values.length - 1 },
      (_, index) => index,
    );
    shuffle(candidateIndexes, random);
    appliedAdjacentSwaps = Math.min(
      candidateIndexes.length,
      Math.max(1, Math.floor(values.length * 0.05)),
    );
    for (let index = 0; index < appliedAdjacentSwaps; index += 1) {
      const left = candidateIndexes[index];
      if (left === undefined) continue;
      [values[left], values[left + 1]] = [values[left + 1], values[left]];
    }
  }

  return {
    values,
    metadata: {
      kind: config.kind,
      size: config.size,
      seed: config.seed,
      deterministic: true,
      appliedAdjacentSwaps,
    },
  };
}

export function generateSearchInput(
  config: SearchInputGenerationConfig,
): GeneratedSearchInput {
  if (
    config.targetPosition !== "first" &&
    config.targetPosition !== "middle" &&
    config.targetPosition !== "last" &&
    config.targetPosition !== "random" &&
    config.targetPosition !== "missing"
  ) {
    throw new AlgorithmEngineError(
      "INVALID_GENERATOR_CONFIG",
      "Unknown search target position.",
    );
  }
  const generated = generateArray(config);
  if (config.targetPosition !== "missing" && generated.values.length === 0) {
    throw new AlgorithmEngineError(
      "INVALID_GENERATOR_CONFIG",
      "A target position cannot be selected in an empty array.",
    );
  }

  let expectedIndex = -1;
  if (config.targetPosition === "first") {
    expectedIndex = 0;
  } else if (config.targetPosition === "middle") {
    expectedIndex = Math.floor(generated.values.length / 2);
  } else if (config.targetPosition === "last") {
    expectedIndex = generated.values.length - 1;
  } else if (config.targetPosition === "random") {
    const random = createRandom((config.seed ^ 0xa5a5_a5a5) >>> 0);
    expectedIndex = Math.floor(random() * generated.values.length);
  }

  return {
    ...generated,
    target:
      expectedIndex === -1
        ? generated.values.length
        : (generated.values[expectedIndex] ?? generated.values.length),
    expectedIndex,
    metadata: {
      ...generated.metadata,
      targetPosition: config.targetPosition,
    },
  };
}
