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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search posts..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded bg-black border-gray-600 text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
      {input && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          ✕
        </button>
      )}
    </form>
  );
}
