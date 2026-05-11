type Bar = {
  label: string;
  value: number;
  /** Formatted display string. Defaults to the raw value. */
  display?: string;
  tone?: "up" | "down" | "neutral";
};

type Props = {
  bars: Bar[];
  /** Maximum value used to scale bar widths. Auto from bars if omitted. */
  max?: number;
  className?: string;
};

const toneStyles: Record<NonNullable<Bar["tone"]>, { fill: string; value: string }> = {
  up: { fill: "bg-oxblood", value: "text-oxblood" },
  down: { fill: "bg-moss", value: "text-moss" },
  neutral: { fill: "bg-ink", value: "text-ink" },
};

/**
 * Horizontal bar comparison. Two or more values rendered against the
 * same scale. Used to show old-tax vs new-tax vs new-tax-plus-bond
 * without resorting to a charting library.
 */
export default function BarCompare({ bars, max, className = "" }: Props) {
  const scaleMax = max ?? Math.max(...bars.map((b) => b.value));
  return (
    <div className={`space-y-4 ${className}`}>
      {bars.map((bar) => {
        const t = toneStyles[bar.tone ?? "neutral"];
        const widthPct = scaleMax > 0 ? Math.max(2, (bar.value / scaleMax) * 100) : 0;
        return (
          <div key={bar.label}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {bar.label}
              </span>
              <span className={`font-serif text-lg font-semibold tabular-nums ${t.value}`}>
                {bar.display ?? bar.value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-rule rounded-sm overflow-hidden">
              <div
                className={`h-full ${t.fill} transition-[width] duration-500`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
