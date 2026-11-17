"use client";

import {
  BarChart3,
  BookOpen,
  FlaskConical,
  Home,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Brand } from "@/shared/ui";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

const navigation: NavigationItem[] = [
  {
    href: "/home",
    label: "Главная",
    icon: Home,
    match: (pathname) => pathname === "/home",
  },
  {
    href: "/learn",
    label: "Курс",
    icon: BookOpen,
    match: (pathname) => pathname.startsWith("/learn"),
  },
  {
    href: "/lab",
    label: "Лаборатория",
    icon: FlaskConical,
    match: (pathname) => pathname.startsWith("/lab"),
  },
  {
    href: "/progress",
    label: "Прогресс",
    icon: BarChart3,
    match: (pathname) => pathname.startsWith("/progress"),
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") return <>{children}</>;

  return (
    <div className="app-background min-h-dvh text-text-primary lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <div className="px-2">
          <Brand href="/" />
        </div>
        <nav aria-label="Основная навигация" className="mt-8 space-y-1">
          {navigation.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "bg-surface-raised text-text-primary" : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"}`}
              >
                {active ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />
                ) : null}
                <Icon
                  aria-hidden="true"
                  className={active ? "text-accent" : ""}
                  size={18}
                  strokeWidth={1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto px-3 text-xs leading-5 text-text-muted">
          Прогресс хранится только в этом браузере.
        </p>
      </aside>

      <header className="sticky top-0 z-20 flex h-15 items-center justify-between border-b border-border bg-app px-4 lg:hidden">
        <Brand href="/" />
        <span className="text-xs font-medium text-text-secondary">
          Изучаем Big O
        </span>
      </header>

      <main className="min-w-0 pb-24 lg:col-start-2 lg:pb-0">
        <div className="mx-auto w-full max-w-[1220px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>

      <nav
        aria-label="Мобильная навигация"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-sidebar/98 px-1 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {navigation.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`my-1 flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent ${active ? "bg-accent/8 text-accent" : "text-text-secondary hover:bg-surface-raised"}`}
            >
              <Icon
                aria-hidden="true"
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
