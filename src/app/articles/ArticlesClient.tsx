'use client'

import { LinkItem } from '@/types/link'
import LinkPreview from '../components/LinkPreview'

export default function ArticlesClient({ links }: { links: LinkItem[] }) {
    return (
        <div className="space-y-6">
            {links.map((link) => (
                <LinkPreview key={link.id} link={link} />
            ))}
        </div>
    )
}
