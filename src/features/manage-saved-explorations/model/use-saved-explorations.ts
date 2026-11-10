"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearSavedExplorations,
  readSavedExplorations,
  writeSavedExplorations,
} from "./storage";
import type { SavedExploration, SavedExplorationConfig } from "./types";

function createExplorationId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `exploration-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
    (config: SavedExplorationConfig): SavedExploration | null => {
      const item: SavedExploration = {
        id: createExplorationId(),
        createdAt: new Date().toISOString(),
        config: { ...config, selectedIds: [...config.selectedIds] },
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

  return { items, hydrated, storageError, save, remove, clear };
}
