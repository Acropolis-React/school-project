import type {
  ExperimentAlgorithmFamily,
  ExperimentSource,
} from "@/entities/experiment";
import { getMaximumInputSize } from "@/features/run-experiment";
import { defaultIds, type LabConfig } from "./lab-config";

function limitInputSize(config: LabConfig): LabConfig {
  return {
    ...config,
    maxSize: Math.min(config.maxSize, getMaximumInputSize(config)),
  };
}

export function changeSource(
  current: LabConfig,
  source: ExperimentSource,
): LabConfig {
  const subject = source === "instrumented" ? "algorithms" : current.subject;
  const selectedIds =
    subject === current.subject
      ? current.selectedIds
      : defaultIds(subject, current.family);
  return limitInputSize({
    ...current,
    source,
    subject,
    selectedIds,
    distribution:
      source === "instrumented" && selectedIds.includes("binary-search")
        ? "sorted"
        : current.distribution,
  });
}

export function changeFamily(
  current: LabConfig,
  family: ExperimentAlgorithmFamily,
): LabConfig {
  return limitInputSize({
    ...current,
    family,
    selectedIds: defaultIds("algorithms", family),
    distribution: family === "search" ? "sorted" : current.distribution,
  });
}

export function toggleSelectedSeries(
  current: LabConfig,
  id: string,
): LabConfig {
  const selectedIds = current.selectedIds.includes(id)
    ? current.selectedIds.filter((seriesId) => seriesId !== id)
    : [...current.selectedIds, id];
  return limitInputSize({
    ...current,
    selectedIds,
    distribution: selectedIds.includes("binary-search")
      ? "sorted"
      : current.distribution,
  });
}
