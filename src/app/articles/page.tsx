import BackToTopButton from "@/app/components/BackToTopButton";
export const dynamic = "force-dynamic";

import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { LinkItem } from '@/types/link';

function formatDaysAgo(seconds: number | undefined): string {
    if (!seconds) return '';
    const daysAgo = Math.floor((Date.now() / 1000 - seconds) / 86400);
    if (daysAgo === 0) return 'Added today';
    if (daysAgo === 1) return 'Added 1 day ago';
    return `Added ${daysAgo} days ago`;
}

export default async function ArticlesPage() {
    const snapshot = await getDocs(
        query(
            collection(db, 'external_links'),
            orderBy('priority', 'asc'),
            orderBy('createdAt', 'desc')
        )
    );

    const links: LinkItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            url: data.url,
            description: data.description ?? '',
            source: data.source ?? '',
            datePublished: data.datePublished ?? '',
            createdAt: data.createdAt?.seconds ?? undefined,
        };
    });

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E49]">Articles & Links</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Curated external resources and media relevant to Middlebury’s civic discussions.
                    </p>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="group transition duration-200 hover:bg-blue-50 w-full"
                    >
                        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                {/* Left column: content */}
                                <div className="sm:max-w-3xl">
                                    <h2 className="text-lg font-semibold text-[#1A2E49] mb-1">{link.title}</h2>
                                    <p className="text-sm text-gray-600">
                                        {link.source}
                                        {link.datePublished ? ` - ${link.datePublished}` : ''}
                                    </p>
                                    {link.description && (
                                        <p className="text-sm text-gray-700 leading-relaxed mt-3 whitespace-normal">
                                            {link.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">{formatDaysAgo(link.createdAt)}</p>
                                </div>

                                {/* Right column: button */}
                                <div className="sm:flex-shrink-0">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-[#1A2E49] !text-white font-semibold text-center w-[120px] px-4 py-2 text-sm rounded hover:bg-[#2e4a6e] transition"
                                    >
                                        View Article
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <BackToTopButton />
        </div>
    );
}
