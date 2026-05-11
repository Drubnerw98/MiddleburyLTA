import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  level?: 1 | 2 | 3;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

const sizes: Record<NonNullable<Props["level"]>, string> = {
  1: "text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.015em]",
  2: "text-3xl sm:text-4xl leading-[1.1] tracking-[-0.01em]",
  3: "text-2xl sm:text-3xl leading-[1.15] tracking-[-0.005em]",
};

/**
 * Serif display headline. The cornerstone of the editorial-civic system.
 * Source Serif 4 at a confident size, light tracking, hung with care.
 */
export default function DisplayHeading({
  children,
  level = 1,
  as,
  className = "",
}: Props) {
  const Tag = as ?? (`h${level}` as "h1" | "h2" | "h3");
  return (
    <Tag
      className={`font-serif font-semibold text-ink ${sizes[level]} ${className}`}
    >
      {children}
    </Tag>
  );
}
