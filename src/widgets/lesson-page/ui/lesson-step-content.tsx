import { useState } from "react";
import { codeTraceExercise, type Lesson } from "@/entities/lesson";
import { CodeTraceStep } from "./code-trace-step";
import {
  type GuidedAttempt,
  GuidedExperiment,
  initialGuidedAttempt,
} from "./guided-experiment";
import { InterpretationResults } from "./interpretation-results";
import { LessonTheory } from "./lesson-theory";
import { MiniExperimentChart } from "./mini-experiment-chart";
import { QuestionBlock, type QuestionState } from "./question-block";

type LessonStepContentProps = {
  lesson: Lesson;
  step: number;
  practicePassed: boolean;
  questionStates: Record<string, QuestionState>;
  onQuestionStateChange: (questionId: string, state: QuestionState) => void;
};

const emptyQuestionState: QuestionState = { choice: "", submitted: false };

function InterpretationStep({ lesson }: { lesson: Lesson }) {
  const isCodeAnalysis = lesson.slug === "analyze-code";
  return (
    <div>
      <h2 className="text-xl font-semibold">
        {isCodeAnalysis
          ? "Как разобрать циклы"
          : lesson.showModelChart === false
            ? "Как понять результат"
            : "Что показывает модель"}
      </h2>
      {isCodeAnalysis ? null : lesson.showModelChart !== false ? (
        <MiniExperimentChart lesson={lesson} />
      ) : (
        <InterpretationResults slug={lesson.slug} />
      )}
      <div className="mt-6 space-y-4">
        {lesson.interpretation.map((item, index) => (
          <div key={item} className="grid grid-cols-[30px_minmax(0,1fr)] gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-accent/40 bg-accent/8 text-xs font-semibold text-accent">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-text-secondary sm:text-base">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

type PracticeStepProps = Omit<LessonStepContentProps, "step">;

function PracticeStep({
  lesson,
  questionStates,
  onQuestionStateChange,
  practicePassed,
}: PracticeStepProps) {
  return (
    <div>
      {lesson.practice.length > 1 ? (
        <div className="mb-8 border-l-2 border-accent bg-accent/8 p-4">
          <h2 className="font-semibold">
            {lesson.slug === "analyze-code"
              ? "Разбор незнакомого кода"
              : "Проверьте понимание"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Решите все задачи, чтобы завершить урок. После ошибки можно
            попробовать снова.
          </p>
        </div>
      ) : null}
      <div className="divide-y divide-border">
        {lesson.practice.map((question, index) => (
          <section key={question.id} className="py-8 first:pt-0 last:pb-0">
            <QuestionBlock
              lessonSlug={lesson.slug}
              question={question}
              heading={
                lesson.practice.length > 1
                  ? `Задача ${index + 1} из ${lesson.practice.length}`
                  : "Проверьте понимание"
              }
              state={questionStates[question.id] ?? emptyQuestionState}
              onStateChange={(state) =>
                onQuestionStateChange(question.id, state)
              }
            />
          </section>
        ))}
      </div>
      {practicePassed ? (
        <section
          className="mt-8 border-t border-border pt-5"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold">Главное из урока</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            {lesson.takeaway}
          </p>
        </section>
      ) : null}
    </div>
  );
}

export function LessonStepContent({
  lesson,
  step,
  questionStates,
  onQuestionStateChange,
  practicePassed,
}: LessonStepContentProps) {
  const [guidedAttempt, setGuidedAttempt] =
    useState<GuidedAttempt>(initialGuidedAttempt);
  return (
    <article className="py-8 sm:py-10">
      {step === 0 ? <LessonTheory lesson={lesson} /> : null}
      {step === 1 ? (
        <QuestionBlock
          lessonSlug={lesson.slug}
          question={lesson.hypothesis}
          heading="Проверьте понимание"
          state={questionStates[lesson.hypothesis.id] ?? emptyQuestionState}
          onStateChange={(state) =>
            onQuestionStateChange(lesson.hypothesis.id, state)
          }
        />
      ) : null}
      {step === 2 ? (
        lesson.slug === "analyze-code" ? (
          <CodeTraceStep
            state={questionStates[codeTraceExercise.id] ?? emptyQuestionState}
            onStateChange={(state) =>
              onQuestionStateChange(codeTraceExercise.id, state)
            }
          />
        ) : (
          <GuidedExperiment
            slug={lesson.slug}
            attempt={guidedAttempt}
            onAttemptChange={setGuidedAttempt}
          />
        )
      ) : null}
      {step === 3 ? <InterpretationStep lesson={lesson} /> : null}
      {step === 4 ? (
        <PracticeStep
          lesson={lesson}
          questionStates={questionStates}
          onQuestionStateChange={onQuestionStateChange}
          practicePassed={practicePassed}
        />
      ) : null}
    </article>
  );
}
