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
            className="bg-[#2c3545] border border-gray-700 p-4 rounded shadow text-white overflow-x-auto"
          >
            <p className="text-sm text-gray-100 whitespace-pre-wrap break-words leading-relaxed mb-2">
              {comment.content}
            </p>

            <p className="text-xs text-gray-400">
              by {comment.author}
              {friendlyTime && (
                <span className="ml-2 text-gray-500">• {friendlyTime}</span>
              )}
              {isAdmin && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="ml-4 text-red-400 hover:underline"
                >
                  Delete
                </button>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
