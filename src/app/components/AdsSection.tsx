import Link from "next/link";

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
        <section className="bg-slate-50 border-y border-slate-200 px-4 py-12 sm:py-16">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 sm:mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Our 2026 Ads
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                        What we’re telling Middlebury
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                        Printed and digital ads running in spring 2026 alongside the May 6 referendum and the post-revaluation tax bill cycle.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {ads.map((ad) => (
                        <article
                            key={ad.href}
                            className="rounded-xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">
                                {ad.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2 flex-1">
                                {ad.summary}
                            </p>
                            <Link
                                href={ad.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-sky-700 hover:text-sky-900 no-underline w-max"
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
