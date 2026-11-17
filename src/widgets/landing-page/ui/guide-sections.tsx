import Link from "next/link";
import { AppScreenshot } from "./landing-parts";

const link =
  "inline-block py-2 font-medium text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Guide() {
  return (
    <section id="guide" className="border-b border-border py-10 sm:py-14">
      <div className="md:grid md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Как заниматься в AlgoLab
          </h2>
          <p className="mt-3 max-w-md leading-7 text-text-secondary">
            Пройдите путь от объяснения к собственному выводу. Уроки и
            лабораторию можно открывать независимо.
          </p>
        </div>
        <ol className="mt-6 divide-y divide-border border-y border-border md:mt-0">
          <li className="grid grid-cols-[2rem_1fr] gap-3 py-5">
            <span className="font-mono text-sm text-accent">01</span>
            <div>
              <h3 className="font-semibold">Прочитайте теорию</h3>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                В уроке «Введение в Big O» узнайте, что обозначает размер входа
                n и как сравнивают рост работы.
              </p>
              <Link href="/learn/what-is-big-o" className={link}>
                Открыть урок →
              </Link>
            </div>
          </li>
          <li className="grid grid-cols-[2rem_1fr] gap-3 py-5">
            <span className="font-mono text-sm text-accent">02</span>
            <div>
              <h3 className="font-semibold">Постройте модель</h3>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                В лаборатории выберите «Теоретическая модель», классы Big O и
                диапазон n. Нажмите «Построить модель», затем сравните график и
                таблицу.
              </p>
              <Link href="/lab" className={link}>
                Открыть лабораторию →
              </Link>
            </div>
          </li>
          <li className="grid grid-cols-[2rem_1fr] gap-3 py-5">
            <span className="font-mono text-sm text-accent">03</span>
            <div>
              <h3 className="font-semibold">Проверьте рассуждение</h3>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Вернитесь к шагам урока: ответьте на вопросы и прочитайте
                объяснение после проверки. Результаты сохраняются в этом
                браузере.
              </p>
              <Link href="/learn" className={link}>
                Выбрать урок →
              </Link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function Complexity() {
  return (
    <section className="grid gap-7 border-b border-border py-10 md:grid-cols-2 md:gap-12 sm:py-14">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Зачем нужна сложность?
        </h2>
        <p className="mt-3 leading-7 text-text-secondary">
          Размер входа n может вырасти в тысячи раз. Big O описывает
          асимптотическую верхнюю границу роста работы, помогая сравнивать
          подходы при больших n. Это не точное время выполнения.
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Если размер входа увеличился в 10 раз</h3>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Сравним учебные функции n и n², положив их значения равными n и n².
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <caption className="sr-only">
            Значения функций роста при n равном 10 и 100
          </caption>
          <thead className="border-b border-border text-text-secondary">
            <tr>
              <th className="py-3 font-medium">Размер n</th>
              <th className="py-3 font-medium">n</th>
              <th className="py-3 font-medium">n²</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr className="border-b border-border">
              <td className="py-3">10</td>
              <td>10</td>
              <td>100</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3">100</td>
              <td>100</td>
              <td>10 000</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Линейная функция выросла в 10 раз, квадратичная — в 100. Это значения
          модели, а не измерения алгоритма.
        </p>
      </div>
    </section>
  );
}

export function Walkthrough() {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          От урока к исследованию
        </h2>
        <p className="mt-3 leading-7 text-text-secondary">
          В курсе теория, прогноз и практика собраны в последовательные шаги.
          После ответа вы получите объяснение и сможете попробовать снова.
        </p>
        <Link href="/learn" className={`${link} mt-2`}>
          Посмотреть все уроки →
        </Link>
      </div>
      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div>
          <AppScreenshot
            name="lab"
            alt="График теоретической модели в лаборатории AlgoLab"
          />
          <p className="mt-3 text-xs leading-5 text-text-muted">
            Лаборатория показывает график и таблицу для выбранных настроек.
          </p>
        </div>
        <div className="md:pt-4">
          <h3 className="text-xl font-semibold">Исследуйте в лаборатории</h3>
          <p className="mt-3 leading-7 text-text-secondary">
            Начните с теоретической модели: измените диапазон n и постройте
            график заново. В режиме «Подсчёт операций» можно запустить
            встроенные алгоритмы и сравнить выбранные операции. Это не измерение
            времени.
          </p>
          <Link href="/lab" className={`${link} mt-2`}>
            Попробовать лабораторию →
          </Link>
          <div className="mt-7 border-t border-border pt-6">
            <h3 className="text-lg font-semibold">Закрепите знания</h3>
            <p className="mt-2 leading-7 text-text-secondary">
              Задания внутри уроков помогают проверить прогноз и прочитать код.
              На странице прогресса можно вернуться к ошибкам и сохранённым
              исследованиям.
            </p>
            <Link href="/progress" className={`${link} mt-2`}>
              Открыть прогресс →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
