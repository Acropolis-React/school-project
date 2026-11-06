import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const styles = {
  primary:
    "border-accent bg-accent text-[#071510] shadow-[0_2px_6px_rgba(0,0,0,0.22)] hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_3px_8px_rgba(0,0,0,0.24)] active:border-accent active:bg-accent active:shadow-[0_1px_3px_rgba(0,0,0,0.24)]",
  secondary:
    "border-border-strong bg-surface-raised text-text-primary shadow-[0_5px_16px_rgba(0,0,0,0.18)] hover:border-text-muted hover:bg-surface-hover active:border-border-strong active:bg-surface",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-surface-raised hover:text-text-primary active:bg-surface",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
}: CommonProps & { href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
