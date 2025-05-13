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
  const [removeImage, setRemoveImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(editingId ? "Updating..." : "Submitting...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    if (image) formData.append("image", image);
    if (editingId) {
      formData.append("id", editingId);
      if (removeImage) formData.append("removeImage", "true");
    }

    const action = editingId ? editPostAction : createPostAction;

    startTransition(() => {
      action(formData).then((res) => {
        setStatus(
          res.success
            ? "✅ Success!"
            : res.message || "❌ Something went wrong."
        );
        if (res.success) {
          resetForm();
        }
      });
    });
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title || "");
    setContent(post.content || "");
    setTags(post.tags?.join(", ") || "");
    setPreviewUrl(post.imageUrl || null);
    setImage(null);
    setRemoveImage(false);
    setEditingId(post.id);
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      deletePostAction(id).then((res) => {
        setStatus(
          res.success ? "🗑️ Deleted!" : res.message || "Error deleting post."
        );
      });
    });
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setImage(null);
    setPreviewUrl(null);
    setRemoveImage(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-10 p-6 max-w-3xl mx-auto text-white">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-[#2c3545] p-6 rounded shadow-md border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-2">
          {editingId ? "✏️ Edit Post" : "📝 Create New Post"}
        </h2>

        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 whitespace-pre-wrap break-words"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        {previewUrl && !removeImage && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-w-xs rounded border mb-2"
            />
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setRemoveImage(true);
                  setPreviewUrl(null);
                  setImage(null);
                }}
                className="text-sm text-red-400 hover:underline"
              >
                Remove Current Image
              </button>
            )}
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
          <p className="text-sm mt-2 text-gray-300 italic">{status}</p>
        )}
      </form>

      {/* POSTS LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📚 Your Posts</h2>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1f2937] border border-gray-700 p-4 rounded shadow text-white"
          >
            <h3 className="text-lg font-bold text-blue-300 mb-1">
              {post.title || "(Untitled Post)"}
            </h3>

            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <p className="text-sm text-blue-400 mb-1">
                Tags: {post.tags.join(", ")}
              </p>
            )}

            <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap break-words">
              {post.content?.slice(0, 200) || "(No content)"}...
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
