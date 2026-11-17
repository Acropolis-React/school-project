import Link from "next/link";
import { Brand } from "@/shared/ui";

const primary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-app hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
const secondary =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-surface-raised px-5 py-3 text-sm font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function LandingHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Brand href="/" />
        <Link href="/home" className={primary}>
          Перейти в приложение
        </Link>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="grid items-center gap-8 border-b border-border py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
      <div>
        <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Поймите, как растёт сложность алгоритмов
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
          AlgoLab соединяет короткие уроки о Big O, задачи и лабораторию.
          Изучайте код, сравнивайте модели и проверяйте свои выводы.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/learn/what-is-big-o" className={primary}>
            Начать первый урок
          </Link>
          <a href="#guide" className={secondary}>
            Как пользоваться
          </a>
        </div>
      </div>
      <div>
        <AppScreenshot
          name="lesson"
          alt="Первый урок AlgoLab: объяснение Big O и шаги урока"
          priority
        />
      </div>
    </section>
  );
}

type ScreenshotProps = {
  name: "lesson" | "lab";
  alt: string;
  priority?: boolean;
};
export function AppScreenshot({
  name,
  alt,
  priority = false,
}: ScreenshotProps) {
  return (
    <picture
      className={`block aspect-[390/844] overflow-hidden rounded-xl border border-border ${name === "lab" ? "lg:aspect-[4/3]" : "lg:aspect-[8/5]"}`}
    >
      <source
        media="(min-width: 1024px)"
        srcSet={`/landing/${name}-desktop.png`}
      />
      <img
        src={`/landing/${name}-mobile.png`}
        alt={alt}
        width="390"
        height="844"
        loading={priority ? "eager" : "lazy"}
        className="block h-auto w-full"
      />
    </picture>
  );
}

export function Closing() {
  return (
    <>
      <section className="border-t border-border py-10 sm:py-14">
        <h2 className="text-2xl font-semibold tracking-tight">
          Начните с одного вопроса
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
          Что произойдёт с количеством работы, если увеличить входные данные?
          Первый урок поможет сформулировать ответ, а лаборатория — исследовать
          его.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className={primary} href="/learn/what-is-big-o">
            Открыть первый урок
          </Link>
          <Link className={secondary} href="/lab">
            Перейти в лабораторию
          </Link>
        </div>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 text-sm text-text-muted">
        <span>AlgoLab · изучение сложности алгоритмов</span>
        <Link
          href="/home"
          className="text-text-secondary underline underline-offset-4"
        >
          Главная приложения
        </Link>
      </footer>
    </>
  );
}
