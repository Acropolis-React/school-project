import { PageHeader } from "@/shared/ui";
import { ExperimentWorkspace } from "./experiment-workspace";

export function LabPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Лаборатория"
        description="Сравнивайте теоретический рост или запускайте встроенные алгоритмы с точным подсчётом операций. Оба режима явно показывают источник данных и допущения."
      />
      <ExperimentWorkspace />
    </div>
  );
}
