"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  timestamp?: { seconds: number };
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
        <div className="text-center text-gray-400 italic py-10">
          Loading posts...
        </div>
    );
  }

  return (
      <section className="max-w-3xl mx-auto px-4 space-y-10">
        <h2 className="text-2xl font-semibold text-yellow-300 border-b border-yellow-400 pb-2">
          Recent Posts
        </h2>

        {posts.map((post) => (
            <article
                key={post.id}
                className="bg-[#1f2937]/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl hover:shadow-2xl transition-all p-6 space-y-4"
            >
              <header className="space-y-1">
                <h3 className="text-xl font-bold text-yellow-300 tracking-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400">
                  By {post.author}
                  {post.timestamp && (
                      <>
                        {" "}
                        •{" "}
                        {new Date(post.timestamp.seconds * 1000).toLocaleDateString()}
                      </>
                  )}
                </p>
              </header>

              <div className="text-gray-300 text-sm line-clamp-4">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {post.imageUrl && (
                  <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full rounded-md border border-white/10 shadow-sm"
                  />
              )}

              <div className="pt-2">
                <Link
                    href={`/post/${post.id}`}
                    className="inline-block text-sm font-semibold text-yellow-300 hover:text-yellow-200 transition hover:underline"
                >
                  View Full Post →
                </Link>
              </div>
            </article>
        ))}
      </section>
  );
}
