import BackToTopButton from "@/app/components/BackToTopButton";

export const dynamic = "force-dynamic";

import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { LinkItem } from '@/types/link';

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
            <div className="max-w-4xl w-full mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E49]">Articles & Links</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Curated external resources and media relevant to Middlebury’s civic discussions.
                    </p>
                </div>

                <div className="divide-y divide-gray-300">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="py-6 hover:bg-blue-50 transition duration-200 px-2 -mx-2 rounded-md"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#1A2E49] mb-1">{link.title}</h2>
                                    <p className="text-sm text-gray-600">
                                        {link.source}
                                        {link.datePublished ? ` - ${link.datePublished}` : ''}
                                    </p>
                                </div>
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
                    ))}
                </div>
            </div>

            <BackToTopButton />
        </div>
    );
}
