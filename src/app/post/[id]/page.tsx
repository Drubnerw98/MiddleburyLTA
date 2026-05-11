import { notFound } from "next/navigation";
import { adminDb } from "../../../../lib/firebase-admin";
import PostPageClient, {
  type Comment,
  type PostData,
} from "./PostPageClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id: postId } = await params;

  const postSnap = await adminDb.collection("posts").doc(postId).get();
  if (!postSnap.exists) {
    notFound();
  }

  const postData = postSnap.data() ?? {};
  const post: PostData = {
    id: postSnap.id,
    title: typeof postData.title === "string" ? postData.title : "",
    content: typeof postData.content === "string" ? postData.content : "",
    imageUrl:
      typeof postData.imageUrl === "string" ? postData.imageUrl : undefined,
    tags: Array.isArray(postData.tags) ? (postData.tags as string[]) : [],
    commentsDisabled: postData.commentsDisabled === true,
  };

  const commentsSnap = await adminDb
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .orderBy("timestamp", "asc")
    .get();

  const comments: Comment[] = commentsSnap.docs.map((doc) => {
    const data = doc.data();
    // Convert admin Timestamp to a plain serializable shape for the
    // client. The Comment interface only needs seconds for sorting/display.
    const timestamp =
      data.timestamp && typeof data.timestamp.seconds === "number"
        ? { seconds: data.timestamp.seconds }
        : undefined;
    return {
      id: doc.id,
      uid: typeof data.uid === "string" ? data.uid : "",
      author: typeof data.author === "string" ? data.author : "",
      content: typeof data.content === "string" ? data.content : "",
      timestamp,
      edited: data.edited === true,
      deleted: data.deleted === true,
    };
  });

  return (
    <PostPageClient
      postId={postId}
      initialPost={post}
      initialComments={comments}
    />
  );
}
