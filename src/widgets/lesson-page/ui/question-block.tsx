"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import type { Lesson } from "@/entities/lesson";
import { evaluateAnswer } from "@/features/answer-exercise";
import { useLearningProgress } from "@/features/track-lesson-progress";
import { Button } from "@/shared/ui";

export type QuestionKind = "hypothesis" | "practice";

export type QuestionState = {
  choice: string;
  submitted: boolean;
};

type QuestionBlockProps = {
  lesson: Lesson;
  kind: QuestionKind;
  state: QuestionState;
  onStateChange: (state: QuestionState) => void;
  onCorrect?: () => void;
};

export function QuestionBlock({
  lesson,
  kind,
  state,
  onStateChange,
  onCorrect,
}: QuestionBlockProps) {
  const question = lesson[kind];
  const { recordAnswer } = useLearningProgress();
  const { choice, submitted } = state;
  const result = submitted ? evaluateAnswer(question, choice) : null;

  const submit = () => {
    if (!choice) return;
    const nextResult = evaluateAnswer(question, choice);
    onStateChange({ choice, submitted: true });
    recordAnswer(lesson.slug, nextResult.correct);
    if (nextResult.correct) onCorrect?.();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {kind === "hypothesis"
          ? "Сформулируйте гипотезу"
          : "Проверьте понимание"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
        {question.prompt}
      </p>
      <fieldset className="mt-6 space-y-2">
        <legend className="sr-only">Выберите один вариант</legend>
        {question.choices.map((item) => (
          <label
            key={item.id}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm transition-[background-color,border-color,box-shadow,color] ${choice === item.id ? "border-accent bg-accent/10 text-text-primary shadow-[0_2px_6px_rgba(0,0,0,0.16)]" : "border-border-strong bg-surface-raised text-text-secondary shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:border-text-muted hover:bg-surface-hover hover:text-text-primary"}`}
          >
            <input
              className="size-4 accent-[#4cc9a6]"
              type="radio"
              name={`${lesson.slug}-${kind}`}
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
      <Button
        type="button"
        disabled={!choice || result?.correct}
        onClick={submit}
        className="mt-5 w-full sm:w-auto"
      >
        {result?.correct ? "Ответ принят" : "Проверить ответ"}
      </Button>
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
