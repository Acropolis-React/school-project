import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import type { AnswerRecord } from "@/entities/learning-progress";
import { getLesson, getLessonQuestion } from "@/entities/lesson";
import { ButtonLink } from "@/shared/ui";

export function MistakeReview({ mistakes }: { mistakes: AnswerRecord[] }) {
  const reviewItems = mistakes.flatMap((answer) => {
    if (!answer.questionId) return [];
    const lesson = getLesson(answer.lessonSlug);
    const question = getLessonQuestion(answer.lessonSlug, answer.questionId);
    if (!lesson || !question) return [];
    return [
      {
        answer,
        lesson,
        question,
        selectedLabel:
          question.choices.find((choice) => choice.id === answer.choiceId)
            ?.label ?? "Ответ больше недоступен",
      },
    ];
  });

  return (
    <section aria-labelledby="mistakes-heading">
      <div className="flex items-start gap-3">
        {reviewItems.length > 0 ? (
          <CircleAlert className="mt-0.5 shrink-0 text-error" size={20} />
        ) : (
          <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={20} />
        )}
        <div>
          <h2 id="mistakes-heading" className="text-lg font-semibold">
            Разбор ошибок
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Здесь остаётся последняя нерешённая ошибка по каждому вопросу. Она
            исчезнет после верного повторного ответа.
          </p>
        </div>
      </div>
      {reviewItems.length === 0 ? (
        <p className="mt-4 border border-border bg-surface p-4 text-sm leading-6 text-text-secondary">
          Нерешённых ошибок нет. Ошибочные попытки по-прежнему учитываются в
          общей точности, но не требуют повторения.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {reviewItems
            .slice(0, 8)
            .map(({ answer, lesson, question, selectedLabel }) => (
              <li
                key={`${answer.lessonSlug}-${answer.questionId}`}
                className="py-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-accent">
                      {lesson.title}
                    </p>
                    <h3 className="mt-2 font-medium">{question.prompt}</h3>
                    <p className="mt-2 text-sm text-error">
                      Ваш ответ: {selectedLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {question.explanation}
                    </p>
                  </div>
                  <ButtonLink
                    href={`/learn/${lesson.slug}`}
                    variant="secondary"
                    className="w-full shrink-0 sm:w-auto"
                  >
                    Повторить урок <ArrowRight size={15} />
                  </ButtonLink>
                </div>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
