import type {
  ExperimentTargetPosition,
  InputDistribution,
  OperationMetric,
} from "@/entities/experiment";

export const operationMetricOptions: Array<{
  id: OperationMetric;
  label: string;
  shortLabel: string;
  explanation: string;
}> = [
  {
    id: "total",
    label: "Все основные операции",
    shortLabel: "Всего операций",
    explanation:
      "Сравнения + чтения + записи. Обмены отдельно не прибавляются повторно.",
  },
  {
    id: "comparisons",
    label: "Сравнения значений",
    shortLabel: "Сравнения",
    explanation: "Проверки отношений между значениями алгоритма.",
  },
  {
    id: "arrayReads",
    label: "Чтения массива",
    shortLabel: "Чтения",
    explanation: "Получения элементов основного или вспомогательного массива.",
  },
  {
    id: "arrayWrites",
    label: "Записи в массив",
    shortLabel: "Записи",
    explanation: "Присваивания в основной или вспомогательный массив.",
  },
  {
    id: "swaps",
    label: "Обмены элементов",
    shortLabel: "Обмены",
    explanation:
      "Явные обмены двух позиций; сдвиги и слияния ими не считаются.",
  },
];

export const inputDistributionOptions: Array<{
  id: InputDistribution;
  label: string;
  explanation: string;
}> = [
  {
    id: "random",
    label: "Случайный",
    explanation: "Воспроизводимая перестановка значений от 0 до n − 1.",
  },
  {
    id: "sorted",
    label: "Отсортированный",
    explanation: "Значения расположены по возрастанию.",
  },
  {
    id: "reverse-sorted",
    label: "Обратный порядок",
    explanation: "Значения расположены по убыванию.",
  },
  {
    id: "nearly-sorted",
    label: "Почти отсортированный",
    explanation: "Около 5% соседних пар детерминированно переставлены.",
  },
];

export const targetPositionOptions: Array<{
  id: ExperimentTargetPosition;
  label: string;
}> = [
  { id: "first", label: "Первый элемент" },
  { id: "middle", label: "Середина" },
  { id: "last", label: "Последний элемент" },
  { id: "random", label: "Случайная позиция" },
  { id: "missing", label: "Элемент отсутствует" },
];

export function getMetricLabel(metric: OperationMetric): string {
  return (
    operationMetricOptions.find((option) => option.id === metric)?.shortLabel ??
    metric
  );
}

export function getDistributionLabel(distribution: InputDistribution): string {
  return (
    inputDistributionOptions.find((option) => option.id === distribution)
      ?.label ?? distribution
  );
}
