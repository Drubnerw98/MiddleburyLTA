import Link from "next/link";
import { DisplayHeading, Eyebrow, Lead } from "@/app/components/ui";

export default function NotFound() {
  return (
    <main className="bg-paper min-h-screen">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-32">
        <Eyebrow tone="oxblood">404 · Not found</Eyebrow>
        <DisplayHeading level={1} className="mt-3">
          We couldn&rsquo;t find that page.
        </DisplayHeading>
        <Lead className="mt-5">
          The link might be out of date, or the page may have moved.
          The tax calculator and the rest of the site are still where
          you&rsquo;d expect.
        </Lead>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 font-sans text-base font-semibold text-bone no-underline hover:bg-ink-soft transition-colors"
          >
            <span aria-hidden>&larr;</span>
            Back to the front page
          </Link>
          <Link
            href="/tax-impact"
            className="inline-flex items-center justify-center px-7 py-3.5 font-sans text-base font-semibold text-ink hover:bg-ink hover:text-bone border border-ink transition-colors"
          >
            Open the calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
