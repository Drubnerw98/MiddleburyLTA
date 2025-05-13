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
    <div className="max-w-3xl mx-auto p-6 bg-[#2c3545] rounded shadow-md text-white overflow-x-auto">
      <h2 className="text-3xl font-bold mb-2 text-blue-300 break-words">
        {title}
      </h2>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-blue-700 text-white rounded-full"
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
          className="w-full h-auto rounded mb-4 max-h-96 object-contain"
        />
      )}

      <div className="markdown-content break-words whitespace-pre-wrap text-gray-200">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
