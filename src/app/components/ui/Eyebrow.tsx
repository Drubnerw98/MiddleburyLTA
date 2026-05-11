import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "ink" | "oxblood" | "moss" | "muted";
  className?: string;
};

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
  ink: "text-ink-soft",
  oxblood: "text-oxblood",
  moss: "text-moss",
  muted: "text-muted",
};

/**
 * Pre-headline label rendered in small caps with wide tracking.
 * The editorial-civic system uses this above every section heading
 * to anchor the visual rhythm.
 */
export default function Eyebrow({ children, tone = "muted", className = "" }: Props) {
  return (
    <p
      className={`font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClass[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
