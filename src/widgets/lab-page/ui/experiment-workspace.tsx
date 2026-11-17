"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import type {
  ComparisonSubject,
  ExperimentAlgorithmFamily,
  ExperimentSource,
} from "@/entities/experiment";
import {
  type SavedExploration,
  useSavedExplorations,
} from "@/features/manage-saved-explorations";
import {
  experimentSourceMetadata,
  getAvailableExperimentSeries,
  getMaximumInputSize,
  runExperiment,
  validateExperimentConfig,
} from "@/features/run-experiment";
import {
  type ExperimentPreset,
  getExperimentPreset,
} from "../model/experiment-presets";
import {
  copyLabConfig,
  defaultConfig,
  defaultIds,
  emptyResearch,
  type LabConfig,
  type ResearchFields,
} from "../model/lab-config";
import { ExperimentPresets } from "./experiment-presets";
import { ExperimentResultTabs } from "./experiment-result-tabs";
import { ExperimentResults } from "./experiment-results";
import { ExperimentSettings } from "./experiment-settings";
import { SaveResearchDialog } from "./save-research-dialog";

export function ExperimentWorkspace() {
  const [draft, setDraft] = useState<LabConfig>(defaultConfig);
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [error, setError] = useState("");
  const [researchError, setResearchError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadedPresetId, setLoadedPresetId] = useState<string | null>(null);
  const [research, setResearch] = useState<ResearchFields>(emptyResearch);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedInputSize, setSelectedInputSize] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const requestedExplorationHandled = useRef(false);
  const savedExplorations = useSavedExplorations();
  const availableSeries = getAvailableExperimentSeries(draft);
  const maxInputSize = getMaximumInputSize(draft);
  const loadedPreset = loadedPresetId
    ? getExperimentPreset(loadedPresetId)
    : undefined;
  const presetMatches =
    loadedPreset &&
    Object.entries(loadedPreset.config).every(([key, value]) => {
      const current = draft[key as keyof LabConfig];
      return Array.isArray(value) && Array.isArray(current)
        ? value.length === current.length &&
            value.every((id) => current.includes(id))
        : current === value;
    });
  const result = useMemo(() => runExperiment(config), [config]);
  const comparisonInputSize = result.points.some(
    (point) => point.inputSize === selectedInputSize,
  )
    ? selectedInputSize
    : (result.points.at(-1)?.inputSize ?? null);

  const openSaved = useCallback((item: SavedExploration) => {
    const restored = copyLabConfig(item.config);
    setDraft(restored);
    setConfig(restored);
    setLoadedPresetId(null);
    setResearch({
      title: item.title,
      hypothesis: item.hypothesis ?? "",
      conclusion: item.conclusion ?? "",
    });
    setEditingId(item.id);
    setError("");
    setResearchError("");
    setNotice(
      "Исследование открыто. Измените настройки или заметки и сохраните обновление.",
    );
  }, []);

  const openPreset = useCallback((preset: ExperimentPreset) => {
    const presetConfig = copyLabConfig(preset.config);
    const validationError = validateExperimentConfig(presetConfig);
    if (validationError) {
      setError(`Не удалось загрузить пример: ${validationError.message}`);
      return;
    }
    setDraft(presetConfig);
    setConfig(presetConfig);
    setLoadedPresetId(preset.id);
    setEditingId(null);
    setError("");
    setResearchError("");
    setNotice("");
  }, []);

  useEffect(() => {
    if (!savedExplorations.hydrated || requestedExplorationHandled.current)
      return;

    requestedExplorationHandled.current = true;
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("exploration");
    if (!requestedId) {
      const presetId = params.get("preset");
      if (!presetId) return;
      const preset = getExperimentPreset(presetId);
      if (preset) openPreset(preset);
      else
        setError("Готовое исследование не найдено. Выберите пример из списка.");
      return;
    }

    const requested = savedExplorations.items.find(
      (item) => item.id === requestedId,
    );
    if (requested) openSaved(requested);
    else setError("Сохранённое исследование не найдено или было удалено.");
  }, [
    savedExplorations.hydrated,
    savedExplorations.items,
    openSaved,
    openPreset,
  ]);

  const setSource = (source: ExperimentSource) => {
    setDraft((current) => {
      const subject =
        source === "instrumented" ? "algorithms" : current.subject;
      const selectedIds =
        subject === current.subject
          ? current.selectedIds
          : defaultIds(subject, current.family);
      const next: LabConfig = {
        ...current,
        source,
        subject,
        selectedIds,
        distribution:
          source === "instrumented" && selectedIds.includes("binary-search")
            ? "sorted"
            : current.distribution,
      };
      return {
        ...next,
        maxSize: Math.min(next.maxSize, getMaximumInputSize(next)),
      };
    });
    setError("");
    setNotice("");
  };

  const setSubject = (subject: ComparisonSubject) => {
    setDraft((current) => ({
      ...current,
      subject,
      selectedIds: defaultIds(subject, current.family),
    }));
    setError("");
    setNotice("");
  };

  const setFamily = (family: ExperimentAlgorithmFamily) => {
    setDraft((current) => {
      const next: LabConfig = {
        ...current,
        family,
        selectedIds: defaultIds("algorithms", family),
        distribution: family === "search" ? "sorted" : current.distribution,
      };
      return {
        ...next,
        maxSize: Math.min(next.maxSize, getMaximumInputSize(next)),
      };
    });
    setError("");
    setNotice("");
  };

  const toggleSeries = (id: string) => {
    setDraft((current) => {
      const selectedIds = current.selectedIds.includes(id)
        ? current.selectedIds.filter((seriesId) => seriesId !== id)
        : [...current.selectedIds, id];
      const next: LabConfig = {
        ...current,
        selectedIds,
        distribution: selectedIds.includes("binary-search")
          ? "sorted"
          : current.distribution,
      };
      return {
        ...next,
        maxSize: Math.min(next.maxSize, getMaximumInputSize(next)),
      };
    });
    setError("");
  };

  const apply = () => {
    const validationError = validateExperimentConfig(draft);
    if (validationError) {
      setError(validationError.message);
      return;
    }
    setError("");
    setNotice(experimentSourceMetadata[draft.source].success);
    startTransition(() => setConfig(copyLabConfig(draft)));
  };

  const reset = () => {
    setDraft(copyLabConfig(defaultConfig));
    setConfig(copyLabConfig(defaultConfig));
    setLoadedPresetId(null);
    setError("");
    setNotice("Настройки возвращены к исходным.");
  };

  const persistResearch = () => {
    const title = research.title.trim();
    if (!title) {
      setResearchError("Введите название исследования перед сохранением.");
      return false;
    }
    if (title.length > 80) {
      setResearchError(
        "Название исследования должно быть не длиннее 80 символов.",
      );
      return false;
    }
    if (
      research.hypothesis.length > 2_000 ||
      research.conclusion.length > 2_000
    ) {
      setResearchError(
        "Гипотеза и вывод должны быть не длиннее 2000 символов каждый.",
      );
      return false;
    }

    const input = {
      title,
      hypothesis: research.hypothesis,
      conclusion: research.conclusion,
      config,
    };
    const saved = editingId
      ? savedExplorations.update(editingId, input)
      : savedExplorations.save(input);
    if (!saved) {
      setResearchError(
        editingId
          ? "Не удалось обновить исследование."
          : "Не удалось сохранить исследование.",
      );
      return false;
    }
    setEditingId(saved.id);
    setResearchError("");
    setNotice(
      editingId
        ? "Исследование обновлено."
        : "Исследование сохранено в этом браузере.",
    );
    return true;
  };

  const stopEditing = () => {
    setEditingId(null);
    setResearch(emptyResearch);
    setResearchError("");
    setNotice("Можно сохранить текущий результат как новое исследование.");
  };

  return (
    <div className="space-y-5">
      <ExperimentPresets onSelect={openPreset} />
      {loadedPreset ? (
        <p className="text-xs leading-5 text-text-secondary" aria-live="polite">
          Загружен пример «{loadedPreset.title}»
          {presetMatches ? "." : "; настройки изменены."}
        </p>
      ) : null}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(340px,32%)_minmax(0,1fr)]">
        <ExperimentSettings
          draft={draft}
          availableSeries={availableSeries}
          maxInputSize={maxInputSize}
          error={error}
          isPending={isPending}
          onSourceChange={setSource}
          onSubjectChange={setSubject}
          onFamilyChange={setFamily}
          onToggleSeries={toggleSeries}
          onConfigChange={(patch) =>
            setDraft((current) => ({ ...current, ...patch }))
          }
          onApply={apply}
          onReset={reset}
        />
        <div className="min-w-0 space-y-5">
          {draft.source !== result.source ? (
            <output className="block rounded-lg border border-border bg-surface p-4 text-sm text-text-secondary">
              Источник изменён. Нажмите «
              {experimentSourceMetadata[draft.source].action}», чтобы получить
              результат для выбранного режима.
            </output>
          ) : (
            <>
              <ExperimentResultTabs result={result} />
              <ExperimentResults
                result={result}
                inputSize={comparisonInputSize}
                onInputSizeChange={setSelectedInputSize}
              />
              {notice ? (
                <output
                  className="block border-l-2 border-accent bg-accent/8 px-4 py-3 text-sm text-text-primary"
                  aria-live="polite"
                >
                  {notice}
                </output>
              ) : null}
              <SaveResearchDialog
                hydrated={savedExplorations.hydrated}
                storageError={savedExplorations.storageError}
                researchError={researchError}
                research={research}
                editingId={editingId}
                onResearchChange={(patch) => {
                  setResearch((current) => ({ ...current, ...patch }));
                  setResearchError("");
                }}
                onPersist={persistResearch}
                onCancelEditing={stopEditing}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
