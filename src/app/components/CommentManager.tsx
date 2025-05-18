"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Comment {
  id: string;
  text: string;
  author?: string;
  postId: string;
}

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const allComments: Comment[] = [];
        const titleMap: Record<string, string> = {};

        const postsSnapshot = await getDocs(collection(db, "posts"));

        for (const postDoc of postsSnapshot.docs) {
          const postId = postDoc.id;
          const postTitle = postDoc.data().title || postId;
          titleMap[postId] = postTitle;

          const commentsSnapshot = await getDocs(
            collection(db, "posts", postId, "comments")
          );

          commentsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            allComments.push({
              id: docSnap.id,
              postId,
              text: data.text || data.content || "No comment",
              author: data.author || "Anonymous",
            });
          });
        }

        setPostTitles(titleMap);
        setComments(allComments);
      } catch (err) {
        console.error("Error loading comments:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDelete = async (postId: string, commentId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
      setComments((prev) =>
        prev.filter((c) => !(c.id === commentId && c.postId === postId))
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loading)
    return <p className="text-gray-400 italic">Loading comments...</p>;
  if (error)
    return <p className="text-red-500 italic">❌ Error loading comments</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-400 border-b border-white/10 pb-2">
        Manage Comments
      </h2>

      {comments.map((comment) => (
        <div
          key={`${comment.postId}-${comment.id}`}
          className="bg-[#2c3545] border border-white/10 p-4 rounded-lg shadow-md"
        >
          <p className="text-sm text-gray-300 mb-1 italic">{comment.text}</p>
          <p className="text-sm text-blue-400 mb-1">By: {comment.author}</p>
          <p className="text-xs text-gray-500">
            Post:{" "}
            <span className="text-white">
              {postTitles[comment.postId] || comment.postId}
            </span>
          </p>

          <button
            onClick={() => handleDelete(comment.postId, comment.id)}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
