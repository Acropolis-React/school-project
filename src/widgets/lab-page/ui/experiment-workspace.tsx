"use client";

import { useMemo, useState } from "react";
import type { AlgorithmFamily } from "@/entities/algorithm";
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

export function ExperimentWorkspace() {
  const [draft, setDraft] = useState<LabConfig>(defaultConfig);
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [error, setError] = useState("");
  const availableSeries = getAvailableSeries(draft);
  const selectedSeries = useMemo(() => getSelectedSeries(config), [config]);
  const points = useMemo(
    () => generatePoints(config, selectedSeries),
    [config, selectedSeries],
  );

  const setMode = (mode: ComparisonMode) => {
    setDraft((current) => ({
      ...current,
      mode,
      selectedIds: defaultIds(mode, current.family),
    }));
    setError("");
  };

  const setFamily = (family: AlgorithmFamily) => {
    setDraft((current) => ({
      ...current,
      family,
      selectedIds: defaultIds("algorithms", family),
    }));
    setError("");
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
  };

  const reset = () => {
    setDraft(defaultConfig);
    setConfig(defaultConfig);
    setError("");
  };

  const resultKind =
    config.mode === "algorithms" ? "алгоритмов" : "классов сложности";

  return (
    <div className="space-y-5">
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
    </div>
  );
}
