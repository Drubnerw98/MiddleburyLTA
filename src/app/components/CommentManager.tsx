'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { deleteCommentAsAdminAction } from '@/app/actions/adminCommentAction';

interface Comment {
  id: string;
  text: string;
  author?: string;
  postId: string;
}

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const allComments: Comment[] = [];
        const titleMap: Record<string, string> = {};

        const postsSnapshot = await getDocs(collection(db, 'posts'));

        for (const postDoc of postsSnapshot.docs) {
          const postId = postDoc.id;
          const postTitle = postDoc.data().title || postId;
          titleMap[postId] = postTitle;

          const commentsSnapshot = await getDocs(
            collection(db, 'posts', postId, 'comments'),
          );

          commentsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            allComments.push({
              id: docSnap.id,
              postId,
              text: data.text || data.content || 'No comment',
              author: data.author || 'Anonymous',
            });
          });
        }

        setPostTitles(titleMap);
        setComments(allComments);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDelete = async (postId: string, commentId: string) => {
    const key = `${postId}-${commentId}`;
    setPendingDelete(key);
    try {
      const result = await deleteCommentAsAdminAction(postId, commentId);
      if (!result.success) {
        console.error('Delete failed:', result.message);
        return;
      }
      setComments((prev) =>
        prev.filter((c) => !(c.id === commentId && c.postId === postId)),
      );
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) {
    return (
      <p className="font-sans text-sm text-muted italic">Loading comments…</p>
    );
  }

  if (error) {
    return (
      <p className="font-sans text-sm text-oxblood italic">
        Error loading comments.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="font-serif text-2xl font-semibold text-ink border-b border-rule pb-3">
        Manage comments
      </h2>

      {comments.length === 0 ? (
        <p className="font-sans text-sm text-muted italic mt-6">
          No comments to display.
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {comments.map((comment) => {
            const key = `${comment.postId}-${comment.id}`;
            const isDeleting = pendingDelete === key;
            return (
              <li
                key={key}
                className="bg-bone border border-rule p-5 sm:p-6 space-y-3"
              >
                <p className="font-serif text-base italic text-ink leading-relaxed">
                  &ldquo;{comment.text}&rdquo;
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-xs uppercase tracking-[0.12em] text-muted">
                  <span>
                    <span className="text-oxblood font-semibold">By</span>{' '}
                    <span className="text-ink-soft normal-case tracking-normal">
                      {comment.author}
                    </span>
                  </span>
                  <span>
                    <span className="text-oxblood font-semibold">Post</span>{' '}
                    <span className="text-ink-soft normal-case tracking-normal">
                      {postTitles[comment.postId] || comment.postId}
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(comment.postId, comment.id)}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood border border-oxblood hover:bg-oxblood hover:text-bone transition-colors disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
