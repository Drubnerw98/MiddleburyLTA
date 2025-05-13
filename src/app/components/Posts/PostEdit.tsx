"use client";

import { useState } from "react";
import { editPostAction } from "./PostControls";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

interface PostEditProps {
  postId: string;
  post: Post;
  onSave: (updatedPost: Post) => void;
}

export default function PostEdit({ postId, post, onSave }: PostEditProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    post.imageUrl || null
  );
  const [removeImage, setRemoveImage] = useState(false);
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
    formData.append("tags", tags);
    if (imageFile) formData.append("image", imageFile);
    if (removeImage) formData.append("removeImage", "true");

    const result: {
      success: boolean;
      message?: string;
      imageUrl?: string;
    } = await editPostAction(formData);

    setLoading(false);

    if (result.success) {
      setMessage({ text: "Post updated successfully.", type: "success" });

      onSave({
        ...post,
        title,
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl:
          typeof result.imageUrl === "string"
            ? result.imageUrl
            : removeImage
              ? ""
              : post.imageUrl,
      });
    } else {
      setMessage({
        text: result.message || "Failed to update post.",
        type: "error",
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border p-6 rounded bg-gray-900 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">✏️ Edit Post</h2>

      <label className="block mb-3">
        <span className="text-sm">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mt-1 text-black p-2 rounded"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm">Content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="block w-full mt-1 text-black p-2 rounded"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm">Tags (comma separated)</span>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="block w-full mt-1 text-black p-2 rounded"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Image (optional)</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="block mt-1"
        />
      </label>

      {previewUrl && !removeImage && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Current post"
            className="w-full max-w-xs rounded border mb-2"
          />
          <button
            type="button"
            onClick={() => {
              setRemoveImage(true);
              setImageFile(null);
              setPreviewUrl(null);
            }}
            className="text-sm text-red-400 hover:underline"
          >
            Remove Image
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Update Post"}
      </button>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
