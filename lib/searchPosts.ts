import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

export async function performSearch(searchTerm: string, tags: string[] = []) {
  let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  if (tags.length > 0) {
    // If you want to support one tag at a time for now:
    q = query(q, where("tags", "array-contains-any", tags));
  }

  const snapshot = await getDocs(q);

  const results = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter(
      (post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return results;
}
