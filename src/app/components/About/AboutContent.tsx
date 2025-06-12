// src/app/components/About/AboutContent.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import ReactMarkdown from "react-markdown";

export default function AboutContent() {
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const docRef = doc(db, "pages", "about");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data().content || "");
            } else {
                setContent("About content coming soon.");
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10">
            <div className="bg-[#2c3545]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-8 space-y-6">
                <header>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-yellow-300 tracking-tight mb-4">
                        About Middlebury Taxpayers
                    </h1>
                    <p className="text-gray-400 text-base">
                        Learn about our mission, values, and goals as a local civic group.
                    </p>
                </header>

                {content ? (
                    <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-gray-400 italic">Loading...</p>
                )}
            </div>
        </section>
    );
}
