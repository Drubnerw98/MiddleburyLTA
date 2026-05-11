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
  const excerpt = isTruncated ? post.content.slice(0, 200) + "..." : post.content;

  let date = "";
  if (post.createdAt) {
    const timestamp = new Date(
      typeof post.createdAt === "number"
        ? post.createdAt
        : post.createdAt["seconds"] * 1000,
    );
    if (!isNaN(timestamp.getTime())) {
      date = formatDistanceToNow(timestamp, { addSuffix: true });
    }
  }

  return (
    <article className="border-t border-rule pt-7">
      {post.imageUrl && (
        <Link href={`/post/${post.id}`} className="block mb-5 no-underline">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full max-h-[420px] object-cover"
          />
        </Link>
      )}

      <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-[1.2] text-ink">
        <Link
          href={`/post/${post.id}`}
          className="hover:text-oxblood transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {date && (
        <p className="font-sans text-xs uppercase tracking-[0.14em] text-muted mt-2">
          {date}
        </p>
      )}

      {(post.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {(post.tags ?? []).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <p className="font-sans text-base text-ink-soft leading-relaxed mt-4 max-w-[60ch] whitespace-pre-wrap break-words">
        {excerpt}
        {isTruncated && (
          <>
            {" "}
            <Link
              href={`/post/${post.id}`}
              className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
            >
              Read more &rarr;
            </Link>
          </>
        )}
      </p>
    </article>
  );
}
