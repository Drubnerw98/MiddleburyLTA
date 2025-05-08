"use client";

import ReactMarkdown from "react-markdown";

interface PostDisplayProps {
  title: string;
  content: string;
  imageUrl?: string;
}

export default function PostDisplay({
  title,
  content,
  imageUrl,
}: PostDisplayProps) {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>{title}</h2>
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ maxWidth: "100%", margin: "1rem 0", borderRadius: "8px" }}
        />
      )}
    </div>
  );
}
