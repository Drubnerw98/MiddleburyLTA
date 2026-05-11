"use client";

import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

// URL scheme allowlist for any link rendered out of markdown. Default
// react-markdown allows javascript:/data: URLs through as anchor hrefs,
// which is a stored-XSS sink when posts are admin-authored and rendered
// to the public. Empty string makes react-markdown drop the href.
const SAFE_URL_SCHEMES = ["https:", "http:", "mailto:"];
function safeUrl(url: string): string {
  try {
    const parsed = new URL(url, "https://placeholder.invalid/");
    return SAFE_URL_SCHEMES.includes(parsed.protocol) ? url : "";
  } catch {
    return "";
  }
}

interface PostDisplayProps {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

export default function PostDisplay({
  title,
  content,
  imageUrl,
  tags,
}: PostDisplayProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    router.push(`/?q=${encodeURIComponent(tag)}`);
  };

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-8">
      <header>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] tracking-[-0.015em] break-words">
          {title}
        </h1>

        {(tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5">
            {(tags ?? []).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      {imageUrl && (
        <div className="overflow-hidden border border-rule">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      )}

      <div className="markdown-content font-sans text-base text-ink-soft max-w-[68ch] leading-relaxed break-words">
        <ReactMarkdown urlTransform={safeUrl}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
