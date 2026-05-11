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
    // TEMP DIAGNOSTIC: production query returns 0 docs despite Firestore
    // having 13 docs in external_links with createdAt set. Logging both
    // ordered and unordered counts plus a sample to disambiguate
    // (missing index? wrong project at runtime? rules read-deny?).
    let orderedCount = -1;
    let unorderedCount = -1;
    let firstDocSample: Record<string, unknown> | null = null;
    let queryError: string | null = null;

    try {
        const unordered = await getDocs(collection(db, "external_links"));
        unorderedCount = unordered.size;
        if (unordered.docs[0]) {
            const d = unordered.docs[0].data();
            firstDocSample = {
                id: unordered.docs[0].id,
                hasCreatedAt: !!d.createdAt,
                createdAtType: typeof d.createdAt,
                createdAtSeconds: d.createdAt?.seconds ?? null,
                keys: Object.keys(d),
            };
        }
    } catch (e) {
        queryError = `unordered: ${e instanceof Error ? e.message : String(e)}`;
    }

    let links: LinkItem[] = [];
    try {
        const snapshot = await getDocs(
            query(
                collection(db, "external_links"),
                orderBy("createdAt", "desc"),
            ),
        );
        orderedCount = snapshot.size;
        links = snapshot.docs.map((doc) => {
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
    } catch (e) {
        queryError = `${queryError ?? ""} | ordered: ${e instanceof Error ? e.message : String(e)}`;
    }

    console.log("[articles-diag]", JSON.stringify({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
        unorderedCount,
        orderedCount,
        firstDocSample,
        queryError,
    }));

    return <AnimatedArticles links={links} />;
}
