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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const visibleComments = comments.filter(
      (c) => !c.deleted || isAdmin
  );

  if (visibleComments.length === 0) {
    return (
        <p className="text-sm italic text-gray-400 mt-4">No comments yet.</p>
    );
  }

  return (
      <div className="space-y-4 mt-6">
        {visibleComments.map((comment) => {
          const isOwner = comment.uid === currentUserId;
          const isEditing = editingId === comment.id;
          const timestamp = comment.timestamp?.seconds
              ? new Date(comment.timestamp.seconds * 1000)
              : null;
          const displayTime = timestamp
              ? formatDistanceToNow(timestamp, { addSuffix: true })
              : null;

          return (
              <div
                  key={comment.id}
                  className="bg-[#1e2633]/90 border border-yellow-400/20 rounded-lg shadow-md p-4 backdrop-blur-sm transition"
              >
                {isEditing ? (
                    <>
                <textarea
                    className="w-full p-2 rounded bg-[#2c3545] border border-gray-600 text-white mb-2"
                    value={editContent}
                    rows={3}
                    onChange={(e) => setEditContent(e.target.value)}
                />
                      <div className="flex gap-3 text-sm">
                        <button
                            onClick={() => {
                              setEditingId(null);
                              setEditContent("");
                            }}
                            className="text-gray-400 hover:text-gray-300 underline"
                        >
                          Cancel
                        </button>
                        <button
                            onClick={() => {
                              onEditComment(comment.id, editContent.trim());
                              setEditingId(null);
                              setEditContent("");
                            }}
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Save
                        </button>
                      </div>
                    </>
                ) : (
                    <>
                      <p
                          className={`text-sm leading-relaxed break-words whitespace-pre-wrap mb-3 ${
                              comment.deleted
                                  ? "text-gray-500 italic"
                                  : "text-gray-100"
                          }`}
                      >
                        {comment.deleted
                            ? isAdmin
                                ? `[Deleted] ${comment.content}`
                                : "[Deleted comment]"
                            : comment.content}
                      </p>

                      <div className="text-xs text-gray-400 flex flex-wrap justify-between items-center">
                        <div>
                          by{" "}
                          <span className="text-white font-medium">
                      {comment.author}
                    </span>
                          {displayTime && (
                              <span className="ml-2 text-gray-500">• {displayTime}</span>
                          )}
                          {comment.edited && (
                              <span className="ml-1 italic text-gray-400">(edited)</span>
                          )}
                        </div>

                        {!comment.deleted && (
                            <div className="flex gap-3">
                              {isOwner && (
                                  <button
                                      onClick={() => {
                                        setEditingId(comment.id);
                                        setEditContent(comment.content);
                                      }}
                                      className="text-yellow-300 hover:text-yellow-200 text-xs underline"
                                  >
                                    Edit
                                  </button>
                              )}
                              {(isAdmin || isOwner) && (
                                  <button
                                      onClick={() => onDeleteComment(comment.id)}
                                      className="text-red-400 hover:text-red-300 text-xs underline"
                                  >
                                    Delete
                                  </button>
                              )}
                            </div>
                        )}
                      </div>
                    </>
                )}
              </div>
          );
        })}
      </div>
  );
}
