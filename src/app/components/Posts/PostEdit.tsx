"use client";

import { useState } from "react";
import { editPostAction } from "./PostControls";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

interface PostEditProps {
  postId: string;
  post: Post;
  onSave: (updatedPost: Post) => void;
}

export default function PostEdit({ postId, post, onSave }: PostEditProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("id", postId);
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result: { success: boolean; message?: string; imageUrl?: string } =
      await editPostAction(formData);
    setLoading(false);

    if (result.success) {
      setMessage({ text: "Post updated successfully.", type: "success" });
      onSave({
        ...post,
        title,
        content,
        imageUrl: result.imageUrl || post.imageUrl,
      });
    } else {
      setMessage({
        text: result.message || "Failed to update post.",
        type: "error",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border p-4 rounded bg-gray-900"
    >
      <h2 className="text-lg font-semibold mb-3">Edit Post</h2>

      <label className="block mb-2">
        <span className="text-sm">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-2 text-black p-2 rounded"
        />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="block w-full mb-2 text-black p-2 rounded"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm">Upload New Image (optional)</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block"
        />
      </label>

      {post.imageUrl && !imageFile && (
        <div className="mb-3">
          <p className="text-sm text-gray-400 mb-1">Current Image:</p>
          <img
            src={post.imageUrl}
            alt="Current post"
            className="w-full max-w-xs rounded border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {loading ? "Updating..." : "Update Post"}
      </button>

      {message && (
        <p
          className={`mt-2 text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
