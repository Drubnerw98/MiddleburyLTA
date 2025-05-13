"use client";

import ReactMarkdown from "react-markdown";

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
  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2c3545] border border-gray-700 rounded-lg shadow-md text-white overflow-x-auto">
      <h1 className="text-4xl font-serif font-semibold text-blue-300 break-words mb-4 leading-tight">
        {title}
      </h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-blue-700 text-white rounded-full hover:bg-blue-600 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg mb-6 max-h-96 object-contain"
        />
      )}

      <div className="prose prose-invert prose-base max-w-none break-words text-gray-200 leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
