import {
  type AlgorithmId,
  algorithms,
  executeAlgorithm,
  generateArray,
  generateSearchInput,
  type SearchAlgorithmId,
  type SortingAlgorithmId,
} from "@/entities/algorithm";
import {
  complexityModels,
  type LabExperimentConfig,
} from "@/entities/experiment";
import type {
  ExperimentDataPoint,
  ExperimentSeriesDefinition,
  LabExperimentResult,
} from "../model/types";
import { getDistributionLabel, getMetricLabel } from "./experiment-options";
import { validateExperimentConfig } from "./validate-config";

const instrumentedAssumptions: Record<AlgorithmId, string> = {
  "linear-search":
    "Последовательный проход слева направо с ранним завершением.",
  "binary-search":
    "Итеративный поиск точного совпадения в отсортированном массиве.",
  "bubble-sort":
    "Стабильная версия с уменьшением границы прохода и ранним завершением.",
  "insertion-sort": "Стабильная версия со сдвигами элементов вправо.",
  "merge-sort":
    "Стабильная рекурсивная версия с одним вспомогательным массивом.",
};

function isSearchAlgorithmId(value: string): value is SearchAlgorithmId {
  return value === "linear-search" || value === "binary-search";
}

function isSortingAlgorithmId(value: string): value is SortingAlgorithmId {
  return (
    value === "bubble-sort" ||
    value === "insertion-sort" ||
    value === "merge-sort"
  );
}

function getInputSizes(config: LabExperimentConfig): number[] {
  const step = (config.maxSize - config.minSize) / (config.samples - 1);
  return Array.from({ length: config.samples }, (_, index) =>
    Math.round(config.minSize + step * index),
  );
}

function getPointSeed(seed: number, index: number): number {
  return (seed + Math.imul(index + 1, 0x9e37_79b1)) >>> 0;
}

function getSeries(config: LabExperimentConfig): ExperimentSeriesDefinition[] {
  if (config.subject === "complexities") {
    return complexityModels
      .filter((model) => config.selectedIds.includes(model.id))
      .map((model) => ({
        id: model.id,
        label: model.label,
        shortLabel: model.shortLabel,
        complexity: model.shortLabel,
        formula:
          model.id === "constant"
            ? "1"
            : model.id === "logarithmic"
              ? "log₂(n)"
              : model.id === "linear"
                ? "n"
                : model.id === "linearithmic"
                  ? "n · log₂(n)"
                  : "n²",
        assumption: "Нормализованная математическая функция роста.",
        color: model.color,
      }));
  }

  return algorithms
    .filter(
      (algorithm) =>
        algorithm.family === config.family &&
        config.selectedIds.includes(algorithm.id),
    )
    .map((algorithm) => ({
      id: algorithm.id,
      label: algorithm.label,
      shortLabel: algorithm.shortLabel,
      complexity: algorithm.complexity,
      formula: config.source === "theoretical" ? algorithm.formula : null,
      assumption:
        config.source === "theoretical"
          ? algorithm.assumption
          : instrumentedAssumptions[algorithm.id],
      color: algorithm.color,
    }));
}

function runTheoretical(
  config: LabExperimentConfig,
  series: ExperimentSeriesDefinition[],
): LabExperimentResult {
  const points = getInputSizes(config).map((inputSize) => {
    const point: ExperimentDataPoint = { inputSize };
    for (const item of series) {
      const model =
        config.subject === "complexities"
          ? complexityModels.find((entry) => entry.id === item.id)
          : algorithms.find((entry) => entry.id === item.id);
      if (model) point[item.id] = Math.round(model.evaluate(inputSize));
    }
    return point;
  });

  return {
    source: "theoretical",
    metric: "model-value",
    points,
    series,
    disclosure: "Теоретическая модель · не реальные измерения",
    yAxisLabel: "Модельное значение, усл. ед.",
    tableCaption: "Теоретические модельные значения выбранных рядов",
    assumptions: [
      "Точки вычислены по математическим функциям роста, а алгоритмы не запускались.",
      "Коэффициенты нормализованы для учебного сравнения и не обозначают время или точные операции.",
    ],
    observations: [
      "Сравнивайте форму и скорость роста кривых, а не абсолютные значения между разными реализациями.",
      "Big O описывает асимптотическое поведение и не заменяет точный анализ конкретного кода.",
    ],
    config,
  };
}

function runInstrumented(
  config: LabExperimentConfig,
  series: ExperimentSeriesDefinition[],
): LabExperimentResult {
  const points = getInputSizes(config).map((inputSize, pointIndex) => {
    const seed = getPointSeed(config.seed, pointIndex);
    const point: ExperimentDataPoint = { inputSize };

    if (config.family === "search") {
      const generated = generateSearchInput({
        size: inputSize,
        kind: config.distribution,
        seed,
        targetPosition: config.targetPosition,
      });
      for (const item of series) {
        if (!isSearchAlgorithmId(item.id))
          throw new Error("Некорректный алгоритм поиска в конфигурации.");
        const execution = executeAlgorithm({
          algorithmId: item.id,
          input: generated.values,
          target: generated.target,
        });
        point[item.id] = execution.counts[config.metric];
      }
    } else {
      const generated = generateArray({
        size: inputSize,
        kind: config.distribution,
        seed,
      });
      for (const item of series) {
        if (!isSortingAlgorithmId(item.id))
          throw new Error("Некорректный алгоритм сортировки в конфигурации.");
        const execution = executeAlgorithm({
          algorithmId: item.id,
          input: generated.values,
        });
        point[item.id] = execution.counts[config.metric];
      }
    }
    return point;
  });

  const observations: string[] = [];
  if (config.family === "search") {
    observations.push(
      config.targetPosition === "missing"
        ? "Искомого значения нет: линейный поиск проверяет весь вход, а бинарный последовательно сокращает отсортированный диапазон."
        : "Позиция цели влияет на раннее завершение поиска; одинаковый seed воспроизводит ту же позицию для каждой точки.",
    );
  } else if (config.distribution === "sorted") {
    observations.push(
      "На отсортированном входе пузырьковая сортировка завершает работу после первого прохода, а сортировка вставками почти не выполняет сдвигов.",
    );
  } else if (config.distribution === "reverse-sorted") {
    observations.push(
      "Обратный порядок создаёт много перестановок для пузырьковой сортировки и много сдвигов для сортировки вставками.",
    );
  } else if (config.distribution === "nearly-sorted") {
    observations.push(
      "Почти отсортированный вход особенно выгоден алгоритмам с ранним завершением или небольшим числом сдвигов.",
    );
  } else {
    observations.push(
      "Случайные входы являются воспроизводимыми перестановками: повтор с тем же seed даёт те же точные значения.",
    );
  }
  if (config.metric === "swaps" && config.family === "sorting") {
    observations.push(
      "Нулевые обмены у сортировки вставками и слиянием корректны: они используют записи и сдвиги, а не явный swap.",
    );
  } else if (config.metric === "swaps") {
    observations.push(
      "Алгоритмы поиска не меняют массив, поэтому число обменов для них всегда равно нулю.",
    );
  } else {
    observations.push(
      `График показывает метрику «${getMetricLabel(config.metric)}»; другие категории операций могут вести себя иначе.`,
    );
  }

  return {
    source: "instrumented",
    metric: config.metric,
    points,
    series,
    disclosure: "Точные счётчики операций · не время выполнения",
    yAxisLabel: `${getMetricLabel(config.metric)}, количество`,
    tableCaption: `Точные значения метрики «${getMetricLabel(config.metric)}»`,
    assumptions: [
      `Распределение: ${getDistributionLabel(config.distribution)}; базовый seed: ${config.seed}.`,
      "Не учитываются проверки границ циклов, работа с индексами, рекурсия, выделение памяти, проверка входа и копирование результата.",
      "Итоговая метрика равна сумме сравнений, чтений и записей; обмены повторно в сумму не добавляются.",
    ],
    observations,
    config,
  };
}

export function runExperiment(
  config: LabExperimentConfig,
): LabExperimentResult {
  const validationError = validateExperimentConfig(config);
  if (validationError) throw new Error(validationError.message);
  const series = getSeries(config);
  return config.source === "theoretical"
    ? runTheoretical(config, series)
    : runInstrumented(config, series);
}

export function getAvailableExperimentSeries(
  config: LabExperimentConfig,
): ExperimentSeriesDefinition[] {
  const allIds =
    config.subject === "complexities"
      ? complexityModels.map((model) => model.id)
      : algorithms
          .filter((algorithm) => algorithm.family === config.family)
          .map((algorithm) => algorithm.id);
  return getSeries({ ...config, selectedIds: allIds });
}
