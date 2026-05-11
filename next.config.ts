import type { NextConfig } from "next";

// Security headers applied to every response. CSP is conservative —
// allow inline scripts/styles (Next.js hydration), our own assets,
// and the explicit external services we depend on (Firebase, Resend,
// Vercel Analytics, Upstash, Google Fonts). Tighten incrementally.
const securityHeaders = [
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://storage.googleapis.com https://*.googleusercontent.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://*.upstash.io https://vitals.vercel-insights.com https://vercel.live wss://ws-us3.pusher.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ].join("; "),
    },
    {
        key: "X-Frame-Options",
        value: "DENY",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
