import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-gray-400 text-center mt-8">Loading...</div>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
