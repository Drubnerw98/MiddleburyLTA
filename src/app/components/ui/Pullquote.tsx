import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  attribution?: ReactNode;
  className?: string;
};

/**
 * Editorial pullquote. Serif, oversized, set with a thin oxblood rule on
 * the left. Used to break up dense fact lists and to dramatize one
 * number or claim at a time.
 */
export default function Pullquote({ children, attribution, className = "" }: Props) {
  return (
    <figure
      className={`border-l-2 border-oxblood pl-5 sm:pl-7 py-1 ${className}`}
    >
      <blockquote className="font-serif text-2xl sm:text-3xl leading-[1.25] text-ink font-medium">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 font-sans text-sm text-muted">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
