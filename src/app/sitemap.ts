import type { MetadataRoute } from "next";

const BASE = "https://middleburytaxpayers.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return [
        { url: `${BASE}/`,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
        { url: `${BASE}/tax-impact`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
        { url: `${BASE}/bond-impact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE}/articles`,    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/who-we-are`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE}/updates`,     lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    ];
}
