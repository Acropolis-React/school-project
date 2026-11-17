import type { ResearchFields } from "./lab-config";

export function validateResearch(research: ResearchFields): string | undefined {
  const title = research.title.trim();
  if (!title) {
    return "Введите название исследования перед сохранением.";
  }
  if (title.length > 80) {
    return "Название исследования должно быть не длиннее 80 символов.";
  }
  if (
    research.hypothesis.length > 2_000 ||
    research.conclusion.length > 2_000
  ) {
    return "Гипотеза и вывод должны быть не длиннее 2000 символов каждый.";
  }
}
