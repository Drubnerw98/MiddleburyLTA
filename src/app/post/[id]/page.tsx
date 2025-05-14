"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import PostDisplay from "@/app/components/Posts/PostDisplay";
import PostEdit from "@/app/components/Posts/PostEdit";
import {
  editPostAction,
  deletePostAction,
} from "@/app/components/Posts/PostControls";

import { CommentForm } from "@/app/components/Comments/CommentForm";
import CommentList from "@/app/components/Comments/CommentList";
import { createCommentAction } from "@/app/actions/createCommentAction";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp?: { seconds: number };
}

export default function PostDetail() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  const isAdmin = user?.email === "drubnation@gmail.com";

  useEffect(() => {
    async function fetchPost() {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
    }

    async function fetchComments() {
      const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);
      const loadedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(loadedComments);
    }

    fetchPost();
    fetchComments();
  }, [postId]);

  async function handleAddComment() {
    if (!commentText || !user) return;

    const result = await createCommentAction(
      postId,
      commentText,
      user.email || "Anonymous"
    );

    if (!result.success) {
      setCommentError(result.message ?? "Something went wrong.");
      return;
    }

    setCommentText("");
    setCommentError(null);

    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);
    const updatedComments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    setComments(updatedComments);
  }

  async function handleDeleteComment(commentId: string) {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    setComments(comments.filter((c) => c.id !== commentId));
  }

  async function handleDeletePost() {
    if (!isAdmin) return;
    await deletePostAction(postId);
    window.location.href = "/";
  }

  async function handleUpdatePost(updatedPost: any) {
    await updateDoc(doc(db, "posts", postId), updatedPost);
    setPost(updatedPost);
    setEditing(false);
  }

  if (!post)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
        Loading post...
      </div>
    );

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Post */}
        {editing ? (
          <PostEdit postId={postId} post={post} onSave={handleUpdatePost} />
        ) : (
          <PostDisplay
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
            tags={post.tags}
          />
        )}

        {/* Comments */}
        {!post.commentsDisabled ? (
          <div className="bg-[#2c3545]/80 backdrop-blur border border-white/10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] rounded-lg p-6 mb-12">
            <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>

            <CommentForm
              commentText={commentText}
              SetCommentText={setCommentText}
              onSubmit={handleAddComment}
              isAuthenticated={!!user}
            />

            {commentError && (
              <p className="text-red-400 text-sm mt-2">{commentError}</p>
            )}

            <CommentList
              postId={postId}
              comments={comments} // Pass the comments prop
              isAdmin={isAdmin} // Pass the isAdmin prop
              onDeleteComment={handleDeleteComment}
            />
          </div>
        ) : (
          <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 mb-12 text-gray-400 italic text-center text-sm shadow-inner">
            Comments are disabled for this post.
          </div>
        )}
      </div>
    </div>
  );
}
