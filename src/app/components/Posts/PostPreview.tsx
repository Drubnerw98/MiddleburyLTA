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

  let date = "";
  if (post.createdAt) {
    const timestamp =
      typeof post.createdAt === "number"
        ? new Date(post.createdAt)
        : new Date(post.createdAt?.["seconds"] * 1000);
    if (!isNaN(timestamp.getTime())) {
      date = formatDistanceToNow(timestamp, { addSuffix: true });
    }
  }

  return (
    <div className="bg-[#2c3545]/90 border border-white/10 shadow-md hover:shadow-xl hover:border-blue-500/30 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] rounded-lg p-6 backdrop-blur transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] max-w-3xl w-full mx-auto">
      {post.imageUrl && (
        <Link href={`/post/${post.id}`}>
          <div className="mb-4 overflow-hidden rounded-md">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
      )}

      <Link href={`/post/${post.id}`}>
        <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-blue-300 hover:underline break-words mb-2">
          {post.title}
        </h2>
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-medium hover:brightness-110 hover:shadow-md transition-all"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {date && <p className="text-xs text-gray-400 italic mb-2">{date}</p>}

      <p className="text-gray-300 whitespace-pre-wrap break-words leading-relaxed text-[15px]">
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
