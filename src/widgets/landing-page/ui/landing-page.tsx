import { Complexity, Guide, Walkthrough } from "./guide-sections";
import { Closing, Hero, LandingHeader } from "./landing-parts";

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-app text-text-primary">
      <LandingHeader />
      <main className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <Hero />
        <Guide />
        <Complexity />
        <Walkthrough />
        <Closing />
      </main>
    </div>
  );
}
