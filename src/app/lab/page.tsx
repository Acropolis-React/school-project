import type { Metadata } from "next";
import { LabView } from "@/views/lab";
export const metadata: Metadata = { title: "Лаборатория" };
export default function LabPage() {
  return <LabView />;
}
