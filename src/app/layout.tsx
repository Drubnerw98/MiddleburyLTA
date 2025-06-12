import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Layout/NavBar";
import Footer from "./components/Layout/Footer";
import { Toaster } from "react-hot-toast";

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
      {/* 🖼️ Background Image */}
      <div
          className="fixed inset-0 -z-50 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/townhall-middlebury.png')",
            backgroundPosition: "center",
          }}
      />

      {/* 🎬 Vignette for Contrast */}
      <div className="fixed inset-0 -z-40 pointer-events-none bg-gradient-to-b from-transparent via-black/20 to-black/30" />

      {/* ✨ Gold Accent Glow (Subtle) */}
      <div className="fixed inset-0 -z-30 pointer-events-none">
        <div className="absolute top-0 left-0 h-full w-[180px] bg-gradient-to-r from-yellow-500/10 to-transparent blur-2xl" />
        <div className="absolute top-0 right-0 h-full w-[180px] bg-gradient-to-l from-yellow-500/10 to-transparent blur-2xl" />
      </div>

      {/* 🌐 Page Content */}
      <NavBar />
      <main className="px-4 sm:px-6 md:px-8 py-10 border-t border-white/5">
        {children}
      </main>
      <Footer />

      {/* 🔔 Toasts */}
      <Toaster position="bottom-right" />
      </body>
      </html>
  );
}
