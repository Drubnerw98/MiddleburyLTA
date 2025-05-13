"use client";

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
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-[#2c3545] border border-gray-700 p-4 rounded shadow text-white break-words overflow-x-auto"
        >
          <p className="text-sm text-gray-100">{comment.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            by {comment.author}
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
      ))}
    </div>
  );
}
