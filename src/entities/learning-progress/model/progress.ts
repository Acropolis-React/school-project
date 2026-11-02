export type AnswerRecord = {
  lessonSlug: string;
  correct: boolean;
  answeredAt: string;
};

export type LearningProgress = {
  version: 1;
  lastLessonSlug: string;
  lessonSteps: Record<string, number>;
  completedLessonSlugs: string[];
  answers: AnswerRecord[];
};

export const emptyProgress: LearningProgress = {
  version: 1,
  lastLessonSlug: "what-is-big-o",
  lessonSteps: {},
  completedLessonSlugs: [],
  answers: [],
};

const STORAGE_KEY = "algolab-progress-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseProgress(value: string | null): LearningProgress {
  if (!value) return emptyProgress;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || parsed.version !== 1) return emptyProgress;

    const lessonSteps = isRecord(parsed.lessonSteps)
      ? Object.fromEntries(
          Object.entries(parsed.lessonSteps).filter(
            (entry): entry is [string, number] =>
              typeof entry[1] === "number" &&
              Number.isInteger(entry[1]) &&
              entry[1] >= 0 &&
              entry[1] <= 4,
          ),
        )
      : {};

    const completedLessonSlugs = Array.isArray(parsed.completedLessonSlugs)
      ? parsed.completedLessonSlugs
          .filter((item): item is string => typeof item === "string")
          .slice(0, 6)
      : [];

    const answers = Array.isArray(parsed.answers)
      ? parsed.answers
          .filter(
            (item): item is AnswerRecord =>
              isRecord(item) &&
              typeof item.lessonSlug === "string" &&
              typeof item.correct === "boolean" &&
              typeof item.answeredAt === "string",
          )
          .slice(-100)
      : [];

    return {
      version: 1,
      lastLessonSlug:
        typeof parsed.lastLessonSlug === "string"
          ? parsed.lastLessonSlug
          : emptyProgress.lastLessonSlug,
      lessonSteps,
      completedLessonSlugs,
      answers,
    };
  } catch {
    return emptyProgress;
  }
}

export function readProgress(): LearningProgress {
  return parseProgress(window.localStorage.getItem(STORAGE_KEY));
}

export function writeProgress(progress: LearningProgress): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearProgress(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
