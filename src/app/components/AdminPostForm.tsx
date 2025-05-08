"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactMarkdown from "react-markdown";

export default function AdminPostForm() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth changed. Current user:", currentUser);
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const isAdminValue =
          userDoc.exists() && userDoc.data()?.isAdmin === true;
        console.log("Admin check:", isAdminValue, userDoc.data());
        setIsAdmin(isAdminValue);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) {
      setStatus("Please fill in both fields.");
      return;
    }

    try {
      let imageUrl = null;

      if (image) {
        console.log("Uploading image:", image.name);
        const imageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded. URL:", imageUrl);
      }

      console.log("Creating post with data:", {
        title,
        content,
        imageUrl,
        author: user.email,
      });

      await addDoc(collection(db, "posts"), {
        title,
        content,
        imageUrl,
        timestamp: serverTimestamp(),
        author: user.email,
      });

      setStatus("Post submitted!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (err) {
      console.error("Error submitting post:", err);
      setStatus("Error submitting post.");
    }
  };

  if (!user || isAdmin === null) return <p>Loading...</p>;
  if (!isAdmin) return <p>Access denied. Admins only.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create New Post</h2>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "0.5rem", width: "100%" }}
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        style={{ marginBottom: "0.5rem" }}
      />
      <button onClick={handleSubmit}>Submit Post</button>
      <p>{status}</p>
    </div>
  );
}
