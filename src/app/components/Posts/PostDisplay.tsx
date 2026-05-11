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
      <article className="max-w-3xl mx-auto px-6 py-8 bg-[#1e2633]/90 border border-yellow-400/20 rounded-xl shadow-md backdrop-blur-md space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-serif font-bold text-yellow-300 break-words leading-tight tracking-tight">
          {title}
        </h1>

        {/* Tags */}
        {(tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(tags ?? []).map((tag) => (
                  <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-semibold hover:bg-yellow-500/20 transition"
                  >
                    #{tag}
                  </button>
              ))}
            </div>
        )}

        {/* Image */}
        {imageUrl && (
            <div className="rounded-md overflow-hidden border border-white/10">
              <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-base max-w-none text-gray-200 leading-relaxed break-words">
          <ReactMarkdown urlTransform={safeUrl}>{content}</ReactMarkdown>
        </div>
      </article>
  );
}
