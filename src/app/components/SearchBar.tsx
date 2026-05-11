"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [input, setInput] = useState(queryParam);

  useEffect(() => {
    setInput(queryParam);
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (query) {
      router.push(`/updates?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/updates`);
    }
  };

  const handleClear = () => {
    setInput("");
    router.push("/updates");
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
        className="flex-1 px-4 py-2.5 bg-bone border border-rule text-ink placeholder:text-muted/70 font-sans focus:outline-none focus:border-ink transition-colors"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-ink hover:bg-ink-soft text-paper px-5 py-2.5 font-sans text-sm font-semibold tracking-wide transition-colors"
        >
          Search
        </button>
        {input && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="border border-rule hover:border-ink text-ink px-3 py-2.5 font-sans transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
