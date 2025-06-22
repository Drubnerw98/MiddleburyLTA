"use client";

import { useState, useEffect, useRef } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

interface ContactModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export default function ContactModal({ isOpen, onCloseAction }: ContactModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseAction();
        };
        if (isOpen) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onCloseAction]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            onCloseAction();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const feedback = { name, email, message };

        try {
            const settingsRef = doc(db, "admin", "settings");
            const settingsSnap = await getDoc(settingsRef);
            const shouldNotify = settingsSnap.exists() && settingsSnap.data().emailNotifications;

            if (shouldNotify) {
                const res = await fetch("/api/send-feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(feedback),
                });

                const result = await res.json();
                if (!res.ok) {
                    console.error("❌ Email failed:", result.error);
                    setStatus("error");
                    return;
                }
            }

            setStatus("success");
            setName("");
            setEmail("");
            setMessage("");
        } catch (err) {
            console.error("❌ Submission error:", err);
            setStatus("error");
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
            <div className="bg-[#373F4D] text-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-white">Contact Us</h2>

                {status === "success" && (
                    <p className="text-green-400 bg-[#1e2633] border border-green-600 p-3 rounded-lg text-sm shadow-sm">
                        ✅ Thanks for reaching out! We&apos;ll be in touch.
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-400 bg-[#1e2633] border border-red-600 p-3 rounded-lg text-sm shadow-sm">
                        ❌ Something went wrong. Please try again later.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded border border-[#D9D9D9] bg-white text-[#2E3D52] placeholder-[#99A1AF]"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded border border-[#D9D9D9] bg-white text-[#2E3D52] placeholder-[#99A1AF]"
                    />
                    <textarea
                        placeholder="Your Message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 rounded border border-[#D9D9D9] bg-white text-[#2E3D52] placeholder-[#99A1AF] resize-none"
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-md bg-sky-600 px-6 py-2 text-white hover:bg-sky-700 transition font-semibold"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                <hr className="border-white/30 my-4" />

                <div className="text-sm">
                    <p>You can also reach us directly at:</p>
                    <p className="mt-1">
                        Email:{" "}
                        <a
                            href="mailto:MTA.admn@gmail.com"
                            className="underline hover:text-white cursor-pointer"
                        >
                            MTA.admn@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
