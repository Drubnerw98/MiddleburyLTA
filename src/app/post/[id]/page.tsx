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
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactMarkdown from "react-markdown";

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost(postData);
        setEditTitle(postData.title);
        setEditContent(postData.content);
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

    async function checkAdminStatus() {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data()?.isAdmin === true);
      }
    }

    fetchPost();
    fetchComments();
    checkAdminStatus();
  }, [postId, user]);

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

  async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      window.location.href = "/home";
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete the post.");
    }
  }

  async function handleEditSubmit() {
    try {
      await updateDoc(doc(db, "posts", postId), {
        title: editTitle,
        content: editContent,
      });
      setPost({ ...post, title: editTitle, content: editContent });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update the post.");
    }
  }

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button onClick={handleEditSubmit}>Save Changes</button>
          <button
            onClick={() => setIsEditing(false)}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <div className="markdown-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </>
      )}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ maxWidth: "100%", margin: "1rem 0", borderRadius: "8px" }}
        />
      )}

      {isAdmin && !isEditing && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{ marginRight: "0.5rem" }}
          >
            Edit Post
          </button>
          <button
            onClick={handleDeletePost}
            style={{
              backgroundColor: "#8b0000",
              color: "white",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          >
            Delete Post
          </button>
        </div>
      )}

      <h3>Comments</h3>
      {user ? (
        <>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </>
      ) : (
        <p>Please sign in to comment.</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: "1rem" }}>
            <p>{comment.content}</p>
            <small>by {comment.author}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
