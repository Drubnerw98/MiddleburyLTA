'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

export default function LinkManager() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [source, setSource] = useState('')
    const [datePublished, setDatePublished] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await addDoc(collection(db, 'external_links'), {
                title,
                url,
                description,
                source,
                datePublished,
                createdAt: serverTimestamp(),
            })

            setSuccess(true)
            setTitle('')
            setUrl('')
            setDescription('')
            setSource('')
            setDatePublished('')

            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error('Error adding document:', err)
        }
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#1A2E49] mb-6">Add New Article or Link</h2>

            {success && (
                <p className="text-green-600 mb-4 transition-opacity duration-300">
                    Link added successfully!
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="url"
                    placeholder="URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Source (e.g. CT Mirror)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Date Published (e.g. 2024-05-12)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-[#1A2E49] text-white px-6 py-2 rounded-md hover:bg-[#2e4a6e] transition"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}
