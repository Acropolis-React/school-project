import { ButtonLink, PageHeader } from "@/shared/ui";

export function NotFoundPage() {
  return (
    <section className="space-y-5">
      <PageHeader
        title="Страница не найдена"
        description="В курсе можно выбрать нужный урок и продолжить обучение."
      />
      <ButtonLink href="/learn">К курсу</ButtonLink>
    </section>
  );
}
