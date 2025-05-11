"use client";

import { useState, useTransition, useEffect } from "react";
import {
  createPostAction,
  deletePostAction,
  editPostAction,
} from "@/app/components/Posts/PostControls";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Post {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
}

export default function AdminPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchPosts() {
      const snapshot = await getDocs(collection(db, "posts"));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetched);
    }
    fetchPosts();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("content", content);

    setStatus(editingId ? "Updating..." : "Submitting...");

    startTransition(() => {
      const action = () => {
        const formData = new FormData();
        if (image) formData.append("image", image);
        formData.append("title", title);
        formData.append("content", content);

        if (editingId) {
          formData.append("id", editingId);
          return editPostAction(formData);
        } else {
          return createPostAction(formData);
        }
      };

      action().then((res) => {
        setStatus(
          res.success ? "Success!" : res?.message || "Something went wrong."
        );
        if (res.success) {
          setTitle("");
          setContent("");
          setImage(null);
          setEditingId(null);
        }
      });
    });
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title || "");
    setContent(post.content || "");
    setEditingId(post.id);
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      deletePostAction(id).then((res) => {
        setStatus(
          res.success ? "Deleted!" : res?.message || "Error deleting post."
        );
      });
    });
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          rows={5}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingId ? "Update Post" : "Submit Post"}
        </button>
        <p className="text-sm text-gray-600">{status}</p>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h3 className="font-bold">{post.title || "(Untitled Post)"}</h3>
            <p className="text-sm text-gray-700 mb-2">
              {post.content?.slice(0, 100) || "(No content)"}...
            </p>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
