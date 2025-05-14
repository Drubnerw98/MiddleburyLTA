// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLTA Tax Impact Center",
  description:
    "A community-driven space for sharing facts, updates, and discussion.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen relative bg-[#1e2633]`}
      >
        {/* Side Glow Gradients */}
        <div className="fixed inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 left-0 h-full w-[180px] bg-gradient-to-r from-blue-500/20 to-transparent blur-2xl" />
          <div className="absolute top-0 right-0 h-full w-[180px] bg-gradient-to-l from-blue-500/20 to-transparent blur-2xl" />
        </div>

        {/* Noise Overlay (Refined) */}
        <div
          className="fixed inset-0 -z-30 pointer-events-none bg-[url('/noise.png')] bg-repeat bg-[length:200px_200px]"
          style={{ opacity: 0.01 }} // You can adjust between 0.01 - 0.05 for subtlety
        />

        {/* Subtle Vignette */}
        <div className="fixed inset-0 -z-40 pointer-events-none bg-gradient-to-b from-transparent via-black/5 to-black/10" />

        <NavBar />
        <main className="px-4 sm:px-6 md:px-8 py-10 border-t border-white/5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
