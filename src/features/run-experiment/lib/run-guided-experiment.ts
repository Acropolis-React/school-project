import type { LessonSlug } from "@/entities/lesson";
import { getGuidedAssignment } from "../model/guided-assignments";
import { runExperiment } from "./run-experiment";

export function runGuidedExperiment(slug: LessonSlug) {
  const { config } = getGuidedAssignment(slug);
  const first = runExperiment(config);
  return slug === "input-cases"
    ? [first, runExperiment({ ...config, targetPosition: "missing" })]
    : [first];
}
