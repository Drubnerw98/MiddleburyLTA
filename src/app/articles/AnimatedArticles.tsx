"use client";

import { motion } from "framer-motion";
import BackToTopButton from "@/app/components/BackToTopButton";
import { LinkItem } from "@/types/link";

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

const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, "");

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
    // Bucket links by source group. Each group preserves the input order,
    // which the page-level Firestore query has already sorted by
    // `priority asc, createdAt desc`.
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
        <motion.div
            className="min-h-screen flex flex-col bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E49]">Articles & Links</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Press coverage and source documents relevant to Middlebury&rsquo;s tax debate, grouped by publication.
                    </p>
                </div>
            </div>

            {nonEmptyGroups.length === 0 ? (
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 text-center text-sm text-gray-500">
                    No articles have been added yet.
                </div>
            ) : (
                nonEmptyGroups.map((group) => (
                    <section key={group} className="w-full">
                        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-2">
                            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A2E49]">
                                {group}
                            </h2>
                            <div className="h-px bg-gray-200 mt-3" />
                        </div>

                        <div className="divide-y divide-gray-200">
                            {grouped[group].map((link) => (
                                <div
                                    key={link.id}
                                    className="group transition duration-200 hover:bg-blue-50 w-full"
                                >
                                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="sm:max-w-3xl">
                                                <h3 className="text-lg font-semibold text-[#1A2E49] mb-1">{link.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {link.source}
                                                    {link.datePublished ? ` - ${link.datePublished}` : ""}
                                                </p>
                                                {link.description && (
                                                    <p className="text-sm text-gray-700 leading-relaxed mt-3 whitespace-normal">
                                                        {link.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">{formatDaysAgo(link.createdAt)}</p>
                                            </div>

                                            <div className="sm:flex-shrink-0">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block bg-[#1A2E49] no-underline !text-white font-semibold text-center w-[120px] px-4 py-2 text-sm rounded hover:bg-[#2e4a6e] transition"
                                                >
                                                    View Article
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            )}

            <BackToTopButton />
        </motion.div>
    );
}
