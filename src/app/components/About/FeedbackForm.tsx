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
        if (!res.ok) console.error("❌ Email failed:", result.error);
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
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[#2c3545]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 space-y-5">
          <h2 className="text-2xl font-semibold text-yellow-300">Send Us Feedback</h2>

          {submitted && (
              <p className="text-green-400 bg-[#1e2633] border border-green-600 p-3 rounded-lg text-sm shadow-sm">
                ✅ Thanks for your feedback!
              </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1e2633] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1e2633] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
                placeholder="Your Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1e2633] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>

            <div className="text-right">
              <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
  );
}
