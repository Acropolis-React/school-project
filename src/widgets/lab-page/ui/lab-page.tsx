import { PageHeader } from "@/shared/ui";
import { ExperimentWorkspace } from "./experiment-workspace";

export function LabPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Лаборатория"
        description="Выберите алгоритмы или классы Big O, настройте диапазон и сравните их теоретический рост. Здесь нет реальных запусков алгоритмов."
      />
      <ExperimentWorkspace />
    </div>
  );
}
