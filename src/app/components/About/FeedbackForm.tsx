// src/app/components/About/FeedbackForm.tsx
"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder logic, this could be hooked into Firestore or email
    console.log({ name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Send Us Feedback</h2>
      {submitted && (
        <p className="text-green-400 mb-2">Thanks for your feedback!</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your Message"
          className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
