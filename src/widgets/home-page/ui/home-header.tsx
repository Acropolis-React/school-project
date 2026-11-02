type HomeHeaderProps = {
  hydrated: boolean;
  hasCompletedFirstLesson: boolean;
};

export function HomeHeader({
  hydrated,
  hasCompletedFirstLesson,
}: HomeHeaderProps) {
  const isReturningLearner = hydrated && hasCompletedFirstLesson;

  return (
    <header aria-busy={!hydrated}>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {isReturningLearner ? "С возвращением" : "Добро пожаловать в AlgoLab"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
        {isReturningLearner
          ? "Продолжайте изучать алгоритмы и проверяйте, как меняются модели их роста."
          : "Начните с первого урока: разберитесь, что означает Big O, и проверьте выводы в лаборатории."}
      </p>
    </header>
  );
}
