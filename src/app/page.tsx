"use client";

import {
  collection,
  getDocs,
  orderBy,
  query,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import PostPreview from "@/app/components/Posts/PostPreview";
import SearchBar from "@/app/components/SearchBar";
import { useSearchParams, useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: number;
  tags?: string[];
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      if (lastDoc && !reset) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      const filtered = searchQuery
        ? fetched.filter((p) => {
            const matchTitle = p.title.toLowerCase().includes(searchQuery);
            const matchContent = p.content.toLowerCase().includes(searchQuery);
            const matchTags = p.tags?.some((tag) =>
              tag.toLowerCase().includes(searchQuery)
            );
            return matchTitle || matchContent || matchTags;
          })
        : fetched;

      setPosts((prev) => {
        const combined = reset ? filtered : [...prev, ...filtered];
        const unique = Array.from(
          new Map(combined.map((p) => [p.id, p])).values()
        );
        return unique;
      });

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);

      if (snapshot.empty || snapshot.docs.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">MLTA Tax Impact Center</h1>
      <p className="text-gray-400 mb-6">
        A community-driven space for sharing facts, updates, and discussion.
      </p>

      <SearchBar />

      <div className="space-y-6">
        {posts.length === 0 && !loading ? (
          <p className="text-center text-gray-400 mt-8">
            No posts found. Try a different search.
          </p>
        ) : (
          posts.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              onTagClick={(tag) => {
                const encoded = encodeURIComponent(tag);
                router.push(`/?q=${encoded}`);
              }}
            />
          ))
        )}
      </div>

      {hasMore && !searchQuery && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchPosts()}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
}
