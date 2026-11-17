"use client";

import { useState } from "react";
import { getLessonDemonstration, type LessonSlug } from "@/entities/lesson";

export function LessonDemonstration({
  slug,
  title,
}: {
  slug: LessonSlug;
  title: string;
}) {
  const [exponent, setExponent] = useState(3);
  const n = 2 ** exponent;
  const demo = getLessonDemonstration(slug, n);
  const maxValue = Math.max(...demo.rows.map((row) => row.value));

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-text-muted">
        Учебная модель по формулам · не запуск алгоритма и не время
      </p>
      <label
        className="mt-5 flex items-center justify-between gap-3 text-sm font-medium"
        htmlFor={`size-${slug}`}
      >
        Размер входа n{" "}
        <output htmlFor={`size-${slug}`} className="font-mono text-accent">
          {n}
        </output>
      </label>
      <input
        id={`size-${slug}`}
        type="range"
        min={2}
        max={6}
        step={1}
        value={exponent}
        aria-valuetext={`${n} элементов`}
        onChange={(event) => setExponent(Number(event.target.value))}
        className="mt-2 min-h-11 w-full accent-[#4cc9a6]"
      />
      <p className="text-xs text-text-muted">
        Каждое деление ползунка удваивает n: 4, 8, 16, 32, 64.
      </p>
      <ol
        aria-label="Схема рассуждения"
        className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-3 font-mono text-xs leading-6 text-text-secondary"
      >
        {demo.steps.map((step, index) => (
          <li key={step}>
            {index > 0 ? "→ " : ""}
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-4 space-y-3" aria-hidden="true">
        {demo.rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-3 text-xs text-text-secondary">
              <span>{row.label}</span>
              <span className="font-mono">
                {row.value.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="h-2 bg-track">
              <div
                className="h-2 bg-accent"
                style={{ width: `${(row.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-muted">
        Длина полос показывает отношение значений при выбранном n; масштаб
        обновляется при изменении n.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="pb-2 text-left text-xs leading-5 text-text-muted">
            {demo.meaning}. n = {n}.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-medium">
                Что считаем
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Значение
              </th>
            </tr>
          </thead>
          <tbody>
            {demo.rows.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <th
                  scope="row"
                  className="py-2 pr-4 font-normal text-text-secondary"
                >
                  {row.label}
                </th>
                <td className="py-2 text-right font-mono">
                  {row.value.toLocaleString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="mt-4 text-sm leading-6 text-text-secondary"
        aria-live="polite"
      >
        {demo.explanation}
      </p>
    </section>
  );
}
