import type { Metadata } from "next";
import { LearnView } from "@/views/learn";
export const metadata: Metadata = { title: "Курс" };
export default function LearnPage() {
  return <LearnView />;
}
