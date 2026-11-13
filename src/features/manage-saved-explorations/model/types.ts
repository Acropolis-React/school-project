import type { LabExperimentConfig } from "@/entities/experiment";

export type SavedExplorationConfig = LabExperimentConfig;

export type SavedResearchInput = {
  title: string;
  hypothesis?: string;
  conclusion?: string;
  config: SavedExplorationConfig;
};

export type SavedExploration = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  hypothesis?: string;
  conclusion?: string;
  config: SavedExplorationConfig;
};
