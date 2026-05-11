import InverseLogo from "@/app/components/Logo/inverselogo";

export default function Footer() {
    return (
        <footer className="w-full bg-ink text-paper/80 border-t border-rule-strong/20">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <InverseLogo className="w-9 h-9 opacity-90" />
                        <div>
                            <p className="font-serif text-base text-paper">Middlebury Taxpayers</p>
                            <p className="font-sans text-xs text-paper/60 mt-0.5">
                                © {new Date().getFullYear()}. All rights reserved.
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
                        <a href="/tax-impact" className="text-paper/80 hover:text-paper transition-colors">
                            Tax Impact
                        </a>
                        <a href="/articles" className="text-paper/80 hover:text-paper transition-colors">
                            Articles
                        </a>
                        <a href="/who-we-are" className="text-paper/80 hover:text-paper transition-colors">
                            Who We Are
                        </a>
                        <a href="mailto:mta.admn@gmail.com" className="text-paper/80 hover:text-paper transition-colors">
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
