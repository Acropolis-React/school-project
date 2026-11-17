"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  bonusGuide,
  getCoreCourseProgress,
  referenceSections,
} from "@/entities/lesson";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { ButtonLink } from "@/shared/ui";

export function ReferencePage() {
  const { progress, hydrated } = useLearningProgress();
  const unlocked = getCoreCourseProgress(
    progress.completedLessonSlugs,
  ).unlocked;
  useEffect(() => {
    if (hydrated && unlocked && window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView(),
      );
    }
  }, [hydrated, unlocked]);
  if (!hydrated)
    return (
      <output className="text-sm text-text-secondary">
        Загрузка прогресса…
      </output>
    );
  if (!unlocked) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">Материал недоступен</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Вернитесь к курсу, чтобы продолжить обучение.
        </p>
        <ButtonLink href="/learn" variant="secondary" className="mt-5">
          К курсу
        </ButtonLink>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-4xl">
      <Link
        href="/learn"
        className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent"
      >
        ← Назад к курсу
      </Link>
      <header className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Бонус · справочник
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {bonusGuide.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
          {bonusGuide.description}
        </p>
      </header>
      <nav
        id="contents"
        aria-label="Содержание справочника"
        className="mt-8 scroll-mt-20 border-y border-border py-5"
      >
        <h2 className="text-lg font-semibold">Содержание</h2>
        <ol className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {referenceSections.map((section) => (
            <li key={section.id}>
              <a
                className="flex min-h-11 items-center py-2 text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {referenceSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-20 border-b border-border py-7"
        >
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <div className="mt-4 max-w-3xl space-y-3 text-sm leading-7 text-text-secondary sm:text-base">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a
            href="#contents"
            className="mt-4 inline-flex min-h-11 items-center text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ↑ К содержанию
          </a>
        </section>
      ))}
    </article>
  );
}
