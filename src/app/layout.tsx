import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LearningProgressProvider } from "@/features/track-lesson-progress";
import "@/providers/styles/globals.css";
import { AppShell } from "@/widgets/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["cyrillic", "latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["cyrillic", "latin"],
});
export const metadata: Metadata = {
  title: { default: "AlgoLab — изучение Big O", template: "%s · AlgoLab" },
  description:
    "Интерактивный курс по алгоритмической сложности и нотации Big O.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LearningProgressProvider>
          <AppShell>{children}</AppShell>
        </LearningProgressProvider>
      </body>
    </html>
  );
}
