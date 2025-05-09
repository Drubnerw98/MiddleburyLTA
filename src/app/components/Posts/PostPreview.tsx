// src/app/components/Posts/PostPreview.tsx
"use client";

import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  timestamp?: { seconds: number };
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const excerpt =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;
  const date = post.timestamp
    ? new Date(post.timestamp.seconds * 1000).toLocaleDateString()
    : "";

  return (
    <div className="border rounded p-4 shadow-sm">
      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-semibold text-blue-600 hover:underline">
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-gray-500 mb-2">
        by {post.author} • {date}
      </p>
      <p className="text-gray-800 mb-2">{excerpt}</p>
      <Link
        href={`/post/${post.id}`}
        className="text-blue-500 hover:underline text-sm"
      >
        Read more →
      </Link>
    </div>
  );
}
