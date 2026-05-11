import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Hero / section lead paragraph. Larger than body, slightly serif-leaning
 * weight, set in the sans face to keep the display serif as the rarer
 * gesture.
 */
export default function Lead({ children, className = "" }: Props) {
  return (
    <p
      className={`font-sans text-lg sm:text-xl leading-[1.55] text-ink-soft max-w-[60ch] ${className}`}
    >
      {children}
    </p>
  );
}
