import { ALGORITHM_ENGINE_LIMITS, algorithms } from "@/entities/algorithm";
import {
  complexityModels,
  type LabExperimentConfig,
} from "@/entities/experiment";
import type { SavedExploration } from "./types";

const STORAGE_KEY = "algolab-saved-explorations-v2";
const LEGACY_STORAGE_KEY = "algolab-saved-explorations-v1";
const MAX_SAVED_EXPLORATIONS = 20;
const MAX_TITLE_LENGTH = 80;
const MAX_NOTE_LENGTH = 2_000;

type LegacyConfig = {
  mode: "algorithms" | "complexities";
  family: "search" | "sorting";
  selectedIds: string[];
  minSize: number;
  maxSize: number;
  samples: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function hasValidSeries(config: LabExperimentConfig): boolean {
  if (!Array.isArray(config.selectedIds) || config.selectedIds.length === 0)
    return false;
  if (!config.selectedIds.every((id): id is string => typeof id === "string"))
    return false;
  const allowedIds = new Set<string>(
    config.subject === "algorithms"
      ? algorithms
          .filter((algorithm) => algorithm.family === config.family)
          .map((algorithm) => algorithm.id)
      : complexityModels.map((model) => model.id),
  );
  return (
    new Set(config.selectedIds).size === config.selectedIds.length &&
    config.selectedIds.every((id) => allowedIds.has(id))
  );
}

function isSavedConfig(value: unknown): value is LabExperimentConfig {
  if (!isRecord(value)) return false;
  if (value.source !== "theoretical" && value.source !== "instrumented")
    return false;
  if (value.subject !== "algorithms" && value.subject !== "complexities")
    return false;
  if (value.source === "instrumented" && value.subject !== "algorithms")
    return false;
  if (value.family !== "search" && value.family !== "sorting") return false;
  if (
    value.distribution !== "random" &&
    value.distribution !== "sorted" &&
    value.distribution !== "reverse-sorted" &&
    value.distribution !== "nearly-sorted"
  )
    return false;
  if (
    value.metric !== "total" &&
    value.metric !== "comparisons" &&
    value.metric !== "swaps" &&
    value.metric !== "arrayReads" &&
    value.metric !== "arrayWrites"
  )
    return false;
  if (
    value.targetPosition !== "first" &&
    value.targetPosition !== "middle" &&
    value.targetPosition !== "last" &&
    value.targetPosition !== "random" &&
    value.targetPosition !== "missing"
  )
    return false;

  if (
    !Array.isArray(value.selectedIds) ||
    !value.selectedIds.every((id): id is string => typeof id === "string") ||
    !isInteger(value.minSize) ||
    !isInteger(value.maxSize) ||
    !isInteger(value.samples) ||
    !isInteger(value.seed)
  )
    return false;

  const config: LabExperimentConfig = {
    source: value.source,
    subject: value.subject,
    family: value.family,
    selectedIds: value.selectedIds,
    minSize: value.minSize,
    maxSize: value.maxSize,
    samples: value.samples,
    distribution: value.distribution,
    metric: value.metric,
    seed: value.seed,
    targetPosition: value.targetPosition,
  };
  if (!hasValidSeries(config)) return false;
  if (
    config.source === "instrumented" &&
    config.selectedIds.includes("binary-search") &&
    config.distribution !== "sorted"
  )
    return false;

  const includesQuadraticSort = config.selectedIds.some(
    (id) => id === "bubble-sort" || id === "insertion-sort",
  );
  const maxSize =
    config.source === "theoretical"
      ? 500
      : includesQuadraticSort
        ? ALGORITHM_ENGINE_LIMITS.maxQuadraticSortInputSize
        : ALGORITHM_ENGINE_LIMITS.maxInputSize;

  return (
    config.minSize >= 1 &&
    config.maxSize > config.minSize &&
    config.maxSize <= maxSize &&
    config.samples >= 2 &&
    config.samples <= 12 &&
    config.maxSize - config.minSize + 1 >= config.samples &&
    config.seed >= 0 &&
    config.seed <= ALGORITHM_ENGINE_LIMITS.maxSeed
  );
}

function isLegacyConfig(value: unknown): value is LegacyConfig {
  if (!isRecord(value)) return false;
  if (value.mode !== "algorithms" && value.mode !== "complexities")
    return false;
  if (value.family !== "search" && value.family !== "sorting") return false;
  if (!Array.isArray(value.selectedIds) || value.selectedIds.length === 0)
    return false;
  if (!value.selectedIds.every((id): id is string => typeof id === "string"))
    return false;
  const allowedIds = new Set<string>(
    value.mode === "algorithms"
      ? algorithms
          .filter((algorithm) => algorithm.family === value.family)
          .map((algorithm) => algorithm.id)
      : complexityModels.map((model) => model.id),
  );
  return (
    new Set(value.selectedIds).size === value.selectedIds.length &&
    value.selectedIds.every((id) => allowedIds.has(id)) &&
    isInteger(value.minSize) &&
    value.minSize >= 1 &&
    isInteger(value.maxSize) &&
    value.maxSize > value.minSize &&
    value.maxSize <= 500 &&
    isInteger(value.samples) &&
    value.samples >= 2 &&
    value.samples <= 12
  );
}

function migrateLegacyConfig(config: LegacyConfig): LabExperimentConfig {
  return {
    source: "theoretical",
    subject: config.mode,
    family: config.family,
    selectedIds: [...config.selectedIds],
    minSize: config.minSize,
    maxSize: config.maxSize,
    samples: Math.min(config.samples, config.maxSize - config.minSize + 1),
    distribution: "sorted",
    metric: "comparisons",
    seed: 42,
    targetPosition: "missing",
  };
}

function getMigratedTitle(config: LegacyConfig): string {
  if (config.mode === "complexities") return "Сравнение классов Big O";
  return config.family === "search"
    ? "Сравнение алгоритмов поиска"
    : "Сравнение алгоритмов сортировки";
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isOptionalNote(value: unknown): value is string | undefined {
  return (
    value === undefined ||
    (typeof value === "string" && value.length <= MAX_NOTE_LENGTH)
  );
}

function parseVersionTwo(items: unknown[]): SavedExploration[] {
  return items
    .filter(
      (item): item is SavedExploration =>
        isRecord(item) &&
        typeof item.id === "string" &&
        item.id.length > 0 &&
        item.id.length <= 100 &&
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        item.title.length <= MAX_TITLE_LENGTH &&
        isValidDate(item.createdAt) &&
        isValidDate(item.updatedAt) &&
        isOptionalNote(item.hypothesis) &&
        isOptionalNote(item.conclusion) &&
        isSavedConfig(item.config),
    )
    .map((item) => ({
      ...item,
      config: { ...item.config, selectedIds: [...item.config.selectedIds] },
    }))
    .slice(0, MAX_SAVED_EXPLORATIONS);
}

function parseVersionOne(items: unknown[]): SavedExploration[] {
  return items
    .flatMap((item): SavedExploration[] => {
      if (
        !isRecord(item) ||
        typeof item.id !== "string" ||
        item.id.length === 0 ||
        item.id.length > 100 ||
        !isValidDate(item.createdAt) ||
        !isLegacyConfig(item.config)
      )
        return [];
      return [
        {
          id: item.id,
          title: getMigratedTitle(item.config),
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
          config: migrateLegacyConfig(item.config),
        },
      ];
    })
    .slice(0, MAX_SAVED_EXPLORATIONS);
}

export function parseSavedExplorations(
  value: string | null,
): SavedExploration[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) return [];
    if (parsed.version === 2) return parseVersionTwo(parsed.items);
    if (parsed.version === 1) return parseVersionOne(parsed.items);
    return [];
  } catch {
    return [];
  }
}

export function readSavedExplorations(): SavedExploration[] {
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current !== null) return parseSavedExplorations(current);

  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy === null) return [];
  const migrated = parseSavedExplorations(legacy);
  writeSavedExplorations(migrated);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  return migrated;
}

export function writeSavedExplorations(items: SavedExploration[]): void {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 2,
      items: items.slice(0, MAX_SAVED_EXPLORATIONS),
    }),
  );
}

export function clearSavedExplorations(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}
