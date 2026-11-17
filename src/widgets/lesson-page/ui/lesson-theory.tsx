import type { Lesson, TheoryBlock } from "@/entities/lesson";
import { LessonDemonstration } from "./lesson-demonstration";

function TheorySection({ block }: { block: TheoryBlock }) {
  if (block.kind === "demonstration") return null;
  if (block.kind === "comparison" || block.kind === "classes") {
    return (
      <section className="border-t border-border pt-7">
        <h3 className="text-lg font-semibold text-text-primary">
          {block.title}
        </h3>
        {block.text ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
            {block.text}
          </p>
        ) : null}
        <dl className="mt-4 overflow-hidden rounded-lg border border-border">
          {block.items.map((item) => (
            <div
              key={item.label}
              className="grid gap-1 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
            >
              <dt
                className={`text-sm font-semibold text-text-primary ${block.kind === "classes" ? "font-mono" : ""}`}
              >
                {item.label}
              </dt>
              <dd className="text-sm leading-6 text-text-secondary">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (block.kind === "idea") {
    return (
      <section className="border-l-2 border-accent bg-surface-raised px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold text-text-primary">
          {block.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
          {block.text}
        </p>
      </section>
    );
  }

  return (
    <section
      className={
        block.kind === "note"
          ? "border-l-2 border-warning bg-warning/8 px-4 py-4 sm:px-5"
          : "border-t border-border pt-7"
      }
    >
      <h3 className="text-lg font-semibold text-text-primary">{block.title}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
        {block.text}
      </p>
    </section>
  );
}

export function LessonTheory({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-7">
      {lesson.theory.map((block) =>
        block.kind === "demonstration" ? (
          <LessonDemonstration
            key={block.title}
            slug={lesson.slug}
            title={block.title}
          />
        ) : (
          <TheorySection key={block.title} block={block} />
        ),
      )}
      <figure className="overflow-hidden rounded-lg border border-border bg-[#0a0f15]">
        <figcaption className="border-b border-border px-4 py-2 text-xs leading-5 text-text-muted">
          C++ · {lesson.codeCaption}
        </figcaption>
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-[#c9d7e3]">
          <code>{lesson.code}</code>
        </pre>
      </figure>
    </div>
  );
}
