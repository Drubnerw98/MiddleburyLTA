// src/app/components/AdminPostForm.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import {
  createPostAction,
  deletePostAction,
  editPostAction,
} from "@/app/components/Posts/PostControls";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Post {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
}

export default function AdminPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetched);
    };
    fetchPosts();
  }, [status]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(editingId ? "Updating..." : "Submitting...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    if (image) formData.append("image", image);
    if (editingId) formData.append("id", editingId);

    const action = editingId ? editPostAction : createPostAction;

    startTransition(() => {
      action(formData).then((res) => {
        setStatus(
          res.success
            ? "✅ Success!"
            : res.message || "❌ Something went wrong."
        );
        if (res.success) {
          setTitle("");
          setContent("");
          setTags("");
          setImage(null);
          setPreviewUrl(null);
          setEditingId(null);
        }
      });
    });
  };

  // Edit post
  const handleEdit = (post: Post) => {
    setTitle(post.title || "");
    setContent(post.content || "");
    setTags(post.tags?.join(", ") || "");
    setPreviewUrl(post.imageUrl || null);
    setEditingId(post.id);
  };

  // Delete post
  const handleDelete = (id: string) => {
    startTransition(() => {
      deletePostAction(id).then((res) => {
        setStatus(
          res.success ? "🗑️ Deleted!" : res.message || "Error deleting post."
        );
      });
    });
  };

  // Image preview handler
  const handleImageChange = (file: File | null) => {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="w-full"
        />

        {previewUrl && (
          <div>
            <p className="text-sm text-gray-500">Image Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-w-xs rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {editingId ? "Update Post" : "Submit Post"}
        </button>

        {status && (
          <p className="text-sm mt-2 text-gray-700 italic">{status}</p>
        )}
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h3 className="font-bold">{post.title || "(Untitled Post)"}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {post.tags?.length ? `Tags: ${post.tags.join(", ")}` : ""}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              {post.content?.slice(0, 100) || "(No content)"}...
            </p>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
