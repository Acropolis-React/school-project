import { Braces } from "lucide-react";
import Link from "next/link";

export function Brand({ href }: { href: "/" | "/home" }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-2 rounded-md text-base font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-md border border-accent/20 bg-accent/10 text-accent"
      >
        <Braces size={18} strokeWidth={2.2} />
      </span>
      AlgoLab
    </Link>
  );
}
