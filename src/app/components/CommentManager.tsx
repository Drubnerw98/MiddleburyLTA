"use client";

import { useEffect, useState, useTransition } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Comment {
  id: string;
  postId: string;
  text: string;
  author?: string;
  timestamp?: any;
}

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchAllComments = async () => {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const allComments: Comment[] = [];

      for (const postDoc of postsSnapshot.docs) {
        const postId = postDoc.id;
        const commentsSnapshot = await getDocs(
          collection(db, "posts", postId, "comments")
        );

        commentsSnapshot.forEach((commentDoc) => {
          allComments.push({
            id: commentDoc.id,
            postId,
            ...commentDoc.data(),
          } as Comment);
        });
      }

      setComments(allComments);
    };

    fetchAllComments();
  }, []);

  const handleDelete = (commentId: string, postId: string) => {
    startTransition(() => {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      deleteDoc(commentRef)
        .then(() => {
          setComments((prev) =>
            prev.filter((c) => c.id !== commentId || c.postId !== postId)
          );
          setStatus("🗑️ Comment deleted.");
        })
        .catch((err) => {
          console.error(err);
          setStatus("❌ Error deleting comment.");
        });
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-blue-400 border-b border-white/10 pb-2">
        Manage Comments
      </h2>

      {comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments found.</p>
      )}

      {comments.map((comment) => (
        <div
          key={`${comment.postId}-${comment.id}`}
          className="bg-[#2c3545] border border-white/10 p-4 rounded-lg shadow-md"
        >
          <p className="text-sm text-gray-300 mb-1 italic">{comment.text}</p>
          {comment.author && (
            <p className="text-sm text-blue-400 mb-1">By: {comment.author}</p>
          )}
          <p className="text-xs text-gray-500">
            Post ID: <span className="text-white">{comment.postId}</span>
          </p>

          <button
            onClick={() => handleDelete(comment.id, comment.postId)}
            disabled={isPending}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      ))}

      {status && <p className="text-sm mt-2 text-gray-300 italic">{status}</p>}
    </div>
  );
}
