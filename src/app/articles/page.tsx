export const dynamic = "force-dynamic";

import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ArticlesClient from './ArticlesClient';
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
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-5 text-center max-w-2xl mx-auto space-y-2">
                <h1 className="text-4xl font-bold text-yellow-300">Articles & Links</h1>
                <p className="text-sm text-gray-300 leading-relaxed">
                    Curated external resources and media relevant to Middlebury’s civic discussions.
                </p>
            </div>

            <ArticlesClient links={links} />
        </div>
    );
}
