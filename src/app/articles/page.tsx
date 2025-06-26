import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { LinkItem } from "@/types/link";
import AnimatedArticles from "./AnimatedArticles";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    const snapshot = await getDocs(
        query(
            collection(db, "external_links"),
            orderBy("priority", "asc"),
            orderBy("createdAt", "desc")
        )
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
