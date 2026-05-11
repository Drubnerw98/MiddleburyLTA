import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { LinkItem } from "@/types/link";
import AnimatedArticles from "./AnimatedArticles";

export const dynamic = "force-dynamic";

// Reverted to the client Firestore SDK for now. The admin-SDK
// version (using adminDb in an RSC) was failing on prod with
// "16 UNAUTHENTICATED" — service-account credential issue we're
// investigating separately. Client SDK uses the public web
// credentials and works fine for the public read on external_links.
//
// The followups doc has the longer story; flipping this back to
// adminDb is a one-line change once auth is resolved.

export default async function ArticlesPage() {
    const snapshot = await getDocs(
        query(
            collection(db, "external_links"),
            orderBy("priority", "asc"),
            orderBy("createdAt", "desc"),
        ),
    );

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
