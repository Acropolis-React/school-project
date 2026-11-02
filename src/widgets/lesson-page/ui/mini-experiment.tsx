import { FlaskConical, Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { generateExperiment, getComplexityModel } from "@/entities/experiment";
import type { Lesson } from "@/entities/lesson";
import { MiniExperimentChart } from "./mini-experiment-chart";

export function MiniExperiment({ lesson }: { lesson: Lesson }) {
  const data = useMemo(
    () =>
      generateExperiment({
        modelIds: lesson.experimentModels,
        minSize: 10,
        maxSize: 80,
        samples: 5,
      }),
    [lesson.experimentModels],
  );
  const models = lesson.experimentModels
    .map(getComplexityModel)
    .filter((model) => model !== undefined);

  return (
    <div>
      <div className="flex items-start gap-3">
        <FlaskConical className="mt-1 text-accent" size={22} />
        <div>
          <h2 className="text-xl font-semibold">Сравните модели</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Теоретические значения в условных единицах. Это не запуск алгоритма
            и не замер времени.
          </p>
        </div>
      </div>
      <MiniExperimentChart lesson={lesson} />
      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[480px] border-collapse text-right text-sm">
          <caption className="sr-only">
            Сравнение модельных значений функций сложности
          </caption>
          <thead className="bg-surface-raised text-xs text-text-secondary">
            <tr>
              <th className="px-4 py-3 text-left">Размер n</th>
              {models.map((model) => (
                <th
                  key={model.id}
                  className="px-4 py-3"
                  style={{ color: model.color }}
                >
                  {model.shortLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((point) => (
              <tr key={point.inputSize}>
                <th className="px-4 py-3 text-left font-mono font-normal text-text-secondary">
                  {point.inputSize}
                </th>
                {models.map((model) => (
                  <td key={model.id} className="px-4 py-3 font-mono">
                    {point[model.id]?.toLocaleString("ru-RU")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-text-secondary">
        <Lightbulb className="mt-0.5 shrink-0 text-warning" size={17} />
        Обратите внимание не на точные числа, а на то, как увеличивается разрыв
        между столбцами.
      </p>
    </div>
  );
}
