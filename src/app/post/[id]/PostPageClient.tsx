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
      <main className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-16">
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

          <section className="mt-4">
            {!post.commentsDisabled ? (
                <>
                  <CommentForm
                      commentText={commentText}
                      setCommentTextAction={setCommentText}
                      onSubmitAction={handleSubmitAction}
                      isAuthenticated={!!user}
                  />

                  {commentError && (
                      <p className="font-sans text-sm text-oxblood mt-3">
                        {commentError}
                      </p>
                  )}

                  <CommentList
                      comments={comments}
                      isAdmin={isAdmin}
                      currentUserId={user?.uid || ""}
                      onDeleteCommentAction={handleDeleteCommentAction}
                      onEditCommentAction={handleEditCommentAction}
                  />
                </>
            ) : (
                <p className="font-sans text-sm italic text-muted text-center mt-10 border-t border-rule pt-8">
                  Comments are disabled for this post.
                </p>
            )}
          </section>

          {isAdmin && !editing && (
              <div className="text-center mt-10">
                <button
                    onClick={() => setEditing(true)}
                    className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                >
                    Edit post
                </button>
              </div>
          )}
        </div>
      </main>
  );
}
