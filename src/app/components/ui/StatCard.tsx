import { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  /** Visual emphasis. "up" = oxblood (tax went up), "down" = moss, "neutral" = ink. */
  tone?: "up" | "down" | "neutral";
  className?: string;
};

const toneStyles: Record<NonNullable<Props["tone"]>, { surface: string; value: string; caption: string; label: string }> = {
  up: {
    surface: "bg-oxblood/[0.06] border-oxblood/30",
    value: "text-oxblood",
    caption: "text-oxblood/80",
    label: "text-oxblood/90",
  },
  down: {
    surface: "bg-moss/[0.06] border-moss/30",
    value: "text-moss",
    caption: "text-moss/80",
    label: "text-moss/90",
  },
  neutral: {
    surface: "bg-bone border-rule",
    value: "text-ink",
    caption: "text-muted",
    label: "text-muted",
  },
};

/**
 * Single statistic in a bordered card. The visual workhorse of the
 * calculator and About-the-Numbers sections.
 *
 * `tone` keys the entire card to the directional meaning:
 *   - up      = oxblood (tax bill went up, urgency)
 *   - down    = moss (tax bill went down)
 *   - neutral = ink on bone (just a number, no judgment)
 */
export default function StatCard({
  label,
  value,
  caption,
  tone = "neutral",
  className = "",
}: Props) {
  const t = toneStyles[tone];
  return (
    <div className={`rounded-md border ${t.surface} px-5 py-6 ${className}`}>
      <p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.16em] ${t.label}`}>
        {label}
      </p>
      <p className={`mt-3 font-serif text-3xl sm:text-4xl font-semibold tabular-nums ${t.value}`}>
        {value}
      </p>
      {caption && (
        <p className={`mt-1.5 font-sans text-sm ${t.caption}`}>{caption}</p>
      )}
    </div>
  );
}
