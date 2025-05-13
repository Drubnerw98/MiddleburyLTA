"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: number;
  tags?: string[];
}

interface PostPreviewProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

export default function PostPreview({ post, onTagClick }: PostPreviewProps) {
  const isTruncated = post.content.length > 200;
  const excerpt = isTruncated
    ? post.content.slice(0, 200) + "..."
    : post.content;

  const date = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="bg-[#2c3545] border border-gray-700 rounded p-4 shadow-sm hover:shadow transition max-w-3xl w-full mx-auto mb-6">
      {post.imageUrl && (
        <Link href={`/post/${post.id}`}>
          <div className="mb-3">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded max-h-60"
            />
          </div>
        </Link>
      )}

      <Link href={`/post/${post.id}`}>
        <h2 className="text-2xl font-bold text-blue-300 hover:underline break-words mb-1">
          {post.title}
        </h2>
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="text-xs px-2 py-1 bg-blue-700 text-white rounded-full hover:bg-blue-600"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {date && <p className="text-sm text-gray-400 mb-2">{date}</p>}

      <p className="text-gray-300 mb-2 whitespace-pre-wrap break-words">
        {excerpt}
        {isTruncated && (
          <>
            {" "}
            <Link
              href={`/post/${post.id}`}
              className="text-blue-400 hover:underline"
            >
              Read more →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
