"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [input, setInput] = useState(queryParam);

  useEffect(() => {
    setInput(queryParam); // Sync input if URL query changes
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = input.trim();

    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/`); // Clear query from URL
    }
  };

  const handleClear = () => {
    setInput("");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search posts..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 px-4 py-2 rounded bg-[#2c3545] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Search
      </button>
      {input && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
        >
          ✕
        </button>
      )}
    </form>
  );
}
