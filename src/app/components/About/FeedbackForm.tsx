"use client";

import { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const feedback = { name, email, message };
    console.log("🔍 Feedback submitted:", feedback);

    try {
      const settingsRef = doc(db, "admin", "settings");
      const settingsSnap = await getDoc(settingsRef);
      const shouldNotify =
        settingsSnap.exists() && settingsSnap.data().emailNotifications;

      if (shouldNotify) {
        const res = await fetch(`${window.location.origin}/api/send-feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedback),
        });

        const result = await res.json();
        console.log("📬 API response:", result);

        if (!res.ok) {
          console.error("❌ Email failed:", result.error);
        }
      }
    } catch (err) {
      console.error("❌ Error in submission flow:", err);
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section className="bg-[#2c3545] border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto shadow-md">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Send Us Feedback</h2>

      {submitted && (
        <p className="text-green-400 bg-[#1e2633] border border-green-600 p-3 rounded mb-4">
          ✅ Thanks for your feedback!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Message"
          rows={4}
          className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
