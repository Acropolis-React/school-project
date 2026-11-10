import type { Lesson } from "@/entities/lesson";
import { MiniExperiment } from "./mini-experiment";
import { MiniExperimentChart } from "./mini-experiment-chart";
import { QuestionBlock, type QuestionState } from "./question-block";

type LessonStepContentProps = {
  lesson: Lesson;
  step: number;
  questionStates: Record<string, QuestionState>;
  onQuestionStateChange: (questionId: string, state: QuestionState) => void;
  onQuestionPassed: (questionId: string) => void;
};

const emptyQuestionState: QuestionState = { choice: "", submitted: false };

function TheoryStep({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Ключевая идея</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-text-secondary">
        {lesson.theory.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <figure className="mt-7 overflow-hidden rounded-lg border border-border bg-[#0a0f15]">
        <figcaption className="border-b border-border px-4 py-2 text-xs text-text-muted">
          C++ · {lesson.codeCaption}
        </figcaption>
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-[#c9d7e3]">
          <code>{lesson.code}</code>
        </pre>
      </figure>
    </div>
  );
}

function InterpretationStep({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Что показывает модель</h2>
      <MiniExperimentChart lesson={lesson} />
      <div className="mt-6 space-y-4">
        {lesson.interpretation.map((item, index) => (
          <div key={item} className="grid grid-cols-[30px_1fr] gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-accent/40 bg-accent/8 text-xs font-semibold text-accent">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-text-secondary sm:text-base">
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-7 border-l-2 border-warning bg-warning/8 p-4 text-sm leading-6 text-text-secondary">
        <strong className="text-text-primary">Важно:</strong> показанный график
        иллюстрирует математические функции роста, а не измеряет работу
        конкретных программ.
      </div>
    </div>
  );
}

type PracticeStepProps = Omit<LessonStepContentProps, "step">;

function PracticeStep({
  lesson,
  questionStates,
  onQuestionStateChange,
  onQuestionPassed,
}: PracticeStepProps) {
  return (
    <div>
      {lesson.practice.length > 1 ? (
        <div className="mb-8 border-l-2 border-accent bg-accent/8 p-4">
          <h2 className="font-semibold">Разбор незнакомого кода</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Классифицируйте каждый фрагмент. Урок завершится, когда все задачи
            будут решены верно; после ошибки можно попробовать снова.
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
              onCorrect={() => onQuestionPassed(question.id)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}

export function LessonStepContent({
  lesson,
  step,
  questionStates,
  onQuestionStateChange,
  onQuestionPassed,
}: LessonStepContentProps) {
  return (
    <article className="min-h-[430px] py-8 sm:py-10">
      {step === 0 ? <TheoryStep lesson={lesson} /> : null}
      {step === 1 ? (
        <QuestionBlock
          lessonSlug={lesson.slug}
          question={lesson.hypothesis}
          heading="Сформулируйте гипотезу"
          state={questionStates[lesson.hypothesis.id] ?? emptyQuestionState}
          onStateChange={(state) =>
            onQuestionStateChange(lesson.hypothesis.id, state)
          }
          onCorrect={() => onQuestionPassed(lesson.hypothesis.id)}
        />
      ) : null}
      {step === 2 ? <MiniExperiment lesson={lesson} /> : null}
      {step === 3 ? <InterpretationStep lesson={lesson} /> : null}
      {step === 4 ? (
        <PracticeStep
          lesson={lesson}
          questionStates={questionStates}
          onQuestionStateChange={onQuestionStateChange}
          onQuestionPassed={onQuestionPassed}
        />
      ) : null}
    </article>
  );
}
