import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
          {description}
        </p>
      </div>
      {aside}
    </header>
  );
}
