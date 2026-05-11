"use client";

import { useState } from "react";
import { editPostAction } from "./PostControls";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  commentsDisabled?: boolean;
}

interface PostEditProps {
  postId: string;
  post: Post;
  onSaveAction: (updatedPost: Post) => void;
}

const inputClass =
  "w-full font-sans text-base bg-paper border border-ink/30 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors";

const labelClass =
  "block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-muted mb-1.5";

export default function PostEdit({ postId, post, onSaveAction }: PostEditProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  const [commentsDisabled, setCommentsDisabled] = useState(
    post.commentsDisabled || false,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    post.imageUrl || null,
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("id", postId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("commentsDisabled", String(commentsDisabled));
    if (imageFile) formData.append("image", imageFile);
    if (removeImage) formData.append("removeImage", "true");

    const result = await editPostAction(formData);
    setLoading(false);

    if (result.success) {
      setMessage({ text: "Post updated successfully.", type: "success" });

      onSaveAction({
        ...post,
        title,
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl:
          "imageUrl" in result && typeof result.imageUrl === "string"
            ? result.imageUrl
            : removeImage
              ? ""
              : post.imageUrl,
        commentsDisabled,
      });
    } else {
      setMessage({
        text: result.message || "Failed to update post.",
        type: "error",
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-bone border border-rule-strong p-6 sm:p-8 space-y-5"
    >
      <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
        Edit post
      </h2>

      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass}>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
        />
      </div>

      <label className="inline-flex items-center gap-2.5 font-sans text-sm text-ink-soft cursor-pointer select-none">
        <input
          type="checkbox"
          checked={commentsDisabled}
          onChange={(e) => setCommentsDisabled(e.target.checked)}
          className="h-4 w-4 accent-ink"
        />
        Disable comments
      </label>

      <div>
        <label className={labelClass}>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="block w-full font-sans text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:border file:border-ink file:bg-bone file:text-ink file:font-sans file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] hover:file:bg-ink hover:file:text-bone file:transition-colors"
        />
      </div>

      {previewUrl && !removeImage && (
        <div>
          <p className="font-sans text-xs text-muted mb-2 uppercase tracking-[0.14em]">
            Preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Current post"
            className="w-full max-w-xs border border-rule mb-3"
          />
          <button
            type="button"
            onClick={() => {
              setRemoveImage(true);
              setImageFile(null);
              setPreviewUrl(null);
            }}
            className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
          >
            Remove image
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update post"}
        </button>

        {message && (
          <p
            className={`font-sans text-sm ${
              message.type === "success" ? "text-moss" : "text-oxblood"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
