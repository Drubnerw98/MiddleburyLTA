// src/app/components/About/AboutContent.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import ReactMarkdown from "react-markdown";
import { db } from "../../../../lib/firebase";

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
      <section className="bg-[#2c3545] border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          About Middlebury Taxpayers
        </h1>

        {content ? (
            <div className="prose prose-invert text-gray-300">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        ) : (
            <p className="text-gray-400 italic">Loading...</p>
        )}

        <img
            src="https://source.unsplash.com/random/800x200/?community"
            alt="Middlebury Community"
            className="w-full h-auto rounded-lg border border-gray-600 shadow-sm mt-6"
        />
      </section>
  );
}
