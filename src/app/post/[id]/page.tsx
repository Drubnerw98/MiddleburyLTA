// src/app/post/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import PostDisplay from "@/app/components/Posts/PostDisplay";
import PostEdit from "@/app/components/Posts/PostEdit";
import PostAction from "@/app/components/Posts/PostAction";
import { CommentForm } from "@/app/components/Comments/CommentForm";
import CommentList from "@/app/components/Comments/CommentList";

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
  const [user] = useAuthState(auth);

  const isAdmin = user?.email === "drubnation@gmail.com"; // Simplified admin check

  useEffect(() => {
    async function fetchPost() {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());
      }
    }

    async function fetchComments() {
      const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc")
      );
      const querySnapshot = await getDocs(q);
      const loadedComments = querySnapshot.docs.map((doc) => ({
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

    const newComment = {
      content: commentText,
      author: user.email || "Anonymous",
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "posts", postId, "comments"), newComment);
    setCommentText("");

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
    await deleteDoc(doc(db, "posts", postId));
    window.location.href = "/";
  }

  async function handleUpdatePost(updatedPost: any) {
    await updateDoc(doc(db, "posts", postId), updatedPost);
    setPost(updatedPost);
    setEditing(false);
  }

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      {editing ? (
        <PostEdit postId={postId} post={post} onSave={handleUpdatePost} />
      ) : (
        <PostDisplay
          title={post.title}
          content={post.content}
          imageUrl={post.imageUrl}
        />
      )}

      <PostAction
        isEditing={editing}
        onEdit={() => setEditing(true)}
        onDelete={handleDeletePost}
      />

      <h3>Comments</h3>
      <CommentForm
        commentText={commentText}
        SetCommentText={setCommentText}
        onSubmit={handleAddComment}
        isAuthenticated={!!user}
      />
      <CommentList
        comments={comments}
        isAdmin={isAdmin}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
