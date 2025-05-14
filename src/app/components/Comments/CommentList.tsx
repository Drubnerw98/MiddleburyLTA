"use client";

import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp?: { seconds: number };
}

interface CommentListProps {
  comments: Comment[];
  isAdmin: boolean;
  onDeleteComment: (commentId: string) => void;
}

export default function CommentList({
  comments,
  isAdmin,
  onDeleteComment,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm italic text-gray-400 mt-4">No comments yet.</p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 max-w-3xl mx-auto">
      {comments.map((comment) => {
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
            <p className="text-sm text-gray-100 whitespace-pre-wrap break-words leading-relaxed mb-3">
              {comment.content}
            </p>

            <div className="text-xs text-gray-400 flex flex-wrap items-center justify-between">
              <span>
                by{" "}
                <span className="text-white font-medium">{comment.author}</span>
                {friendlyTime && (
                  <span className="ml-2 text-gray-500">• {friendlyTime}</span>
                )}
              </span>

              {isAdmin && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-red-400 hover:text-red-300 hover:underline transition ml-2"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
