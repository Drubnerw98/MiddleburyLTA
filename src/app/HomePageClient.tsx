"use client";

import {
  collection,
  getDocs,
  orderBy,
  query,
  startAfter,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import PostPreview from "@/app/components/Posts/PostPreview";
import SearchBar from "@/app/components/SearchBar";
import TaxImpactCTA from "@/app/components/TaxImpactCTA";
import { useSearchParams, useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: number;
  tags?: string[];
}

export default function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Refs avoid the stale-closure trap: fetchPosts is memoized only by
  // searchQuery, but it needs the latest values of these on every call.
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (loadingRef.current || (!hasMoreRef.current && !reset)) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        let q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        if (lastDocRef.current && !reset) {
          q = query(q, startAfter(lastDocRef.current));
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
          return Array.from(new Map(combined.map((p) => [p.id, p])).values());
        });

        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;

        if (snapshot.empty || snapshot.docs.length < 10) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    lastDocRef.current = null;
    hasMoreRef.current = true;
    fetchPosts(true);
  }, [searchQuery, fetchPosts]);

  useEffect(() => {
    if (searchQuery || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [searchQuery, hasMore, loading, fetchPosts]);

  return (
      <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-2 pb-6 space-y-10">
        {/* Hero + Search */}
        <div className="relative z-10 rounded-xl border border-white/10 bg-gradient-to-br from-blue-900/30 via-blue-800/10 to-transparent backdrop-blur-md p-6 shadow-md space-y-4">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-yellow-300 tracking-tight mb-2">
              Tax Impact Center
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              A community-powered space for facts, updates, and civic discussion.
            </p>
          </div>
          <SearchBar />
        </div>

        {/* Call to Action */}
        <TaxImpactCTA />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 && !loading ? (
              <p className="text-center text-gray-500 mt-8">
                No posts found. Try a different search.
              </p>
          ) : (
              posts.map((post) => (
                  <PostPreview
                      key={post.id}
                      post={post}
                      onTagClick={(tag) => {
                        router.push(`/?q=${encodeURIComponent(tag)}`);
                      }}
                  />
              ))
          )}
        </div>

        {/* Infinite Scroll Marker */}
        {!searchQuery && hasMore && <div ref={loadMoreRef} className="h-12" />}
      </main>
  );
}
