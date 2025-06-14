"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() } as PostData);
      }

      const q = query(
          collection(db, "posts", postId, "comments"),
          orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[]);
    };

    void fetchData();
  }, [postId]);

  const refreshComments = async () => {
    const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[]);
  };

  const handleSubmitAction = async () => {
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

  const handleDeleteCommentAction = async (commentId: string) => {
    await softDeleteComment(postId, commentId);
    await refreshComments();
  };

  const handleEditCommentAction = async (commentId: string, newContent: string) => {
    await editCommentContent(postId, commentId, newContent);
    await refreshComments();
  };

  const handleDeletePost = async () => {
    if (!isAdmin) return;
    await deletePostAction(postId);
    router.push("/");
  };

  const handleSaveAction = async (updatedPost: PostData) => {
    const { id, ...rest } = updatedPost;
    await updateDoc(doc(db, "posts", postId), rest);
    setPost(updatedPost);
    setEditing(false);
  };

  if (!post) {
    return (
        <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
          Loading post...
        </div>
    );
  }

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
        </div>
      </div>
  );
}
