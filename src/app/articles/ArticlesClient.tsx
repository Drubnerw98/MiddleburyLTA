'use client';

import { LinkItem } from '@/types/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ArticlesClient({ links }: { links: LinkItem[] }) {
    return (
        <div className="space-y-0">
            {links.map((link, index) => {
                const isEven = index % 2 === 0;
                const createdAt = link.createdAt ? dayjs.unix(link.createdAt) : null;
                const published = link.datePublished ? ` – ${link.datePublished}` : '';

                return (
                    <div
                        key={link.id}
                        className={`w-full px-6 py-5 transition ${
                            isEven ? 'bg-white' : 'bg-gray-100'
                        } hover:bg-blue-50`}
                    >
                        <div className="max-w-4xl mx-auto space-y-2">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                “{link.title}”
                            </h2>
                            {(link.source || link.datePublished) && (
                                <p className="text-sm text-gray-600">
                                    {link.source}
                                    {published}
                                </p>
                            )}
                            {createdAt && (
                                <p className="text-xs text-gray-500">
                                    Added {createdAt.fromNow()}
                                </p>
                            )}
                            <div className="mt-3">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition"
                                >
                                    View Article
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="text-center pt-8 pb-4">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="border border-gray-400 text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                    Back to Top
                </button>
            </div>
        </div>
    );
}
