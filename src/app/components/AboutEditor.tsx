'use client';

import { useEffect, useState, useTransition } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function AboutEditor() {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchAbout = async () => {
            const docRef = doc(db, 'pages', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data().content || '');
            } else {
                setStatus('⚠️ About page not found.');
            }
        };
        fetchAbout();
    }, []);

    const handleSave = () => {
        setStatus('Saving...');
        startTransition(() => {
            const docRef = doc(db, 'pages', 'about');
            setDoc(docRef, { content })
                .then(() => setStatus('✅ Saved successfully.'))
                .catch((err) => {
                    console.error(err);
                    setStatus('❌ Error saving.');
                });
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-6 text-black max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#1A2E49] border-b border-gray-300 pb-2">
                Edit About Page
            </h2>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full p-4 rounded bg-gray-100 text-black border border-gray-300"
                placeholder="Write the About page content here in markdown..."
            />

            <button
                onClick={handleSave}
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
                Save
            </button>

            {status && <p className="text-sm mt-2 text-gray-600 italic">{status}</p>}
        </div>
    );
}
