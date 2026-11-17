import { ArrowRight, Target } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

export function ProgressEmptyState() {
  return (
    <section className="rounded-xl border border-border-strong bg-surface px-5 py-9 text-center sm:px-8">
      <span
        aria-hidden="true"
        className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent"
      >
        <Target size={25} />
      </span>
      <h2 className="mx-auto mt-5 max-w-xl text-xl font-semibold">
        Здесь появятся ваши результаты
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary">
        Начните первый урок, отвечайте на вопросы и завершайте этапы — только
        после этого мы покажем реальные данные вашего обучения.
      </p>
      <ButtonLink href="/learn/what-is-big-o" className="mt-5">
        Начать первый урок <ArrowRight size={16} />
      </ButtonLink>
    </section>
  );
}
