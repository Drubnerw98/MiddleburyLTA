"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [input, setInput] = useState(queryParam);

  useEffect(() => {
    setInput(queryParam); // Sync with URL changes
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/`);
    }
  };

  const handleClear = () => {
    setInput("");
    router.push("/");
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center"
      >
        <input
            type="text"
            placeholder="Search posts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-[#1e2633] text-white placeholder-gray-400 border border-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-all"
        />
        <div className="flex gap-2">
          <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Search
          </button>
          {input && (
              <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                ✕
              </button>
          )}
        </div>
      </form>
  );
}
