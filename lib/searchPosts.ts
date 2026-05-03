import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface PostDoc {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  [k: string]: unknown;
}

export async function performSearch(searchTerm: string, tags: string[] = []): Promise<PostDoc[]> {
  let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  if (tags.length > 0) {
    q = query(q, where("tags", "array-contains-any", tags));
  }

  const snapshot = await getDocs(q);
  const term = searchTerm.toLowerCase();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as PostDoc)
    .filter(
      (post) =>
        post.title?.toLowerCase().includes(term) ||
        post.content?.toLowerCase().includes(term)
    );
}
