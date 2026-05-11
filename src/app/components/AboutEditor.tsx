'use client';

import { useEffect, useState, useTransition } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { saveAboutAction } from '@/app/actions/adminAboutAction';

export default function AboutEditor() {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Read is fine via client SDK (publicly readable per firestore.rules).
        // Writes go through the saveAboutAction below so the admin claim is
        // re-verified server-side and content is length-capped.
        const fetchAbout = async () => {
            const docRef = doc(db, 'pages', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data().content || '');
            } else {
                setStatus('About page not found.');
            }
        };
        fetchAbout();
    }, []);

    const handleSave = () => {
        setStatus('Saving…');
        startTransition(async () => {
            const result = await saveAboutAction(content);
            if (result.success) {
                setStatus('Saved.');
            } else {
                setStatus(result.message ?? 'Error saving.');
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto bg-bone border border-rule-strong p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
                Edit About page
            </h2>

            <p className="font-sans text-xs uppercase tracking-[0.14em] text-muted">
                Markdown supported.
            </p>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                className="w-full font-sans text-base bg-paper border border-ink/30 p-4 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors resize-y"
                placeholder="Write the About page content here in markdown…"
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-60"
                >
                    Save
                </button>
                {status && (
                    <p className="font-sans text-sm text-muted">{status}</p>
                )}
            </div>
        </div>
    );
}
