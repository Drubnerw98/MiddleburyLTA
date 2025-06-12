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
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import PostDisplay from "@/app/components/Posts/PostDisplay";
import PostEdit from "@/app/components/Posts/PostEdit";
import { deletePostAction } from "@/app/components/Posts/PostControls";

import { CommentForm } from "@/app/components/Comments/CommentForm";
import CommentList from "@/app/components/Comments/CommentList";
import { createCommentAction } from "@/app/actions/createCommentAction";

import { softDeleteComment } from "../../../../lib/comments";
import { editCommentContent } from "../../../../lib/editcomments";

interface Comment {
  id: string;
  uid: string;
  author: string;
  content: string;
  timestamp?: { seconds: number };
  edited?: boolean;
  deleted?: boolean;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  commentsDisabled?: boolean;
}

const fetchPost = async (postId: string): Promise<PostData | null> => {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PostData;
  }
  return null;
};

const fetchComments = async (postId: string): Promise<Comment[]> => {
  const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};

export default function PostDetail() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  const isAdmin = user?.email === "drubnation@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await fetchPost(postId);
      if (fetchedPost) setPost(fetchedPost);

      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    };

    void fetchData(); // ignore unhandled promise
  }, [postId]);

  const refreshComments = async () => {
    const updated = await fetchComments(postId);
    setComments(updated);
  };

  const handleAddComment = async () => {
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
    await refreshComments();
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await softDeleteComment(postId, commentId);
      await refreshComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await editCommentContent(postId, commentId, newContent);
      await refreshComments();
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!isAdmin) return;
    await deletePostAction(postId);
    window.location.href = "/";
  };

  const handleUpdatePost = async (updatedPost: PostData) => {
    const { id, ...rest } = updatedPost;
    await updateDoc(doc(db, "posts", postId), rest);
    setPost(updatedPost);
    setEditing(false);
  };

  if (!post)
    return (
        <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
          Loading post...
        </div>
    );

  return (
      <div className="flex justify-center px-4">
        <div className="w-full max-w-3xl space-y-8">
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
                    comments={comments}
                    isAdmin={isAdmin}
                    currentUserId={user?.uid || ""}
                    onDeleteComment={handleDeleteComment}
                    onEditComment={handleEditComment}
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
