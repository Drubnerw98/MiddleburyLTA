"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CommentFormProps {
  commentText: string;
  SetCommentText: (text: string) => void;
  onSubmit: () => Promise<void>; // updated for async
  isAuthenticated: boolean;
}

export const CommentForm = ({
  commentText,
  SetCommentText,
  onSubmit,
  isAuthenticated,
}: CommentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
      toast.success("Comment posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitting) handleSubmit();
    }
  }

  return (
    <div className="mt-10 bg-[#2c3545]/90 rounded-lg p-6 shadow-md border border-white/10 backdrop-blur-sm">
      <textarea
        id="comment"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => SetCommentText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!isAuthenticated || isSubmitting}
        rows={4}
        className="w-full bg-[#1e2633] text-white p-3 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-40 resize-none"
      />
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Post Comment"}
        </button>
      </div>
      {!isAuthenticated && (
        <p className="text-sm text-gray-400 mt-2">
          You must be logged in to comment.
        </p>
      )}
    </div>
  );
};
