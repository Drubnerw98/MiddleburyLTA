import InverseLogo from "@/app/components/Logo/inverselogo";

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-[#1a1f2b] shadow-inner">
            <div className="flex flex-col items-center py-6 px-4 space-y-2 text-sm text-gray-300">
                <InverseLogo className="w-12 h-12 opacity-90" />
                <p className="text-xs tracking-wide text-center text-gray-400">
                    © {new Date().getFullYear()} Middlebury Taxpayers. All rights reserved.
                </p>

                <div className="flex gap-4 text-xs">
                    <a href="/tax-impact" className="hover:text-sky-400 transition">
                        Tax Impact
                    </a>
                    <a href="/articles" className="hover:text-sky-400 transition">
                        Articles & Links
                    </a>
                    <a href="mailto:press@middleburytaxpayers.org" className="hover:text-sky-400 transition">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}
