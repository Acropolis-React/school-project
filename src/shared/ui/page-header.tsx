import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.025em] sm:text-[2.125rem]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      {aside}
    </header>
  );
}
