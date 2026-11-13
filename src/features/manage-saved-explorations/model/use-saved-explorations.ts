"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearSavedExplorations,
  readSavedExplorations,
  writeSavedExplorations,
} from "./storage";
import type {
  SavedExploration,
  SavedExplorationConfig,
  SavedResearchInput,
} from "./types";

function createExplorationId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `exploration-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function copyConfig(config: SavedExplorationConfig): SavedExplorationConfig {
  return { ...config, selectedIds: [...config.selectedIds] };
}

function normalizeInput(input: SavedResearchInput): SavedResearchInput {
  const hypothesis = input.hypothesis?.trim();
  const conclusion = input.conclusion?.trim();
  return {
    title: input.title.trim(),
    config: copyConfig(input.config),
    ...(hypothesis ? { hypothesis } : {}),
    ...(conclusion ? { conclusion } : {}),
  };
}

function isValidResearchInput(input: SavedResearchInput): boolean {
  return (
    input.title.length > 0 &&
    input.title.length <= 80 &&
    (input.hypothesis?.length ?? 0) <= 2_000 &&
    (input.conclusion?.length ?? 0) <= 2_000
  );
}

export function useSavedExplorations() {
  const [items, setItems] = useState<SavedExploration[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setItems(readSavedExplorations());
    } catch {
      setStorageError(
        "Не удалось прочитать сохранённые исследования в этом браузере.",
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  const save = useCallback(
    (input: SavedResearchInput): SavedExploration | null => {
      const normalized = normalizeInput(input);
      if (!isValidResearchInput(normalized)) {
        setStorageError("Проверьте название и длину заметок исследования.");
        return null;
      }
      const now = new Date().toISOString();
      const item: SavedExploration = {
        id: createExplorationId(),
        title: normalized.title,
        createdAt: now,
        updatedAt: now,
        config: normalized.config,
        ...(normalized.hypothesis ? { hypothesis: normalized.hypothesis } : {}),
        ...(normalized.conclusion ? { conclusion: normalized.conclusion } : {}),
      };
      const next = [item, ...items].slice(0, 20);
      try {
        writeSavedExplorations(next);
        setItems(next);
        setStorageError(null);
        return item;
      } catch {
        setStorageError(
          "Не удалось сохранить исследование. Проверьте доступ к локальному хранилищу.",
        );
        return null;
      }
    },
    [items],
  );

  const update = useCallback(
    (id: string, input: SavedResearchInput): SavedExploration | null => {
      const current = items.find((item) => item.id === id);
      if (!current) return null;
      const normalized = normalizeInput(input);
      if (!isValidResearchInput(normalized)) {
        setStorageError("Проверьте название и длину заметок исследования.");
        return null;
      }
      const updated: SavedExploration = {
        ...current,
        title: normalized.title,
        updatedAt: new Date().toISOString(),
        config: normalized.config,
        hypothesis: normalized.hypothesis,
        conclusion: normalized.conclusion,
      };
      const next = items.map((item) => (item.id === id ? updated : item));
      try {
        writeSavedExplorations(next);
        setItems(next);
        setStorageError(null);
        return updated;
      } catch {
        setStorageError("Не удалось обновить сохранённое исследование.");
        return null;
      }
    },
    [items],
  );

  const remove = useCallback(
    (id: string) => {
      const next = items.filter((item) => item.id !== id);
      try {
        writeSavedExplorations(next);
        setItems(next);
        setStorageError(null);
      } catch {
        setStorageError("Не удалось удалить сохранённое исследование.");
      }
    },
    [items],
  );

  const clear = useCallback(() => {
    try {
      clearSavedExplorations();
      setItems([]);
      setStorageError(null);
    } catch {
      setStorageError("Не удалось удалить сохранённые исследования.");
    }
  }, []);

  return {
    items,
    hydrated,
    storageError,
    save,
    update,
    remove,
    clear,
  };
}
