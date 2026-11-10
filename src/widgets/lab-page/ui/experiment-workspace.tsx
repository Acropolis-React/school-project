"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlgorithmFamily } from "@/entities/algorithm";
import {
  type SavedExploration,
  useSavedExplorations,
} from "@/features/manage-saved-explorations";
import {
  type ComparisonMode,
  defaultConfig,
  defaultIds,
  generatePoints,
  getAvailableSeries,
  getSelectedSeries,
  type LabConfig,
} from "../model/lab-config";
import { ExperimentChart } from "./experiment-chart";
import { ExperimentResults } from "./experiment-results";
import { ExperimentSettings } from "./experiment-settings";
import { SavedExplorationsPanel } from "./saved-explorations-panel";

export function ExperimentWorkspace() {
  const [draft, setDraft] = useState<LabConfig>(defaultConfig);
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const requestedExplorationHandled = useRef(false);
  const savedExplorations = useSavedExplorations();
  const availableSeries = getAvailableSeries(draft);
  const selectedSeries = useMemo(() => getSelectedSeries(config), [config]);
  const points = useMemo(
    () => generatePoints(config, selectedSeries),
    [config, selectedSeries],
  );

  const openSaved = useCallback((item: SavedExploration) => {
    const restored = {
      ...item.config,
      selectedIds: [...item.config.selectedIds],
    };
    setDraft(restored);
    setConfig(restored);
    setError("");
    setNotice("Сохранённая конфигурация открыта.");
  }, []);

  useEffect(() => {
    if (!savedExplorations.hydrated || requestedExplorationHandled.current)
      return;

    requestedExplorationHandled.current = true;
    const requestedId = new URLSearchParams(window.location.search).get(
      "exploration",
    );
    if (!requestedId) return;

    const requested = savedExplorations.items.find(
      (item) => item.id === requestedId,
    );
    if (requested) openSaved(requested);
    else setError("Сохранённое исследование не найдено или было удалено.");
  }, [savedExplorations.hydrated, savedExplorations.items, openSaved]);

  const setMode = (mode: ComparisonMode) => {
    setDraft((current) => ({
      ...current,
      mode,
      selectedIds: defaultIds(mode, current.family),
    }));
    setError("");
    setNotice("");
  };

  const setFamily = (family: AlgorithmFamily) => {
    setDraft((current) => ({
      ...current,
      family,
      selectedIds: defaultIds("algorithms", family),
    }));
    setError("");
    setNotice("");
  };

  const toggleSeries = (id: string) => {
    setDraft((current) => ({
      ...current,
      selectedIds: current.selectedIds.includes(id)
        ? current.selectedIds.filter((seriesId) => seriesId !== id)
        : [...current.selectedIds, id],
    }));
  };

  const apply = () => {
    if (draft.selectedIds.length === 0) {
      setError(
        draft.mode === "algorithms"
          ? "Выберите хотя бы один алгоритм."
          : "Выберите хотя бы один класс сложности.",
      );
      return;
    }
    if (
      !Number.isInteger(draft.minSize) ||
      draft.minSize < 1 ||
      draft.maxSize <= draft.minSize
    ) {
      setError("Укажите целый диапазон: от 1, а максимум — больше минимума.");
      return;
    }
    setError("");
    setConfig(draft);
    setNotice("Сравнение обновлено.");
  };

  const reset = () => {
    setDraft(defaultConfig);
    setConfig(defaultConfig);
    setError("");
    setNotice("Настройки возвращены к исходным.");
  };

  const saveCurrent = () => {
    const saved = savedExplorations.save(config);
    if (saved) setNotice("Исследование сохранено в этом браузере.");
  };

  const resultKind =
    config.mode === "algorithms" ? "алгоритмов" : "классов сложности";

  return (
    <div className="space-y-5">
      {notice ? (
        <output
          className="block border-l-2 border-accent bg-accent/8 px-4 py-3 text-sm text-text-primary"
          aria-live="polite"
        >
          {notice}
        </output>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <ExperimentSettings
          draft={draft}
          availableSeries={availableSeries}
          error={error}
          onModeChange={setMode}
          onFamilyChange={setFamily}
          onToggleSeries={toggleSeries}
          onConfigChange={(patch) =>
            setDraft((current) => ({ ...current, ...patch }))
          }
          onApply={apply}
          onReset={reset}
        />
        <ExperimentChart
          points={points}
          series={selectedSeries}
          resultKind={resultKind}
        />
      </div>
      <ExperimentResults
        points={points}
        series={selectedSeries}
        resultKind={resultKind}
      />
      <SavedExplorationsPanel
        items={savedExplorations.items}
        hydrated={savedExplorations.hydrated}
        storageError={savedExplorations.storageError}
        onSave={saveCurrent}
        onOpen={openSaved}
        onRemove={savedExplorations.remove}
      />
    </div>
  );
}
