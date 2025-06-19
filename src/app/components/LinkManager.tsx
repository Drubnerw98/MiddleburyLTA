'use client'

import { useState } from 'react'

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {db} from "../../../lib/firebase";

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
        } catch (err) {
            console.error('Error adding document:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-black/70 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-yellow-400">Add Article or Link</h2>

            {success && <p className="text-green-400">Link added successfully!</p>}

            <input
                type="text"
                placeholder="Title"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="url"
                placeholder="URL"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Source (e.g. CT Mirror)"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={source}
                onChange={(e) => setSource(e.target.value)}
            />
            <input
                type="text"
                placeholder="Date Published (e.g. 2024-05-12)"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={datePublished}
                onChange={(e) => setDatePublished(e.target.value)}
            />

            <button
                type="submit"
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
            >
                Submit
            </button>
        </form>
    )
}
