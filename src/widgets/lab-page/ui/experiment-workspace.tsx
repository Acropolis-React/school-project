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
  getAvailableExperimentSeries,
  getMaximumInputSize,
  runExperiment,
  validateExperimentConfig,
} from "@/features/run-experiment";
import {
  copyLabConfig,
  defaultConfig,
  defaultIds,
  emptyResearch,
  type LabConfig,
  type ResearchFields,
} from "../model/lab-config";
import { ExperimentChart } from "./experiment-chart";
import { ExperimentResults } from "./experiment-results";
import { ExperimentSettings } from "./experiment-settings";
import { SavedExplorationsPanel } from "./saved-explorations-panel";

export function ExperimentWorkspace() {
  const [draft, setDraft] = useState<LabConfig>(defaultConfig);
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [error, setError] = useState("");
  const [researchError, setResearchError] = useState("");
  const [notice, setNotice] = useState("");
  const [research, setResearch] = useState<ResearchFields>(emptyResearch);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const requestedExplorationHandled = useRef(false);
  const savedExplorations = useSavedExplorations();
  const availableSeries = getAvailableExperimentSeries(draft);
  const maxInputSize = getMaximumInputSize(draft);
  const result = useMemo(() => runExperiment(config), [config]);

  const openSaved = useCallback((item: SavedExploration) => {
    const restored = copyLabConfig(item.config);
    setDraft(restored);
    setConfig(restored);
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
    setNotice(
      draft.source === "instrumented"
        ? "Эксперимент выполнен: показаны точные счётчики операций."
        : "Теоретическая модель обновлена.",
    );
    startTransition(() => setConfig(copyLabConfig(draft)));
  };

  const reset = () => {
    setDraft(copyLabConfig(defaultConfig));
    setConfig(copyLabConfig(defaultConfig));
    setError("");
    setNotice("Настройки возвращены к исходным.");
  };

  const persistResearch = () => {
    const title = research.title.trim();
    if (!title) {
      setResearchError("Введите название исследования перед сохранением.");
      return;
    }
    if (title.length > 80) {
      setResearchError(
        "Название исследования должно быть не длиннее 80 символов.",
      );
      return;
    }
    if (
      research.hypothesis.length > 2_000 ||
      research.conclusion.length > 2_000
    ) {
      setResearchError(
        "Гипотеза и вывод должны быть не длиннее 2000 символов каждый.",
      );
      return;
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
      return;
    }
    setEditingId(saved.id);
    setResearchError("");
    setNotice(
      editingId
        ? "Исследование обновлено."
        : "Исследование сохранено в этом браузере.",
    );
  };

  const stopEditing = () => {
    setEditingId(null);
    setResearch(emptyResearch);
    setResearchError("");
    setNotice("Можно сохранить текущий результат как новое исследование.");
  };

  const removeSaved = (id: string) => {
    savedExplorations.remove(id);
    if (editingId === id) stopEditing();
  };

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
        <ExperimentChart result={result} />
      </div>
      <ExperimentResults result={result} />
      <SavedExplorationsPanel
        items={savedExplorations.items}
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
        onOpen={openSaved}
        onRemove={removeSaved}
      />
    </div>
  );
}
