'use client';

import { useEffect, useRef, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../lib/firebase';
import AnimatedModal from '@/app/components/AnimatedModal';

interface LoginModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

const auth = getAuth(app);

export default function LoginModal({ isOpen, onCloseAction }: LoginModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCloseAction();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onCloseAction]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            onCloseAction();
        }
    };

    const handleLogin = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCred.user.getIdToken();

            await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            setEmail('');
            setPassword('');
            setError(null);
            onCloseAction();
        } catch {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <AnimatedModal isOpen={isOpen} onClose={onCloseAction}>
            <div
                ref={modalRef}
                onClick={handleClickOutside}
                className="bg-[#373F4D] text-white w-full max-w-sm p-6 rounded-xl shadow-xl space-y-4"
            >
                <h2 className="text-xl font-bold">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded border border-[#D9D9D9] bg-white text-[#2E3D52] placeholder-[#99A1AF]"
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded border border-[#D9D9D9] bg-white text-[#2E3D52] placeholder-[#99A1AF]"
                />

                {error && (
                    <p className="text-red-400 bg-[#1e2633] border border-red-600 p-3 rounded-lg text-sm shadow-sm">
                        ❌ {error}
                    </p>
                )}

                <div className="flex justify-end gap-4 pt-2">
                    <button
                        onClick={onCloseAction}
                        className="text-sm px-4 py-2 rounded border border-[#D9D9D9] hover:bg-[#4C5B70] hover:text-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogin}
                        className="text-sm px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </AnimatedModal>
    );
}
