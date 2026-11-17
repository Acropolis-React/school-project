import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

export function LabCard() {
  return (
    <section
      className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
      aria-labelledby="lab-heading"
    >
      <h2 id="lab-heading" className="text-lg font-semibold">
        Лаборатория
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Сравните теоретические модели O(log n), O(n), O(n log n) и O(n²) на
        одном графике.
      </p>
      <ButtonLink
        href="/lab"
        variant="secondary"
        className="mt-5 w-full sm:w-auto"
      >
        Открыть лабораторию <ArrowRight size={15} />
      </ButtonLink>
    </section>
  );
}
