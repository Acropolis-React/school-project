import type { LessonSlug } from "../model/types";

type DemonstrationRow = { label: string; value: number };
export type LessonDemonstration = {
  explanation: string;
  steps: string[];
  rows: DemonstrationRow[];
  meaning: string;
};

/** Educational formulas only: these values never come from instrumented execution. */
export function getLessonDemonstration(
  slug: LessonSlug,
  n: number,
): LessonDemonstration {
  if (
    !Number.isInteger(n) ||
    n < 2 ||
    n > 128 ||
    !Number.isInteger(Math.log2(n))
  ) {
    throw new RangeError(
      "Demonstration size must be a power of two from 2 to 128",
    );
  }
  const levels = Math.ceil(Math.log2(n));
  switch (slug) {
    case "what-is-big-o":
      return {
        explanation: `При n = ${n} полный проход посещает ${n} элементов. Перебор всех упорядоченных пар, включая пару элемента с собой, даёт ${n} · ${n} = ${n * n} посещений. Увеличьте n вдвое и сравните изменения.`,
        steps: ["Один элемент за шаг", "n элементов", "n × n пар"],
        rows: [
          { label: "Проход: n", value: n },
          { label: "Все пары: n²", value: n * n },
        ],
        meaning: "Условные посещения по формулам; не счётчики программы",
      };
    case "linear-and-quadratic":
      return {
        explanation: `Чтение a[0] не зависит от длины. Два прохода подряд дают ${n} + ${n}; вложенные полные проходы — ${n} · ${n}. Постоянный внутренний предел 5 даёт ${n} · 5, а не n².`,
        steps: [
          "Последовательно: сложить",
          "Вложенно: учесть внутреннюю границу",
        ],
        rows: [
          { label: "Доступ: 1", value: 1 },
          { label: "Два прохода: 2n", value: 2 * n },
          { label: "Пять шагов внутри: 5n", value: 5 * n },
          { label: "Полные пары: n²", value: n * n },
        ],
        meaning: "Вычисленное число выбранных действий в учебных схемах",
      };
    case "same-complexity-different-costs":
      return {
        explanation: `Два вызова на элемент дают ${2 * n}, восемь — ${8 * n}. Их отношение ${8 * n} / ${2 * n} = 4 сохраняется при любом выбранном n. Оба количества растут линейно.`,
        steps: [
          "Одинаковое действие work()",
          "Одинаковый размер",
          "Разные постоянные множители",
        ],
        rows: [
          { label: "Два вызова: 2n", value: 2 * n },
          { label: "Восемь вызовов: 8n", value: 8 * n },
        ],
        meaning: "Вызовы по учебной формуле; не счётчики сортировок и не время",
      };
    case "logarithmic": {
      const sizes = [n];
      while (sizes[sizes.length - 1] > 1)
        sizes.push(Math.ceil(sizes[sizes.length - 1] / 2));
      return {
        explanation: `До одного кандидата требуется ${sizes.length - 1} делений пополам с округлением вверх. Это схема уменьшения диапазона; реальный поиск также проверяет кандидата и может делать несколько сравнений за итерацию.`,
        steps: sizes.map((size) => `${size}`),
        rows: [
          { label: "Линейная модель: n", value: n },
          { label: "Деления до одного: ⌈log₂ n⌉", value: levels },
        ],
        meaning: "Модель посещений и делений; не реальные сравнения поиска",
      };
    }
    case "n-log-n":
      return {
        explanation: `Для выбранной степени двойки n = ${n} есть ${levels} уровней слияния. На каждом суммарно обрабатывается ${n} элементов: модель ${n} · ${levels} = ${n * levels}. Сравните с n².`,
        steps: Array.from(
          { length: levels },
          (_, i) => `${n / 2 ** (i + 1)} × ${2 ** (i + 1)} = ${n} элементов`,
        ),
        rows: [
          { label: "Модель слияний: n log₂ n", value: n * levels },
          { label: "Модель всех пар: n²", value: n * n },
        ],
        meaning:
          "Модельные обработки элементов; уровни перечислены от пар к целому массиву",
      };
    case "input-cases":
      return {
        explanation: `При ${n} элементах первая цель требует одну проверку, отсутствующая — ${n}. Если цель точно есть и позиции равновероятны, среднее равно (${n} + 1) / 2 = ${(n + 1) / 2}. Это среднее многих возможных входов, не дробное действие одного запуска.`,
        steps: [
          "Первая цель: остановка сразу",
          "Последняя или отсутствует: весь массив",
          "Среднее: нужны вероятности",
        ],
        rows: [
          { label: "Лучший: 1", value: 1 },
          {
            label: "Средний при равных вероятностях: (n + 1)/2",
            value: (n + 1) / 2,
          },
          { label: "Худший: n", value: n },
        ],
        meaning: "Числа сравнений, выведенные по схеме линейного поиска",
      };
    case "analyze-code":
      return {
        explanation: `Внешний i принимает ${Array.from({ length: levels }, (_, i) => 2 ** i).join(", ")}. Для каждого значения внутренний цикл вызывает inspect ${n} раз: всего ${levels} · ${n} = ${levels * n}. Зависимая граница j < i в другом фрагменте требует суммы, а не этого произведения.`,
        steps: [
          "Внешний цикл: удвоение",
          `Внутренний: ${n} вызовов каждый раз`,
          "Общая работа: произведение",
        ],
        rows: [
          {
            label: "Удвоение с полным проходом: n ⌈log₂ n⌉",
            value: n * levels,
          },
          {
            label: "Треугольный перебор: n(n − 1)/2",
            value: (n * (n - 1)) / 2,
          },
        ],
        meaning: "Вызовы inspect по границам учебных фрагментов; не запуск C++",
      };
  }
}
