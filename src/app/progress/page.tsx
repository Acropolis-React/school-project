import type { Metadata } from "next";
import { ProgressView } from "@/views/progress";
export const metadata: Metadata = { title: "Прогресс" };
export default function ProgressPage() {
  return <ProgressView />;
}
