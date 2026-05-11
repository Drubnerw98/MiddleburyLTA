// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Source_Serif_4 } from "next/font/google";
import NavBar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
// Optional: Vercel Speed Insights (nice to have performance data)
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

// Source Serif 4 (variable). Display face for the editorial-civic system.
// Used for hero headlines, lead paragraphs, and pullquotes.
const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-source-serif",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Middlebury Taxpayers",
    description: "A community-driven space for facts, updates, and civic discussion.",
    icons: {
        icon: "/favicon-v2.ico",
        shortcut: "/favicon-v2.ico",
        apple: "/favicon-v2.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
        <head>
            <link rel="icon" href="/favicon-v2.ico" sizes="any" />
            <link rel="apple-touch-icon" href="/favicon-v2.ico" />
            <meta name="theme-color" content="#ffffff" />
            <title>Middlebury Tax Payers</title>
        </head>
        <body className="font-sans text-[#2E3D52] bg-white min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
        <Analytics />
        {/* <SpeedInsights /> */}
        </body>
        </html>
    );
}
