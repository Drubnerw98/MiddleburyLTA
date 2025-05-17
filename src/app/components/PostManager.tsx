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
  commentsDisabled?: boolean;
}

export default function AdminPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(editingId ? "Updating..." : "Submitting...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("commentsDisabled", String(commentsDisabled));
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
          // Refetch posts after submit
          getDocs(collection(db, "posts")).then((snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Post[];
            setPosts(fetched);
          });
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
    setCommentsDisabled(post.commentsDisabled || false);
    setEditingId(post.id);
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      deletePostAction(id).then((res) => {
        setStatus(
          res.success ? "🗑️ Deleted!" : res.message || "Error deleting post."
        );
        if (res.success) {
          setPosts((prev) => prev.filter((p) => p.id !== id));
        }
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
    setCommentsDisabled(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-12 px-4 py-10 max-w-4xl mx-auto text-white">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-[#2c3545]/90 border border-white/10 backdrop-blur rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold border-b border-white/10 pb-2 text-blue-300">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded bg-[#1e2633] text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="w-full p-2 rounded bg-[#1e2633] text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 rounded bg-[#1e2633] text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="inline-flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={commentsDisabled}
                onChange={(e) => setCommentsDisabled(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              Disable comments for this post
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-300"
            />
          </div>

          {previewUrl && !removeImage && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-w-xs rounded border border-gray-600 mb-2"
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
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Post" : "Submit Post"}
        </button>

        {status && (
          <p className="text-sm mt-2 text-gray-300 italic">{status}</p>
        )}
      </form>

      {/* POSTS LIST */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-blue-400 border-b border-white/10 pb-2">
          Your Posts
        </h2>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#2c3545] border border-white/10 p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-blue-300 mb-1">
              {post.title || "(Untitled Post)"}
            </h3>
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <p className="text-sm text-blue-400 mb-1">
                Tags: {post.tags.join(", ")}
              </p>
            )}
            <p className="text-sm text-gray-300 mb-3">
              {post.content?.slice(0, 200)}...
            </p>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500"
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
