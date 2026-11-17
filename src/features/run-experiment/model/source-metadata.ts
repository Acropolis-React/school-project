import type { ExperimentSource } from "@/entities/experiment";

export const experimentSourceMetadata = {
  theoretical: {
    label: "Теоретическая модель",
    chartTitle: "Теоретический рост",
    description:
      "Значения вычисляются по учебным формулам и округляются; алгоритмы не запускаются. Это не число операций и не время выполнения.",
    disclosure: "Теоретическая модель · условные единицы",
    tableDescription: "Значения вычислены по формулам и округлены до целых.",
    action: "Построить модель",
    success: "Теоретическая модель обновлена.",
  },
  instrumented: {
    label: "Подсчёт операций",
    chartTitle: "Подсчитанные операции алгоритмов",
    description:
      "Встроенные алгоритмы выполняются на воспроизводимых сгенерированных входах; подсчитываются выбранные операции, а не время выполнения.",
    disclosure: "Подсчёт операций · не время выполнения",
    tableDescription:
      "Счётчики относятся к выбранным операциям встроенных реализаций; повтор с теми же настройками и seed даёт тот же результат.",
    action: "Запустить эксперимент",
    success: "Эксперимент выполнен: показаны счётчики выбранных операций.",
  },
} satisfies Record<
  ExperimentSource,
  {
    label: string;
    chartTitle: string;
    description: string;
    disclosure: string;
    tableDescription: string;
    action: string;
    success: string;
  }
>;
