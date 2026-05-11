import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Byline / source / credit line. Small sans-serif, muted, italicized
 * for the unmistakable editorial footer feel.
 */
export default function SourceLine({ children, className = "" }: Props) {
  return (
    <p
      className={`font-sans text-xs italic text-muted leading-[1.5] ${className}`}
    >
      {children}
    </p>
  );
}
