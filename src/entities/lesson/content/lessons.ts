import type { Lesson } from "../model/types";

export const lessons: Lesson[] = [
  {
    slug: "what-is-big-o",
    number: 1,
    title: "Введение в Big O",
    description:
      "Что такое асимптотический рост и почему важен размер входа n.",
    duration: "12 мин",
    theory: [
      "Big O описывает, как меняется верхняя граница роста затрат алгоритма при увеличении входа n. Это не секундомер и не точное число операций.",
      "Константы и небольшие слагаемые обычно не меняют класс роста: 3n + 10 относится к O(n). Для точной тесной границы используют Θ, когда она доказана.",
    ],
    code: "int sum = 0;\nfor (int i = 0; i < n; ++i) {\n  sum += values[i];\n}\nreturn sum;",
    codeCaption: "Цикл проходит по каждому элементу один раз.",
    hypothesis: {
      prompt:
        "Если n увеличить в 2 раза, как примерно изменится число шагов линейного алгоритма?",
      choices: [
        { id: "same", label: "Не изменится" },
        { id: "double", label: "Увеличится примерно в 2 раза" },
        { id: "four", label: "Увеличится примерно в 4 раза" },
      ],
      correctChoiceId: "double",
      explanation:
        "Для модели f(n) = n удвоение n удваивает модельное значение.",
    },
    experimentModels: ["linear", "quadratic"],
    interpretation: [
      "Линейная кривая растёт равномерно: удвоение n удваивает значение модели.",
      "Квадратичная кривая быстро отрывается: при удвоении n значение n² увеличивается в четыре раза.",
    ],
    practice: {
      prompt: "Какова временная сложность показанного цикла?",
      choices: [
        { id: "constant", label: "O(1) — константная" },
        { id: "linear", label: "O(n) — линейная" },
        { id: "quadratic", label: "O(n²) — квадратичная" },
      ],
      correctChoiceId: "linear",
      explanation:
        "Тело цикла выполняется n раз, поэтому рост линейный: Θ(n), а значит и O(n).",
    },
  },
  {
    slug: "linear-and-quadratic",
    number: 2,
    title: "O(1), O(n), O(n²)",
    description:
      "Последовательные и вложенные циклы, константный и квадратичный рост.",
    duration: "15 мин",
    theory: [
      "Один доступ по индексу обычно моделируют как O(1), один полный проход — как O(n). Два независимых последовательных прохода дают O(n + n) = O(n).",
      "Вложенность сама по себе не доказывает O(n²): нужно изучить границы циклов. Если внутренний цикл выполняется i раз, сумма 1 + … + n всё же имеет квадратичный рост.",
    ],
    code: "for (int i = 0; i < n; ++i) {\n  for (int j = 0; j < n; ++j) {\n    visit(i, j);\n  }\n}",
    codeCaption:
      "Для каждой из n итераций внешний цикл запускает n внутренних.",
    hypothesis: {
      prompt: "Что произойдёт с моделью n² при удвоении n?",
      choices: [
        { id: "double", label: "Рост примерно в 2 раза" },
        { id: "four", label: "Рост примерно в 4 раза" },
        { id: "eight", label: "Рост примерно в 8 раз" },
      ],
      correctChoiceId: "four",
      explanation:
        "(2n)² = 4n², поэтому модельное значение увеличивается в четыре раза.",
    },
    experimentModels: ["linear", "quadratic"],
    interpretation: [
      "Разница между n и n² невелика на малых n, но быстро становится существенной.",
      "Два последовательных цикла — не то же самое, что два вложенных.",
    ],
    practice: {
      prompt: "Два последовательных цикла по n элементов имеют сложность…",
      choices: [
        { id: "linear", label: "O(n)" },
        { id: "quadratic", label: "O(n²)" },
        { id: "constant", label: "O(1)" },
      ],
      correctChoiceId: "linear",
      explanation:
        "n + n = 2n; постоянный множитель не меняет асимптотический класс.",
    },
  },
  {
    slug: "logarithmic",
    number: 3,
    title: "O(log n)",
    description: "Повторное деление задачи пополам и условие бинарного поиска.",
    duration: "14 мин",
    theory: [
      "Логарифмический рост возникает, когда на каждом шаге размер оставшейся задачи уменьшается в несколько раз.",
      "Бинарный поиск работает за O(log n), только если данные отсортированы и доступ к середине достаточно быстрый.",
    ],
    code: "while (left <= right) {\n  int mid = left + (right - left) / 2;\n  if (a[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}",
    codeCaption: "После каждой проверки остаётся примерно половина диапазона.",
    hypothesis: {
      prompt:
        "Если размер отсортированного массива удвоить, сколько шагов примерно добавится?",
      choices: [
        { id: "one", label: "Около одного шага" },
        { id: "double", label: "Число шагов удвоится" },
        { id: "none", label: "Ни одного" },
      ],
      correctChoiceId: "one",
      explanation: "log₂(2n) = log₂(n) + 1.",
    },
    experimentModels: ["logarithmic", "quadratic"],
    interpretation: [
      "Логарифм растёт очень медленно даже на больших входах.",
      "Форма кривой не отменяет предусловия: бинарный поиск требует сортировки.",
    ],
    practice: {
      prompt:
        "Можно ли применять обычный бинарный поиск к неотсортированному массиву?",
      choices: [
        { id: "yes", label: "Да, всегда" },
        { id: "no", label: "Нет, результат не гарантирован" },
        { id: "only-even", label: "Только при чётном n" },
      ],
      correctChoiceId: "no",
      explanation:
        "Без порядка нельзя корректно отбросить половину диапазона после сравнения.",
    },
  },
  {
    slug: "n-log-n",
    number: 4,
    title: "O(n log n)",
    description:
      "Линейно-логарифмический рост и эффективные алгоритмы сортировки.",
    duration: "16 мин",
    theory: [
      "O(n log n) часто появляется, когда задача делится на уровни, а на каждом уровне обрабатываются все n элементов.",
      "Сортировка слиянием имеет Θ(n log n) по времени для стандартной реализации, но требует дополнительной памяти.",
    ],
    code: "mergeSort(a, left, mid);\nmergeSort(a, mid + 1, right);\nmerge(a, left, mid, right);",
    codeCaption:
      "log n уровней разбиения, на каждом уровне — линейное слияние.",
    hypothesis: {
      prompt: "Какая модель быстрее растёт на больших n?",
      choices: [
        { id: "nlogn", label: "n log₂ n" },
        { id: "square", label: "n²" },
        { id: "same", label: "Одинаково" },
      ],
      correctChoiceId: "square",
      explanation: "Отношение n² / (n log n) = n / log n растёт с n.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "На малых входах накладные расходы реализации могут быть заметны, но модель описывает асимптотический рост.",
      "Big O не сравнивает конкретные реализации по времени на одном устройстве.",
    ],
    practice: {
      prompt: "Почему сортировка слиянием относится к Θ(n log n)?",
      choices: [
        { id: "levels", label: "log n уровней по n работы" },
        { id: "nested", label: "Всегда два вложенных цикла" },
        { id: "constant", label: "Данные не просматриваются" },
      ],
      correctChoiceId: "levels",
      explanation:
        "Разбиение создаёт логарифмическое число уровней, а суммарное слияние на уровне линейно.",
    },
  },
  {
    slug: "input-cases",
    number: 5,
    title: "Лучший, средний и худший случаи",
    description: "Как свойства входа меняют работу алгоритма и смысл оценки.",
    duration: "15 мин",
    theory: [
      "Один алгоритм может выполнять разное число шагов на разных входах одинакового размера.",
      "Всегда уточняйте, о каком случае идёт речь и какие предположения лежат в основе среднего случая.",
    ],
    code: "for (int i = 0; i < n; ++i) {\n  if (a[i] == target) return i;\n}\nreturn -1;",
    codeCaption:
      "Линейный поиск может завершиться сразу или проверить весь массив.",
    hypothesis: {
      prompt: "Каков лучший случай линейного поиска?",
      choices: [
        { id: "constant", label: "Θ(1)" },
        { id: "linear", label: "Θ(n)" },
        { id: "log", label: "Θ(log n)" },
      ],
      correctChoiceId: "constant",
      explanation: "Если искомый элемент первый, достаточно одной проверки.",
    },
    experimentModels: ["linear", "quadratic"],
    interpretation: [
      "Худший случай линейного поиска — Θ(n): элемент последний или отсутствует.",
      "Средняя оценка требует модели распределения входных данных; её нельзя просто выдумать.",
    ],
    practice: {
      prompt: "Что обязательно указать для оценки среднего случая?",
      choices: [
        { id: "distribution", label: "Предположения о входных данных" },
        { id: "color", label: "Цвет интерфейса" },
        { id: "cpu", label: "Только модель процессора" },
      ],
      correctChoiceId: "distribution",
      explanation:
        "Среднее вычисляется относительно явно заданного распределения возможных входов.",
    },
  },
  {
    slug: "analyze-code",
    number: 6,
    title: "Анализ незнакомого кода",
    description:
      "Итоговый алгоритм рассуждения и смешанные задачи по короткому C++ коду.",
    duration: "18 мин",
    theory: [
      "Выделите базовые операции, определите число повторений и сложите последовательные части. Для вложенных частей учитывайте реальные границы.",
      "Сначала формулируйте функцию роста, затем упрощайте её до подходящей асимптотической оценки.",
    ],
    code: "for (int i = 1; i < n; i *= 2) {\n  for (int j = 0; j < n; ++j) {\n    inspect(i, j);\n  }\n}",
    codeCaption: "Внешний цикл удваивает i, внутренний проходит n элементов.",
    hypothesis: {
      prompt: "Сколько раз примерно выполняется внешний цикл?",
      choices: [
        { id: "log", label: "log₂ n" },
        { id: "n", label: "n" },
        { id: "square", label: "n²" },
      ],
      correctChoiceId: "log",
      explanation:
        "i удваивается, пока не достигнет n, поэтому итераций около log₂ n.",
    },
    experimentModels: ["linearithmic", "quadratic"],
    interpretation: [
      "Умножаем число внешних итераций log n на n внутренних: получаем Θ(n log n).",
      "Название переменной и синтаксис цикла не заменяют анализ границ.",
    ],
    practice: {
      prompt: "Какова тесная временная оценка фрагмента?",
      choices: [
        { id: "linear", label: "Θ(n)" },
        { id: "nlogn", label: "Θ(n log n)" },
        { id: "square", label: "Θ(n²)" },
      ],
      correctChoiceId: "nlogn",
      explanation:
        "Внешний цикл выполняется Θ(log n) раз, а внутренний — Θ(n) на каждой итерации.",
    },
  },
];

export const getLesson = (slug: string) =>
  lessons.find((lesson) => lesson.slug === slug);
