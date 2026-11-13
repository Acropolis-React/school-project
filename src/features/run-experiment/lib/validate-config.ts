import { ALGORITHM_ENGINE_LIMITS, algorithms } from "@/entities/algorithm";
import {
  complexityModels,
  type LabExperimentConfig,
} from "@/entities/experiment";
import type { ExperimentValidationError } from "../model/types";

export function getMaximumInputSize(config: LabExperimentConfig): number {
  if (config.source === "theoretical") return 500;
  const includesQuadraticSort = config.selectedIds.some(
    (id) => id === "bubble-sort" || id === "insertion-sort",
  );
  return includesQuadraticSort
    ? ALGORITHM_ENGINE_LIMITS.maxQuadraticSortInputSize
    : ALGORITHM_ENGINE_LIMITS.maxInputSize;
}

export function validateExperimentConfig(
  config: LabExperimentConfig,
): ExperimentValidationError | null {
  if (config.source === "instrumented" && config.subject !== "algorithms") {
    return {
      field: "selectedIds",
      message: "Точные операции доступны только для встроенных алгоритмов.",
    };
  }
  if (config.selectedIds.length === 0) {
    return {
      field: "selectedIds",
      message:
        config.subject === "algorithms"
          ? "Выберите хотя бы один алгоритм."
          : "Выберите хотя бы один класс сложности.",
    };
  }

  const allowedIds = new Set<string>(
    config.subject === "algorithms"
      ? algorithms
          .filter((algorithm) => algorithm.family === config.family)
          .map((algorithm) => algorithm.id)
      : complexityModels.map((model) => model.id),
  );
  if (
    new Set(config.selectedIds).size !== config.selectedIds.length ||
    !config.selectedIds.every((id) => allowedIds.has(id))
  ) {
    return {
      field: "selectedIds",
      message: "В конфигурации есть несовместимые варианты сравнения.",
    };
  }

  const maxInputSize = getMaximumInputSize(config);
  if (
    !Number.isInteger(config.minSize) ||
    !Number.isInteger(config.maxSize) ||
    config.minSize < 1 ||
    config.maxSize <= config.minSize ||
    config.maxSize > maxInputSize
  ) {
    return {
      field: "range",
      message: `Укажите целый диапазон от 1 до ${maxInputSize}; максимум должен быть больше минимума.`,
    };
  }

  if (
    !Number.isInteger(config.samples) ||
    config.samples < 2 ||
    config.samples > 12 ||
    config.maxSize - config.minSize + 1 < config.samples
  ) {
    return {
      field: "samples",
      message:
        "Выберите от 2 до 12 точек; диапазон должен содержать столько же разных размеров.",
    };
  }

  if (
    config.source === "instrumented" &&
    config.selectedIds.includes("binary-search") &&
    config.distribution !== "sorted"
  ) {
    return {
      field: "distribution",
      message: "Для бинарного поиска нужен отсортированный вход.",
    };
  }

  if (
    !Number.isInteger(config.seed) ||
    config.seed < 0 ||
    config.seed > ALGORITHM_ENGINE_LIMITS.maxSeed
  ) {
    return {
      field: "seed",
      message: `Seed должен быть целым числом от 0 до ${ALGORITHM_ENGINE_LIMITS.maxSeed}.`,
    };
  }

  return null;
}
