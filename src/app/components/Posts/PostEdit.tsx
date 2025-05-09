// src/app/components/Posts/PostEdit.tsx
"use client";

import { useState } from "react";

interface PostEditProps {
  postId: string;
  post: {
    title: string;
    content: string;
  };
  onSave: (updatedPost: { title: string; content: string }) => void;
}

export default function PostEdit({ postId, post, onSave }: PostEditProps) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  return (
    <div style={{ padding: "1rem" }}>
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Post Title"
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        rows={6}
        placeholder="Post Content"
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button
        onClick={() => onSave({ title: editTitle, content: editContent })}
        style={{ marginRight: "0.5rem" }}
      >
        Save Changes
      </button>
    </div>
  );
}
