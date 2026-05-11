"use client";

import BackToTopButton from "@/app/components/BackToTopButton";
import { LinkItem } from "@/types/link";
import { DisplayHeading, Eyebrow, Lead, SourceLine } from "@/app/components/ui";

interface Props {
    links: LinkItem[];
}

// Canonical source groups rendered in this order. Anything that doesn't
// match falls into "Other".
const SOURCE_GROUPS = [
    "CT Insider",
    "Hartford Courant",
    "Bee-Intelligencer",
    "Other",
] as const;

type SourceGroup = (typeof SOURCE_GROUPS)[number];

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function bucketSource(raw: string | undefined): SourceGroup {
    const n = normalize(raw ?? "");
    if (!n) return "Other";
    if (n.includes("ctinsider") || n.includes("connecticutinsider")) return "CT Insider";
    if (n.includes("hartfordcourant") || n.includes("courant")) return "Hartford Courant";
    if (n.includes("beeintelligencer") || n.includes("bee")) return "Bee-Intelligencer";
    return "Other";
}

function formatDaysAgo(seconds: number | undefined): string {
    if (!seconds) return "";
    const daysAgo = Math.floor((Date.now() / 1000 - seconds) / 86400);
    if (daysAgo === 0) return "Added today";
    if (daysAgo === 1) return "Added 1 day ago";
    return `Added ${daysAgo} days ago`;
}

export default function AnimatedArticles({ links }: Props) {
    const grouped: Record<SourceGroup, LinkItem[]> = {
        "CT Insider": [],
        "Hartford Courant": [],
        "Bee-Intelligencer": [],
        Other: [],
    };
    for (const link of links) {
        grouped[bucketSource(link.source)].push(link);
    }
    const nonEmptyGroups = SOURCE_GROUPS.filter((g) => grouped[g].length > 0);

    return (
        <main className="bg-paper min-h-screen">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
                {/* Header */}
                <header>
                    <Eyebrow tone="oxblood">Coverage</Eyebrow>
                    <DisplayHeading level={1} className="mt-3">
                        Articles &amp; links.
                    </DisplayHeading>
                    <Lead className="mt-5">
                        Press coverage and source documents relevant to
                        Middlebury&rsquo;s tax debate, grouped by publication.
                    </Lead>
                </header>

                {nonEmptyGroups.length === 0 ? (
                    <p className="font-sans text-sm text-muted mt-16 italic">
                        No articles have been added yet.
                    </p>
                ) : (
                    <div className="mt-14 sm:mt-20 space-y-14 sm:space-y-20">
                        {nonEmptyGroups.map((group) => (
                            <section key={group}>
                                <Eyebrow tone="oxblood" className="mb-6">
                                    {group}
                                </Eyebrow>
                                <ul className="space-y-10">
                                    {grouped[group].map((link) => (
                                        <li
                                            key={link.id}
                                            className="border-t border-rule pt-7"
                                        >
                                            <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-[1.25] text-ink">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-oxblood transition-colors"
                                                >
                                                    {link.title}
                                                </a>
                                            </h2>
                                            <p className="font-sans text-xs uppercase tracking-[0.14em] text-muted mt-2">
                                                {link.source}
                                                {link.datePublished ? ` · ${link.datePublished}` : ""}
                                            </p>
                                            {link.description && (
                                                <p className="font-sans text-base text-ink-soft leading-relaxed mt-3 max-w-[60ch]">
                                                    {link.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mt-4">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                                >
                                                    Read the article ↗
                                                </a>
                                                <SourceLine className="not-italic">
                                                    {formatDaysAgo(link.createdAt)}
                                                </SourceLine>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <BackToTopButton />
        </main>
    );
}
