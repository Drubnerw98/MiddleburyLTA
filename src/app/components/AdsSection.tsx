import Link from "next/link";
import { DisplayHeading, Eyebrow } from "@/app/components/ui";

// "Our 2026 Ads" landing-page section.
//
// Placeholder titles and one-line summaries below were inferred from the
// May 11, 2026 brief, not lifted from the ad creative itself. Confirm
// against the actual ads in public/docs/ and tighten as needed.

type Ad = {
    title: string;
    summary: string;
    href: string;
};

const ads: Ad[] = [
    {
        title: "The Harsh Reality",
        summary:
            "A side-by-side look at how the 2025 revaluation hit Yale Avenue homes versus how two commercial properties saw tax bills cut by 60-68% under the Pizzuto / Hartley “8-3m” law.",
        href: "/docs/harsh-reality-may-2026.pdf",
    },
    {
        title: "Closed for Business",
        summary:
            "Why Middlebury’s commercial tax base is shrinking, and what that means for residential property tax bills in the years ahead.",
        href: "/docs/closed-for-business-may-2026.pdf",
    },
];

export default function AdsSection() {
    return (
        <section className="bg-paper-deep border-t border-rule">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 py-14 sm:py-20">
                <Eyebrow tone="oxblood">Our 2026 ads</Eyebrow>
                <DisplayHeading level={2} as="h2" className="mt-3">
                    What we&rsquo;re telling Middlebury.
                </DisplayHeading>
                <p className="font-sans text-base text-ink-soft mt-4 max-w-[60ch] leading-relaxed">
                    Printed and digital ads running alongside the May 6 referendum
                    and the post-revaluation tax bill cycle.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {ads.map((ad) => (
                        <article key={ad.href} className="bg-bone border border-rule p-6 sm:p-7 flex flex-col">
                            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
                                {ad.title}
                            </h3>
                            <p className="font-sans text-sm text-ink-soft leading-relaxed mt-3 flex-1">
                                {ad.summary}
                            </p>
                            <Link
                                href={ad.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors w-max"
                            >
                                Read the ad (PDF)
                                <span aria-hidden>↗</span>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
