"use client";

import { useState } from "react";

interface PostEditProps {
  title: string;
  content: string;
  onSave: (newTitle: string, newContent: string) => void;
  onCancel: () => void;
}

export default function PostEdit({
  title,
  content,
  onSave,
  onCancel,
}: PostEditProps) {
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
}
