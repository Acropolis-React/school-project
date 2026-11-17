import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bonusGuide, getLesson, lessons } from "@/entities/lesson";
import { LessonView } from "@/views/lesson";
import { ReferenceView } from "@/views/reference";

export const instant = false;
export function generateStaticParams() {
  return [...lessons, bonusGuide].map((lesson) => ({ slug: lesson.slug }));
}
type LessonPageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      (slug === bonusGuide.slug ? bonusGuide.title : getLesson(slug)?.title) ??
      "Урок",
  };
}
export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  if (slug === bonusGuide.slug) return <ReferenceView />;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
