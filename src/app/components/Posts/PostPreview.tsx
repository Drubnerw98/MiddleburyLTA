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
    const timestamp = new Date(
        typeof post.createdAt === "number"
            ? post.createdAt
            : post.createdAt["seconds"] * 1000
    );
    if (!isNaN(timestamp.getTime())) {
      date = formatDistanceToNow(timestamp, { addSuffix: true });
    }
  }

  return (
      <article className="bg-[#1e2633]/90 border border-yellow-400/20 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg hover:border-yellow-400 transition-all p-6 max-w-3xl w-full mx-auto space-y-4">
        {post.imageUrl && (
            <Link href={`/post/${post.id}`}>
              <div className="rounded-md overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full object-cover rounded-md hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </Link>
        )}

        <Link href={`/post/${post.id}`}>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-yellow-300 hover:underline break-words">
            {post.title}
          </h2>
        </Link>

        {(post.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {(post.tags ?? []).map((tag) => (
                  <button
                      key={tag}
                      onClick={() => onTagClick?.(tag)}
                      className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-semibold hover:bg-yellow-500/20 transition"
                  >
                    #{tag}
                  </button>
              ))}
            </div>
        )}

        {date && <p className="text-xs text-gray-400 italic">{date}</p>}

        <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-[15px]">
          {excerpt}
          {isTruncated && (
              <>
                {" "}
                <Link
                    href={`/post/${post.id}`}
                    className="text-yellow-300 hover:underline font-medium"
                >
                  Read more →
                </Link>
              </>
          )}
        </p>
      </article>
  );
}
