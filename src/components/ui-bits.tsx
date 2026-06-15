import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";

export function PopButton({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : variant === "dark"
      ? "bg-[var(--potli-green-dark)] text-white"
      : "bg-card text-foreground border-2 border-border";
  return (
    <button
      className={`btn-pop rounded-2xl px-5 py-3.5 text-base ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PopLink({
  to,
  children,
  variant = "primary",
  className = "",
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : variant === "dark"
      ? "bg-[var(--potli-green-dark)] text-white"
      : "bg-card text-foreground border-2 border-border";
  return (
    <Link
      to={to}
      className={`btn-pop rounded-2xl px-5 py-3.5 text-base text-center ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "yellow" | "green" | "streak";
}) {
  const tones = {
    default: "bg-muted text-foreground",
    yellow: "bg-primary text-primary-foreground",
    green: "bg-[var(--potli-green-soft)] text-[var(--potli-green-dark)]",
    streak: "bg-[oklch(0.95_0.08_40)] text-[var(--streak)]",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = "yellow" }: { value: number; tone?: "yellow" | "green" }) {
  const color = tone === "yellow" ? "bg-primary" : "bg-secondary";
  return (
    <div className="h-3 w-full rounded-full bg-muted overflow-hidden border border-border">
      <div
        className={`h-full ${color} rounded-full transition-all`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
