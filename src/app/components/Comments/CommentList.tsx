"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  uid: string;
  edited?: boolean;
  deleted?: boolean;
  timestamp?: { seconds: number };
}

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  isAdmin: boolean;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, newContent: string) => void;
}

export default function CommentList({
  comments,
  currentUserId,
  isAdmin,
  onDeleteComment,
  onEditComment,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const visibleComments = comments.filter(
    (comment) => !comment.deleted || isAdmin
  );

  if (visibleComments.length === 0) {
    return (
      <p className="text-sm italic text-gray-400 mt-4">No comments yet.</p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 max-w-3xl mx-auto">
      {visibleComments.map((comment) => {
        const isDeleted = comment.deleted;
        const isOwner = comment.uid === currentUserId;
        const isEditing = editingCommentId === comment.id;

        const friendlyTime = comment.timestamp?.seconds
          ? formatDistanceToNow(new Date(comment.timestamp.seconds * 1000), {
              addSuffix: true,
            })
          : null;

        return (
          <div
            key={comment.id}
            className="bg-[#2c3545]/90 border border-white/10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] backdrop-blur p-4 rounded-lg transition-all duration-200"
          >
            {isEditing ? (
              <div>
                <textarea
                  className="w-full bg-[#1e2633] text-white p-2 rounded border border-gray-600 mb-2"
                  value={editContent}
                  rows={3}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="text-sm text-gray-300 underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onEditComment(comment.id, editContent.trim());
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="text-sm text-blue-400 underline"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={`text-sm whitespace-pre-wrap break-words leading-relaxed mb-3 ${
                    isDeleted ? "text-gray-500 italic" : "text-gray-100"
                  }`}
                >
                  {isDeleted
                    ? isAdmin
                      ? `[Deleted comment] ${comment.content}`
                      : "[Deleted comment]"
                    : comment.content}
                </p>

                <div className="text-xs text-gray-400 flex flex-wrap items-center justify-between">
                  <span>
                    by{" "}
                    <span className="text-white font-medium">
                      {comment.author}
                    </span>
                    {friendlyTime && (
                      <span className="ml-2 text-gray-500">
                        • {friendlyTime}
                      </span>
                    )}
                    {comment.edited && (
                      <span className="ml-1 italic text-gray-400">
                        (edited)
                      </span>
                    )}
                  </span>

                  <div className="flex gap-2">
                    {isOwner && !isDeleted && (
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="text-blue-400 hover:text-blue-300 hover:underline text-xs"
                      >
                        Edit
                      </button>
                    )}

                    {(isAdmin || isOwner) && !isDeleted && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-red-400 hover:text-red-300 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    )}

                    {isAdmin && isDeleted && (
                      <span className="text-gray-500 text-xs italic ml-2">
                        Deleted
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
