'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  createPostAction,
  deletePostAction,
  editPostAction,
} from '@/app/components/Posts/PostControls';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Post {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  commentsDisabled?: boolean;
}

const inputClass =
  'w-full font-sans text-base bg-paper border border-ink/30 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors';

const labelClass =
  'block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-muted mb-1.5';

export default function PostManager() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetched);
    };
    fetchPosts();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setImage(null);
    setPreviewUrl(null);
    setRemoveImage(false);
    setCommentsDisabled(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(editingId ? 'Updating…' : 'Submitting…');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('commentsDisabled', String(commentsDisabled));
    if (image) formData.append('image', image);
    if (editingId) {
      formData.append('id', editingId);
      if (removeImage) formData.append('removeImage', 'true');
    }

    const action = editingId ? editPostAction : createPostAction;

    startTransition(() => {
      action(formData).then((res) => {
        setStatus(res.success ? 'Saved.' : res.message || 'Something went wrong.');
        if (res.success) {
          resetForm();
          getDocs(collection(db, 'posts')).then((snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Post[];
            setPosts(fetched);
          });
        }
      });
    });
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title || '');
    setContent(post.content || '');
    setTags(post.tags?.join(', ') || '');
    setPreviewUrl(post.imageUrl || null);
    setImage(null);
    setRemoveImage(false);
    setCommentsDisabled(post.commentsDisabled || false);
    setEditingId(post.id);
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      deletePostAction(id).then((res) => {
        setStatus(res.success ? 'Deleted.' : res.message || 'Error deleting post.');
        if (res.success) {
          setPosts((prev) => prev.filter((p) => p.id !== id));
        }
      });
    });
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  return (
    <div className="space-y-12">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-bone border border-rule-strong p-6 sm:p-8"
      >
        <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
          {editingId ? 'Edit post' : 'Create new post'}
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
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
            Disable comments for this post
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
                alt="Preview"
                className="w-full max-w-xs border border-rule mb-3"
              />
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setRemoveImage(true);
                    setPreviewUrl(null);
                    setImage(null);
                  }}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                >
                  Remove current image
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors disabled:opacity-60"
          >
            {editingId ? 'Update post' : 'Submit post'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
            >
              Cancel edit
            </button>
          )}
          {status && (
            <p className="font-sans text-sm text-muted">{status}</p>
          )}
        </div>
      </form>

      {/* Post List */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-ink border-b border-rule pb-3">
          Your posts
        </h2>

        {posts.length === 0 ? (
          <p className="font-sans text-sm text-muted italic mt-6">
            No posts yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-6">
            {posts.map((post) => (
              <li
                key={post.id}
                className="bg-bone border border-rule p-5 sm:p-6 space-y-3"
              >
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {post.title || '(Untitled Post)'}
                </h3>
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <p className="font-sans text-xs uppercase tracking-[0.12em] text-oxblood">
                    {post.tags.map((t) => `#${t}`).join('  ')}
                  </p>
                )}
                <p className="font-sans text-sm text-ink-soft leading-relaxed">
                  {post.content?.slice(0, 200)}…
                </p>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleEdit(post)}
                    className="inline-flex items-center justify-center px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink border border-ink hover:bg-ink hover:text-bone transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center justify-center px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood border border-oxblood hover:bg-oxblood hover:text-bone transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
