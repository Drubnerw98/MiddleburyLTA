// src/app/components/Comments/CommentForm.tsx
"use client";

import { useState } from "react";

interface CommentFormProps {
  commentText: string;
  SetCommentText: (text: string) => void;
  onSubmit: () => void;
  isAuthenticated: boolean;
}

export function CommentForm({
  commentText,
  SetCommentText,
  onSubmit,
  isAuthenticated,
}: CommentFormProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <label htmlFor="comment" className="block text-sm font-medium mb-2">
        Comments
      </label>

      <textarea
        id="comment"
        value={commentText}
        onChange={(e) => SetCommentText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Write a comment..."
        rows={4}
        className={`w-full p-3 rounded bg-[#2c3545] text-white border transition-all ${
          focused ? "border-blue-500 ring-1 ring-blue-300" : "border-gray-700"
        } resize-none break-words`}
      />

      <button
        onClick={onSubmit}
        disabled={!isAuthenticated}
        className={`mt-2 px-4 py-2 rounded text-sm font-semibold transition 
          ${
            isAuthenticated
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-600 cursor-not-allowed text-gray-300"
          }`}
      >
        Post Comment
      </button>
    </div>
  );
}
