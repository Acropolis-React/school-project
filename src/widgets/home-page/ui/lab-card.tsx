import { ArrowRight, FlaskConical } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

export function LabCard() {
  return (
    <section
      className="relative overflow-hidden rounded-xl border border-accent/35 bg-surface p-5 shadow-[0_4px_12px_rgba(0,0,0,0.16)] sm:p-6"
      aria-labelledby="lab-heading"
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-lg border border-accent/35 bg-accent/10 text-accent"
      >
        <FlaskConical size={20} />
      </span>
      <h2 id="lab-heading" className="mt-5 text-xl font-semibold">
        Лаборатория
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Сравните теоретические модели O(log n), O(n), O(n log n) и O(n²) на
        одном графике.
      </p>
      <ButtonLink
        href="/lab"
        variant="secondary"
        className="mt-6 w-full border-accent/70 hover:border-accent hover:bg-accent/10"
      >
        Открыть лабораторию <ArrowRight size={15} />
      </ButtonLink>
    </section>
  );
}
