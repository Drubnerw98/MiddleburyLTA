"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CommentFormProps {
    commentText: string;
    setCommentTextAction: (text: string) => void;
    onSubmitAction: () => Promise<void>;
    isAuthenticated: boolean;
}

export const CommentForm = ({
    commentText,
    setCommentTextAction,
    onSubmitAction,
    isAuthenticated,
}: CommentFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmitAction();
            toast.success("Comment posted.");
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
        <div className="mt-10 border-t border-rule pt-8">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-oxblood mb-3">
                Leave a comment
            </p>
            <textarea
                id="comment"
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentTextAction(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isAuthenticated || isSubmitting}
                rows={4}
                className="w-full font-sans text-base bg-bone border border-ink/30 p-3 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors disabled:opacity-50 resize-none"
            />
            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
                    className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting…" : "Post comment"}
                </button>
                {!isAuthenticated && (
                    <p className="font-sans text-sm text-muted">
                        Log in to comment.
                    </p>
                )}
            </div>
        </div>
    );
};
