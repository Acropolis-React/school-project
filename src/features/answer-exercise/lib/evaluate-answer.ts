import type { LessonQuestion } from "@/entities/lesson";

const hints: Record<string, string> = {
  "code-trace-exercise":
    "Выпишите все значения i меньше 10, затем умножьте число внешних проходов на число внутренних вызовов.",
  "fixed-inner-loop-practice":
    "Проверьте, зависит ли граница внутреннего цикла от n. Сколько вызовов приходится на один внешний шаг?",
  "halving-count-practice":
    "Выпишите всю цепочку до 1 и считайте переходы, а не количество чисел в ней.",
  "merge-levels-practice":
    "На каждом уровне есть своя работа. Нужно объединить одинаковую работу всех четырёх уровней.",
  "search-worst-case-practice":
    "У линейного поиска нет сведений о непроверенных элементах. Когда он сможет убедиться, что совпадений нет?",
  "what-is-big-o-hypothesis":
    "Подставьте n и 2n в выражение f(n) = n и сравните результаты.",
  "what-is-big-o-practice":
    "Посчитайте, сколько раз тело цикла выполняется для массива из n элементов.",
  "big-o-bound-practice":
    "Верхняя граница допускает разные точные числа операций и не задаёт единицы времени.",
  "big-o-classes-practice":
    "Для каждого элемента есть два независимых решения: включить его или пропустить. Сколько комбинаций это даёт?",
  "linear-sequential-prediction":
    "Последовательные части выполняются друг за другом: сложите их количества.",
  "linear-and-quadratic-practice":
    "Циклы идут друг за другом: сложите их повторения, а не перемножайте.",
  "same-complexity-hypothesis":
    "Сравните 2n и 8n делением; подумайте, что именно считается, прежде чем говорить о времени.",
  "same-complexity-practice-input":
    "Оценка ограничивает рост, но не фиксирует поведение реализации или состав входа.",
  "same-complexity-practice-metric":
    "Время зависит не только от записей: какие другие действия выполняет программа?",
  "logarithmic-hypothesis": "Сравните число делений пополам для n и 2n.",
  "logarithmic-practice":
    "Подумайте, можно ли отбросить половину, если значения в ней расположены без порядка.",
  "n-log-n-hypothesis":
    "Сравните множители n и log₂ n в двух моделях при увеличении n.",
  "n-log-n-practice":
    "Рассмотрите отдельно число уровней деления и суммарную работу слияния на одном уровне.",
  "input-cases-hypothesis":
    "В лучшем случае поиск заканчивается как можно раньше. Где может находиться цель?",
  "input-cases-practice":
    "Среднее зависит от того, какие входы возможны и насколько часто они встречаются.",
  "analyze-code-hypothesis":
    "Выпишите несколько значений i: 1, 2, 4, 8. Как меняется число оставшихся шагов?",
  "analyze-code-practice-n-log-n":
    "Внешняя переменная удваивается, а внутренний цикл проходит все n значений на каждом шаге.",
  "analyze-code-practice-triangle":
    "Сложите количества внутренних итераций: 0 + 1 + … + (n − 1).",
  "analyze-code-practice-halving":
    "Сначала найдите число делений j пополам, затем учтите n внешних повторений.",
};

export type AnswerResult = { correct: boolean; explanation: string };

export function evaluateAnswer(
  question: LessonQuestion,
  choiceId: string,
): AnswerResult {
  const correct = choiceId === question.correctChoiceId;
  return {
    correct,
    explanation: correct
      ? question.explanation
      : (hints[question.id] ??
        "Вернитесь к условию и проверьте число повторений и предположения."),
  };
}
