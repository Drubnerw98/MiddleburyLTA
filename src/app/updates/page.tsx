import { Suspense } from "react";
import HomePageClient from "../HomePageClient"; // or wherever you're using useSearchParams()

export default function UpdatesPage() {
    return (
        <Suspense fallback={<div className="text-gray-400 text-center mt-8">Loading updates...</div>}>
            <HomePageClient />
        </Suspense>
    );
}
