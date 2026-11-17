"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import type { LessonQuestion } from "@/entities/lesson";
import { evaluateAnswer } from "@/features/answer-exercise";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { Button } from "@/shared/ui";

export type QuestionState = {
  choice: string;
  submitted: boolean;
};

type QuestionBlockProps = {
  lessonSlug: string;
  question: LessonQuestion;
  heading: string;
  state: QuestionState;
  onStateChange: (state: QuestionState) => void;
  onCorrect?: () => void;
};

export function QuestionBlock({
  lessonSlug,
  question,
  heading,
  state,
  onStateChange,
  onCorrect,
}: QuestionBlockProps) {
  const { recordAnswer } = useLearningProgress();
  const { choice, submitted } = state;
  const result = submitted ? evaluateAnswer(question, choice) : null;

  const submit = () => {
    if (!choice) return;
    const nextResult = evaluateAnswer(question, choice);
    onStateChange({ choice, submitted: true });
    recordAnswer(lessonSlug, question.id, choice, nextResult.correct);
    if (nextResult.correct) onCorrect?.();
  };

  return (
    <div id={question.id} tabIndex={-1} className="scroll-mt-20">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
        {question.prompt}
      </p>
      {question.code ? (
        <figure className="mt-5 overflow-hidden rounded-lg border border-border bg-[#0a0f15]">
          <figcaption className="border-b border-border px-4 py-2 text-xs text-text-muted">
            C++
            {question.codeCaption ? ` · ${question.codeCaption}` : ""}
          </figcaption>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-[#c9d7e3]">
            <code>{question.code}</code>
          </pre>
        </figure>
      ) : null}
      <fieldset className="mt-6 space-y-2" disabled={Boolean(result?.correct)}>
        <legend className="sr-only">Выберите один вариант</legend>
        {question.choices.map((item) => (
          <label
            key={item.id}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${choice === item.id ? "border-accent bg-accent/10 text-text-primary" : "border-border-strong bg-surface-raised text-text-secondary hover:border-text-muted hover:bg-surface-hover hover:text-text-primary"}`}
          >
            <input
              className="size-4 shrink-0 accent-[#4cc9a6]"
              type="radio"
              name={`${lessonSlug}-${question.id}`}
              value={item.id}
              checked={choice === item.id}
              onChange={() =>
                onStateChange({ choice: item.id, submitted: false })
              }
            />
            {item.label}
          </label>
        ))}
      </fieldset>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          disabled={!choice || submitted}
          onClick={submit}
          className="w-full sm:w-auto"
        >
          {result
            ? result.correct
              ? "Ответ принят"
              : "Выберите другой ответ"
            : "Проверить ответ"}
        </Button>
        {result?.correct ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => onStateChange({ choice: "", submitted: false })}
          >
            Повторить задачу
          </Button>
        ) : null}
      </div>
      {result ? (
        <output
          className={`mt-4 flex gap-3 border-l-2 p-4 text-sm leading-6 ${result.correct ? "border-accent bg-accent/8 text-text-primary" : "border-error bg-error/8 text-text-primary"}`}
        >
          {result.correct ? (
            <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={18} />
          ) : (
            <CircleAlert className="mt-0.5 shrink-0 text-error" size={18} />
          )}
          <div>
            <strong>{result.correct ? "Верно." : "Пока неверно."}</strong>{" "}
            {result.explanation}
          </div>
        </output>
      ) : null}
    </div>
  );
}
