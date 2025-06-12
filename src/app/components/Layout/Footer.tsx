import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-white/10 bg-[#1a1f2b]/80 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-16">
            <div className="flex flex-col items-center py-8 px-4 space-y-4 text-sm text-gray-400">
                <Image
                    src="/logo.png"
                    alt="Middlebury Taxpayers Logo"
                    width={64}
                    height={64}
                    className="rounded-sm opacity-80"
                />

                <p className="text-xs tracking-wide text-center">
                    © {new Date().getFullYear()} Middlebury Taxpayers. All rights reserved.
                </p>

                <div className="flex gap-4 text-xs">
                    <a href="/about" className="hover:text-blue-400 transition">
                        About
                    </a>
                    <a href="/tax-impact" className="hover:text-blue-400 transition">
                        Tax Impact
                    </a>
                    <a
                        href="mailto:press@middleburytaxpayers.org"
                        className="hover:text-blue-400 transition"
                    >
                        Contact
                    </a>
                </div>
            </div>

            {/* Vignette */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[-1]" />
        </footer>
    );
}
