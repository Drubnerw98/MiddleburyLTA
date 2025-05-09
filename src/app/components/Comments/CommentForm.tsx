"use client";

interface CommentFormProps {
  commentText: string;
  SetCommentText: (text: string) => void;
  onSubmit: () => void;
  isAuthenticated: boolean;
}

export function CommentForm({
  commentText,
  SetCommentText,
  onSubmit,
  isAuthenticated,
}: CommentFormProps) {
  if (!isAuthenticated) return <p>Please sign in to comment.</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <textarea
        value={commentText}
        onChange={(e) => SetCommentText(e.target.value)}
        rows={3}
        placeholder="Write a comment..."
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={onSubmit}>Post Comment</button>
    </div>
  );
}
