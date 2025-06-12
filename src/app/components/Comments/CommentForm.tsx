"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CommentFormProps {
  commentText: string;
  SetCommentText: (text: string) => void;
  onSubmit: () => Promise<void>;
  isAuthenticated: boolean;
}

export const CommentForm = ({
                              commentText,
                              SetCommentText,
                              onSubmit,
                              isAuthenticated,
                            }: CommentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitting) handleSubmit();
    }
  };

  return (
      <div className="mt-10 bg-[#1e2633]/90 backdrop-blur-sm rounded-lg border border-yellow-400/20 shadow-md p-6 space-y-4 max-w-3xl mx-auto">
      <textarea
          id="comment"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => SetCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isAuthenticated || isSubmitting}
          rows={4}
          className="w-full bg-[#2c3545] text-white placeholder-gray-400 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 resize-none"
      />

        <div className="flex justify-between items-center flex-wrap gap-3">
          <button
              onClick={handleSubmit}
              disabled={
                  !isAuthenticated || !commentText.trim() || isSubmitting
              }
              className="bg-gradient-to-r from-blue-700 to-blue-500 hover:brightness-110 text-white font-medium px-4 py-2 rounded transition disabled:opacity-40"
          >
            {isSubmitting ? "Submitting..." : "Post Comment"}
          </button>

          {!isAuthenticated && (
              <p className="text-sm text-gray-400 italic">
                You must be logged in to comment.
              </p>
          )}
        </div>
      </div>
  );
};
