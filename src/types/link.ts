export interface LinkItem {
    id: string
    title: string
    url: string
    description?: string
    source?: string
    datePublished?: string
    createdAt?: number // seconds since epoch, or undefined
}
