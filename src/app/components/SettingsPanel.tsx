'use client';

import { useEffect, useState, useTransition } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { saveSettingsAction } from '@/app/actions/adminSettingsAction';

export default function SettingsPanel() {
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [status, setStatus] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Read via client SDK (admin doc is publicly readable per
        // firestore.rules so the public site can check toggles). Writes go
        // through saveSettingsAction so the admin claim is re-verified.
        const fetchSettings = async () => {
            const docRef = doc(db, 'admin', 'settings');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setEmailNotifications(!!docSnap.data().emailNotifications);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = () => {
        setStatus('Saving…');
        startTransition(async () => {
            const result = await saveSettingsAction({ emailNotifications });
            if (result.success) {
                setStatus('Saved.');
            } else {
                setStatus(result.message ?? 'Error saving.');
            }
        });
    };

    return (
        <div className="max-w-xl mx-auto bg-bone border border-rule-strong p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
                Site settings
            </h2>

            <label className="flex items-center gap-3 font-sans text-base text-ink-soft cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 accent-ink"
                />
                Enable email notifications
            </label>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-60"
                >
                    Save settings
                </button>
                {status && (
                    <p className="font-sans text-sm text-muted">{status}</p>
                )}
            </div>
        </div>
    );
}
