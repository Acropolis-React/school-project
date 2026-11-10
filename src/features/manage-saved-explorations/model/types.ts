import type { AlgorithmFamily } from "@/entities/algorithm";

export type SavedExplorationConfig = {
  mode: "algorithms" | "complexities";
  family: AlgorithmFamily;
  selectedIds: string[];
  minSize: number;
  maxSize: number;
  samples: number;
};

export type SavedExploration = {
  id: string;
  createdAt: string;
  config: SavedExplorationConfig;
};
