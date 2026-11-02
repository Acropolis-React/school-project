import { ArrowRight, Target } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

export function ProgressEmptyState() {
  return (
    <section className="border border-border bg-surface px-5 py-9 text-center sm:px-8">
      <Target className="mx-auto text-accent" size={30} />
      <h2 className="mt-4 text-xl font-semibold">
        Здесь появятся ваши результаты
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
        Начните первый урок, отвечайте на вопросы и завершайте этапы — только
        после этого мы покажем реальные данные вашего обучения.
      </p>
      <ButtonLink href="/learn/what-is-big-o" className="mt-5">
        Начать первый урок <ArrowRight size={16} />
      </ButtonLink>
    </section>
  );
}
