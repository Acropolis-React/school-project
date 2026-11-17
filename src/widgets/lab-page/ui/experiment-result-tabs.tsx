import { type KeyboardEvent, useState } from "react";
import {
  ExperimentTable,
  experimentSourceMetadata,
  type LabExperimentResult,
} from "@/features/run-experiment";
import { ExperimentChart } from "./experiment-chart";

type ResultTab = "chart" | "table";

export function ExperimentResultTabs({
  result,
}: {
  result: LabExperimentResult;
}) {
  const [activeTab, setActiveTab] = useState<ResultTab>("chart");
  const tabs = [
    { id: "chart", label: "График" },
    { id: "table", label: "Таблица" },
  ] as const;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "chart"
        : event.key === "End"
          ? "table"
          : activeTab === "chart"
            ? "table"
            : "chart";
    setActiveTab(next);
    document.getElementById(`result-tab-${next}`)?.focus();
  }

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Представление результатов"
        onKeyDown={handleKeyDown}
        className="flex gap-1 border-b border-border"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`result-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`result-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-11 border-b-2 px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${activeTab === tab.id ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id="result-panel-chart"
        role="tabpanel"
        aria-labelledby="result-tab-chart"
        hidden={activeTab !== "chart"}
        className="pt-4"
      >
        {activeTab === "chart" ? <ExperimentChart result={result} /> : null}
      </div>
      <div
        id="result-panel-table"
        role="tabpanel"
        aria-labelledby="result-tab-table"
        hidden={activeTab !== "table"}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: The tab panel has no interactive content and must be reachable by keyboard.
        tabIndex={0}
        className="min-w-0 pt-4 focus-visible:outline-2 focus-visible:outline-accent"
      >
        {activeTab === "table" ? (
          <section
            className="min-w-0 border-y border-border"
            aria-labelledby="table-heading"
          >
            <div className="border-b border-border py-3">
              <h2 id="table-heading" className="font-semibold">
                Значения точек
              </h2>
              <p className="mt-1 text-xs leading-5 text-text-muted">
                {result.yAxisLabel}.{" "}
                {experimentSourceMetadata[result.source].tableDescription}
              </p>
            </div>
            <ExperimentTable result={result} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
