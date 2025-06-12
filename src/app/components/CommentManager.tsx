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
      <div className="space-y-6 px-4 py-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-yellow-400 border-b border-yellow-500/30 pb-2">
          Comment Manager
        </h2>

        {comments.length === 0 && (
            <p className="text-gray-400 italic">No comments to display.</p>
        )}

        {comments.map((comment) => (
            <div
                key={`${comment.postId}-${comment.id}`}
                className="bg-[#1e2633] border border-white/10 p-4 rounded-md shadow-sm hover:shadow-md transition"
            >
              <p className="text-gray-300 italic mb-2">“{comment.text}”</p>
              <div className="text-sm text-gray-400 mb-2">
                <span className="text-blue-400">By:</span> {comment.author}
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-yellow-300">Post:</span>{" "}
                <span className="text-white font-medium">
              {postTitles[comment.postId] || comment.postId}
            </span>
              </div>

              <button
                  onClick={() => handleDelete(comment.postId, comment.id)}
                  className="mt-3 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
        ))}
      </div>
  );
}
