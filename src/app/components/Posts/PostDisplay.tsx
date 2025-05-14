"use client";

import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

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
    const encoded = encodeURIComponent(tag);
    router.push(`/?q=${encoded}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-12 bg-[#2c3545]/90 backdrop-blur border border-white/10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] rounded-lg text-white overflow-x-auto space-y-6">
      {/* Title */}
      <h1 className="text-4xl font-serif font-semibold text-blue-300 break-words leading-tight">
        {title}
      </h1>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs px-2 py-1 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 text-white hover:brightness-110 transition-all duration-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-base max-w-none text-gray-200 break-words leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
