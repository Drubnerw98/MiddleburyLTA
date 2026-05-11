import { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  children: ReactNode;
  tone?: "note" | "warning";
  className?: string;
};

const toneStyles: Record<NonNullable<Props["tone"]>, { surface: string; title: string; body: string }> = {
  note: {
    surface: "bg-paper-deep border-rule-strong",
    title: "text-ink",
    body: "text-ink-soft",
  },
  warning: {
    surface: "bg-oxblood/[0.05] border-oxblood/40",
    title: "text-oxblood",
    body: "text-ink-soft",
  },
};

/**
 * Editorial aside box. Used for caveats, methodology notes, "what this
 * does not include" disclaimers. Distinct from cards: rectangular, no
 * rounded corners, restrained.
 */
export default function Callout({
  title,
  children,
  tone = "note",
  className = "",
}: Props) {
  const t = toneStyles[tone];
  return (
    <aside
      className={`border-l-2 ${t.surface} px-5 sm:px-6 py-4 sm:py-5 ${className}`}
    >
      {title && (
        <p className={`font-sans text-sm font-semibold ${t.title} mb-1.5`}>
          {title}
        </p>
      )}
      <div className={`font-sans text-sm leading-[1.6] ${t.body}`}>
        {children}
      </div>
    </aside>
  );
}
