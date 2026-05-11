"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface Comment {
    id: string;
    uid: string;
    author: string;
    content: string;
    edited?: boolean;
    deleted?: boolean;
    timestamp?: { seconds: number };
}

interface CommentListProps {
    comments: Comment[];
    currentUserId: string;
    isAdmin: boolean;
    onDeleteCommentAction: (commentId: string) => Promise<void>;
    onEditCommentAction: (commentId: string, newContent: string) => Promise<void>;
}

export default function CommentList({
    comments,
    currentUserId,
    isAdmin,
    onDeleteCommentAction,
    onEditCommentAction,
}: CommentListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const handleDelete = async (id: string) => {
        try {
            await onDeleteCommentAction(id);
            toast.success("Comment deleted.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete comment.");
        }
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editText.trim()) return;
        try {
            await onEditCommentAction(editingId, editText.trim());
            toast.success("Comment updated.");
            setEditingId(null);
            setEditText("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update comment.");
        }
    };

    const formatTime = (seconds?: number) => {
        if (!seconds) return "Just now";
        const date = new Date(seconds * 1000);
        return date.toLocaleDateString();
    };

    if (comments.length === 0) return null;

    return (
        <ul className="mt-8 space-y-6">
            {comments.map((comment) => {
                const isOwner = comment.uid === currentUserId;
                const canEdit = isOwner || isAdmin;

                return (
                    <li
                        key={comment.id}
                        className="border-t border-rule pt-5 space-y-2"
                    >
                        <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
                            <span className="font-sans text-sm font-semibold text-ink">
                                {comment.author}
                            </span>
                            <span className="font-sans text-xs uppercase tracking-[0.12em] text-muted">
                                {formatTime(comment.timestamp?.seconds)}
                            </span>
                        </div>

                        {comment.deleted ? (
                            <p className="font-sans text-sm italic text-muted">
                                [deleted]
                            </p>
                        ) : editingId === comment.id ? (
                            <>
                                <textarea
                                    className="w-full font-sans text-base bg-bone border border-ink/30 p-3 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors resize-none"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:text-oxblood underline underline-offset-4 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditText("");
                                        }}
                                        className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="font-sans text-base text-ink-soft leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                                {comment.edited && (
                                    <span className="ml-2 font-sans text-xs italic text-muted">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}

                        {canEdit && editingId !== comment.id && !comment.deleted && (
                            <div className="flex gap-5 pt-1">
                                <button
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditText(comment.content);
                                    }}
                                    className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
