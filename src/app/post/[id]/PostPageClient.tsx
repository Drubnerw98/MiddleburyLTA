"use client";

import { useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { updatePostInlineAction } from "@/app/actions/adminPostAction";
import { useAuthState } from "react-firebase-hooks/auth";

import PostDisplay from "@/app/components/Posts/PostDisplay";
import PostEdit from "@/app/components/Posts/PostEdit";

import { CommentForm } from "@/app/components/Comments/CommentForm";
import CommentList from "@/app/components/Comments/CommentList";
import { createCommentAction } from "@/app/actions/createCommentAction";
import { useIsAdmin } from "@/app/components/Auth/useIsAdmin";

import { softDeleteComment } from "../../../../lib/comments";
import { editCommentContent } from "../../../../lib/editcomments";

export interface Comment {
  id: string;
  uid: string;
  author: string;
  content: string;
  timestamp?: { seconds: number };
  edited?: boolean;
  deleted?: boolean;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  commentsDisabled?: boolean;
}

type Props = {
  postId: string;
  initialPost: PostData;
  initialComments: Comment[];
};

export default function PostPageClient({ postId, initialPost, initialComments }: Props) {
  const [post, setPost] = useState<PostData>(initialPost);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const { isAdmin } = useIsAdmin();

  // Comment list is publicly readable; refreshing via the client SDK
  // after each mutation keeps the UI snappy without round-tripping a
  // server action just to refetch.
  const refreshComments = async () => {
    const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc"),
    );
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[]);
  };

  const handleSubmitAction = async () => {
    if (!commentText || !user) return;

    const result = await createCommentAction(
        postId,
        commentText,
        user.email || "Anonymous",
    );

    if (!result.success) {
      setCommentError(result.message ?? "Something went wrong.");
      return;
    }

    setCommentText("");
    setCommentError(null);
    await refreshComments();
  };

  const handleDeleteCommentAction = async (commentId: string) => {
    await softDeleteComment(postId, commentId);
    await refreshComments();
  };

  const handleEditCommentAction = async (commentId: string, newContent: string) => {
    await editCommentContent(postId, commentId, newContent);
    await refreshComments();
  };

  const handleSaveAction = async (updatedPost: PostData) => {
    const result = await updatePostInlineAction(postId, {
      title: updatedPost.title,
      content: updatedPost.content,
      tags: updatedPost.tags ?? [],
      imageUrl: updatedPost.imageUrl ?? "",
      commentsDisabled: updatedPost.commentsDisabled ?? false,
    });
    if (!result.success) {
      console.error("Failed to save post:", result.message);
      return;
    }
    setPost(updatedPost);
    setEditing(false);
  };

  return (
      <div className="flex justify-center px-4">
        <div className="w-full max-w-3xl space-y-8">
          {editing ? (
              <PostEdit
                  postId={postId}
                  post={post}
                  onSaveAction={handleSaveAction}
              />
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
                    setCommentTextAction={setCommentText}
                    onSubmitAction={handleSubmitAction}
                    isAuthenticated={!!user}
                />

                {commentError && (
                    <p className="text-red-400 text-sm mt-2">{commentError}</p>
                )}

                <CommentList
                    comments={comments}
                    isAdmin={isAdmin}
                    currentUserId={user?.uid || ""}
                    onDeleteCommentAction={handleDeleteCommentAction}
                    onEditCommentAction={handleEditCommentAction}
                />
              </div>
          ) : (
              <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 mb-12 text-gray-400 italic text-center text-sm shadow-inner">
                Comments are disabled for this post.
              </div>
          )}
          {isAdmin && !editing && (
              <div className="text-center">
                <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-gray-400 hover:text-white underline-offset-4 hover:underline"
                >
                    Edit post
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
