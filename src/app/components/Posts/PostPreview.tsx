"use client";

import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: number; // using createdAt instead of timestamp
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const excerpt =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;

  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "";

  return (
    <div className="border rounded p-4 shadow-sm">
      <Link href={`/post/${post.id}`}>
        <h2 className="text-xl font-semibold text-blue-600 hover:underline">
          {post.title}
        </h2>
      </Link>

      {date && <p className="text-sm text-gray-500 mb-2">{date}</p>}

      <p className="text-gray-300 mb-2">{excerpt}</p>

      <Link
        href={`/post/${post.id}`}
        className="text-blue-400 hover:underline text-sm"
      >
        Read more →
      </Link>
    </div>
  );
}
