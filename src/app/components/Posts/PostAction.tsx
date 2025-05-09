"use client";

interface PostActionProps {
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

export default function PostActions({
  onEdit,
  onDelete,
  isEditing,
}: PostActionProps) {
  if (isEditing) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={onEdit} style={{ marginRight: "0.5rem" }}>
        Edit Post
      </button>
      <button
        onClick={onDelete}
        style={{
          backgroundColor: "#8b0000",
          color: "white",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        Delete Post
      </button>
    </div>
  );
}
