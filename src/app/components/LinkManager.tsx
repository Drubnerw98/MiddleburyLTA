'use client'

import { useState } from 'react'
import { createLinkAction } from '@/app/actions/adminLinkActions'

const inputClass =
    'w-full font-sans text-base bg-paper border border-ink/30 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors'

export default function LinkManager() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [source, setSource] = useState('')
    const [datePublished, setDatePublished] = useState('')
    const [status, setStatus] = useState<
        | { kind: 'idle' }
        | { kind: 'saving' }
        | { kind: 'success' }
        | { kind: 'error'; message: string }
    >({ kind: 'idle' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus({ kind: 'saving' })

        const result = await createLinkAction({
            title,
            url,
            description,
            source,
            datePublished,
        })

        if (!result.success) {
            const fieldMsg = result.fieldErrors
                ? Object.entries(result.fieldErrors)
                      .map(([k, v]) => `${k}: ${v?.join(', ')}`)
                      .join(' · ')
                : ''
            setStatus({
                kind: 'error',
                message: result.message ?? fieldMsg ?? 'Failed to save link.',
            })
            return
        }

        setStatus({ kind: 'success' })
        setTitle('')
        setUrl('')
        setDescription('')
        setSource('')
        setDatePublished('')
        setTimeout(() => setStatus({ kind: 'idle' }), 3000)
    }

    return (
        <div className="max-w-2xl mx-auto bg-bone border border-rule-strong p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
                Add a new article or link
            </h2>

            {status.kind === 'success' && (
                <p className="font-sans text-sm text-moss bg-moss/[0.06] border-l-2 border-moss px-4 py-3 mt-5">
                    Link added successfully.
                </p>
            )}
            {status.kind === 'error' && (
                <p className="font-sans text-sm text-oxblood bg-oxblood/[0.06] border-l-2 border-oxblood px-4 py-3 mt-5">
                    {status.message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <input
                    type="text"
                    placeholder="Title"
                    className={inputClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="url"
                    placeholder="URL"
                    className={inputClass}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    list="source-suggestions"
                    placeholder="Source (e.g. CT Insider)"
                    className={inputClass}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                {/* Canonical source values used by the public Articles page for
                    grouping. Free-text is still allowed; anything that doesn't
                    match one of these labels falls under the "Other" group. */}
                <datalist id="source-suggestions">
                    <option value="CT Insider" />
                    <option value="Hartford Courant" />
                    <option value="Bee-Intelligencer" />
                    <option value="Republican-American" />
                </datalist>
                <input
                    type="text"
                    placeholder="Date published (e.g. 2026-05-12)"
                    className={inputClass}
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={status.kind === 'saving'}
                    className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-60"
                >
                    {status.kind === 'saving' ? 'Saving…' : 'Submit'}
                </button>
            </form>
        </div>
    )
}
