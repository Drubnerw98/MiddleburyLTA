import { adminDb } from "../../../lib/firebase-admin";
import { LinkItem } from "@/types/link";
import AnimatedArticles from "./AnimatedArticles";

export const dynamic = "force-dynamic";

// Admin SDK on the server side. The Firebase Web SDK can't reliably
// reach Firestore from Vercel's serverless runtime — it tries to open
// a GRPC Listen stream, fails, drops into offline mode, and silently
// returns an empty snapshot. The admin SDK uses HTTP/REST under the
// hood and works fine in short-lived functions.

export default async function ArticlesPage() {
    const snapshot = await adminDb
        .collection("external_links")
        .orderBy("createdAt", "desc")
        .get();

    const links: LinkItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            url: data.url,
            description: data.description ?? "",
            source: data.source ?? "",
            datePublished: data.datePublished ?? "",
            createdAt: data.createdAt?.seconds ?? undefined,
        };
    });

    return <AnimatedArticles links={links} />;
}
