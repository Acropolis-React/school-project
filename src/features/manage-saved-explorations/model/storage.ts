import { algorithms } from "@/entities/algorithm";
import { complexityModels } from "@/entities/experiment";
import type { SavedExploration, SavedExplorationConfig } from "./types";

const STORAGE_KEY = "algolab-saved-explorations-v1";
const MAX_SAVED_EXPLORATIONS = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSavedConfig(value: unknown): value is SavedExplorationConfig {
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
  if (
    new Set(value.selectedIds).size !== value.selectedIds.length ||
    !value.selectedIds.every((id) => allowedIds.has(id))
  )
    return false;

  return (
    typeof value.minSize === "number" &&
    Number.isInteger(value.minSize) &&
    value.minSize >= 1 &&
    value.minSize < 500 &&
    typeof value.maxSize === "number" &&
    Number.isInteger(value.maxSize) &&
    value.maxSize > value.minSize &&
    value.maxSize <= 500 &&
    typeof value.samples === "number" &&
    Number.isInteger(value.samples) &&
    value.samples >= 2 &&
    value.samples <= 12
  );
}

export function parseSavedExplorations(value: string | null) {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.items)
    )
      return [];

    return parsed.items
      .filter(
        (item): item is SavedExploration =>
          isRecord(item) &&
          typeof item.id === "string" &&
          item.id.length > 0 &&
          item.id.length <= 100 &&
          typeof item.createdAt === "string" &&
          Number.isFinite(Date.parse(item.createdAt)) &&
          isSavedConfig(item.config),
      )
      .slice(0, MAX_SAVED_EXPLORATIONS);
  } catch {
    return [];
  }
}

export function readSavedExplorations(): SavedExploration[] {
  return parseSavedExplorations(window.localStorage.getItem(STORAGE_KEY));
}

export function writeSavedExplorations(items: SavedExploration[]): void {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      items: items.slice(0, MAX_SAVED_EXPLORATIONS),
    }),
  );
}

export function clearSavedExplorations(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
