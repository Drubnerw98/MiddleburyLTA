// src/app/page.tsx
"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import PostPreview from "@/app/components/Posts/PostPreview";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  timestamp?: { seconds: number };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
    }

    fetchPosts();
  }, []);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Middlebury Info Hub</h1>
      <p className="text-gray-600 mb-6">
        A community-driven space for sharing facts, updates, and discussion.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
