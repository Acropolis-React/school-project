import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/entities/lesson";
import { LessonView } from "@/views/lesson";

export const instant = false;
export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}
type LessonPageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: getLesson(slug)?.title ?? "Урок" };
}
export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
