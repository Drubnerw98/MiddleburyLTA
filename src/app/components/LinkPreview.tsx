import { LinkItem } from '@/types/link'
import { formatDistanceToNow } from 'date-fns'

export default function LinkPreview({ link }: { link: LinkItem }) {
    const date =
        typeof link.createdAt === 'number'
            ? formatDistanceToNow(new Date(link.createdAt * 1000), { addSuffix: true })
            : ''

    return (
        <article className="bg-[#1e2633]/90 border border-yellow-400/20 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg hover:border-yellow-400 transition-all p-6 max-w-3xl w-full mx-auto space-y-4">
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-yellow-300 hover:underline break-words">
                    {link.title}
                </h2>
            </a>

            {(link.source || link.datePublished) && (
                <div className="text-sm text-gray-400 italic">
                    {link.source}
                    {link.source && link.datePublished && ' · '}
                    {link.datePublished}
                </div>
            )}

            {date && <p className="text-xs text-gray-400 italic">Added {date}</p>}

            {link.description && (
                <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                    {link.description}
                </p>
            )}
        </article>
    )
}
