"use client";

interface Comment {
  id: string;
  author: string;
  content: string;
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
  return (
    <div style={{ marginTop: "1rem" }}>
      {comments.map((comment) => (
        <div style={{ marginTop: "1rem" }}>
          <p>{comment.content}</p>
          <small>by {comment.author}</small>
          {isAdmin && (
            <button
              onClick={() => onDeleteComment(comment.id)}
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#b91c1c",
                color: "white",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
