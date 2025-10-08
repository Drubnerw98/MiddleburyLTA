// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
// Optional: Vercel Speed Insights (nice to have performance data)
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
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
        <html lang="en" className={inter.variable}>
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
