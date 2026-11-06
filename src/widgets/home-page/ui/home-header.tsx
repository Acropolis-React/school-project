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
      <h1 className="max-w-4xl text-[1.85rem] font-bold leading-[1.12] tracking-[-0.035em] sm:text-[2.75rem]">
        {isReturningLearner ? "С возвращением" : "Добро пожаловать в AlgoLab"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
        {isReturningLearner
          ? "Продолжайте изучать алгоритмы и проверяйте, как меняются модели их роста."
          : "Начните с первого урока: разберитесь, что означает Big O, и проверьте выводы в лаборатории."}
      </p>
    </header>
  );
}
