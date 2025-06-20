// src/app/components/Auth/LoginModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../lib/firebase";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const auth = getAuth(app);

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // ESC close support
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Background click closes modal
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    const handleLogin = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCred.user.getIdToken();

            await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            setEmail("");
            setPassword("");
            setError(null);
            onClose();
        } catch {
            setError("Login failed. Please check your credentials.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClickOutside}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-[#373F4D] text-white w-full max-w-sm p-6 rounded-xl shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-white">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 rounded border border-[#D9D9D9] text-[#2E3D52] placeholder-[#99A1AF] bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 rounded border border-[#D9D9D9] text-[#2E3D52] placeholder-[#99A1AF] bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="w-full text-sm py-2 rounded border border-[#D9D9D9] hover:bg-[#4C5B70] hover:text-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogin}
                        className="w-full text-sm py-2 rounded bg-[#2E3D52] hover:bg-[#516684] text-white font-semibold transition"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
