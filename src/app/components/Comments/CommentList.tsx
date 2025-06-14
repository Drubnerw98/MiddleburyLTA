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

    return (
        <div className="mt-6 space-y-4">
            {comments.map((comment) => {
                const isOwner = comment.uid === currentUserId;
                const canEdit = isOwner || isAdmin;

                return (
                    <div
                        key={comment.id}
                        className="bg-[#1e2633] p-4 rounded-md border border-white/10 space-y-1 text-sm"
                    >
                        <div className="flex justify-between items-center text-gray-300">
                            <span className="font-medium text-white">{comment.author}</span>
                            <span className="text-xs italic">{formatTime(comment.timestamp?.seconds)}</span>
                        </div>

                        {comment.deleted ? (
                            <p className="italic text-gray-500">[deleted]</p>
                        ) : editingId === comment.id ? (
                            <>
                <textarea
                    className="w-full mt-2 bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                />
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditText("");
                                        }}
                                        className="text-sm text-gray-400 hover:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-200 whitespace-pre-wrap">
                                {comment.content}
                                {comment.edited && (
                                    <span className="ml-2 italic text-xs text-gray-400">(edited)</span>
                                )}
                            </p>
                        )}

                        {canEdit && editingId !== comment.id && !comment.deleted && (
                            <div className="flex gap-4 text-xs mt-2 text-gray-400">
                                <button
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditText(comment.content);
                                    }}
                                    className="hover:text-blue-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="hover:text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
