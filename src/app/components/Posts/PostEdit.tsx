"use client";

import { useState } from "react";
import { editPostAction } from "./PostControls";

export default function PostEdit({ postId, post, onSave }: any) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", postId);
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await editPostAction(formData);
    if (result.success) {
      onSave({ ...post, title, content }); // You can include imageUrl here if needed
    } else {
      alert("Failed to update post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Post</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full mb-2 text-black p-1"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="block w-full mb-2 text-black p-1"
        rows={6}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Post
      </button>
    </form>
  );
}
