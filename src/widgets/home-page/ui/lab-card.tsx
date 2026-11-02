import { ArrowRight, FlaskConical } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

export function LabCard() {
  return (
    <section
      className="border border-border bg-surface p-5"
      aria-labelledby="lab-heading"
    >
      <FlaskConical aria-hidden="true" className="text-accent" size={24} />
      <h2 id="lab-heading" className="mt-4 text-lg font-semibold">
        Лаборатория
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Сравните теоретические модели O(log n), O(n), O(n log n) и O(n²) на
        одном графике.
      </p>
      <ButtonLink href="/lab" variant="secondary" className="mt-5 w-full">
        Открыть лабораторию <ArrowRight size={15} />
      </ButtonLink>
    </section>
  );
}
