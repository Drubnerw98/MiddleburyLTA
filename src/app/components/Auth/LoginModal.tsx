'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../lib/firebase';
import AnimatedModal from '@/app/components/AnimatedModal';

interface LoginModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

const auth = getAuth(app);

export default function LoginModal({ isOpen, onCloseAction }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCred.user.getIdToken();

            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            if (!res.ok) throw new Error('Session creation failed');

            setEmail('');
            setPassword('');
            setError(null);
            onCloseAction();
        } catch {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <AnimatedModal isOpen={isOpen} onClose={onCloseAction} title="Login">
            <div className="bg-bone text-ink w-full max-w-sm p-7 sm:p-8 border border-rule-strong space-y-5">
                <div>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-oxblood">
                        Account
                    </p>
                    <h2 className="font-serif text-2xl font-semibold text-ink mt-1.5">
                        Log in
                    </h2>
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full font-sans text-base bg-paper border border-ink/40 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full font-sans text-base bg-paper border border-ink/40 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
                />

                {error && (
                    <p className="font-sans text-sm text-oxblood bg-oxblood/[0.06] border-l-2 border-oxblood px-4 py-3">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-1">
                    <button
                        onClick={onCloseAction}
                        className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-sm font-semibold text-ink border border-ink hover:bg-ink hover:text-bone transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogin}
                        className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </AnimatedModal>
    );
}
