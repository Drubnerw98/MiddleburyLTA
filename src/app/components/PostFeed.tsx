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

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Recent Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "2rem" }}>
          <h3>{post.title}</h3>
          <ReactMarkdown>{post.content}</ReactMarkdown>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{
                maxWidth: "100%",
                marginTop: "0.5rem",
                borderRadius: "8px",
              }}
            />
          )}
          <small>by {post.author}</small>

          <div style={{ marginTop: "0.5rem" }}>
            <Link href={`/post/${post.id}`}>
              <button>View Post</button>
            </Link>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
}
