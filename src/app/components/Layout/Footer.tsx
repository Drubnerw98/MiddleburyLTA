import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-paper border-t border-rule-strong">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div>
                        <p className="font-serif text-base sm:text-lg font-semibold text-ink">
                            Middlebury Taxpayers
                        </p>
                        <p className="font-sans text-xs text-muted mt-1">
                            © {new Date().getFullYear()}. All rights reserved.
                        </p>
                        <p className="font-sans text-xs text-muted mt-2">
                            Built by{" "}
                            <a
                                href="https://github.com/Drubnerw98"
                                className="underline hover:text-oxblood transition-colors"
                            >
                                Will Drubner
                            </a>{" "}
                            ·{" "}
                            <a
                                href="https://github.com/Drubnerw98/MiddleburyLTA"
                                className="underline hover:text-oxblood transition-colors"
                            >
                                Source
                            </a>
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
                        <Link href="/tax-impact" className="text-ink-soft hover:text-oxblood transition-colors">
                            Tax Impact
                        </Link>
                        <Link href="/articles" className="text-ink-soft hover:text-oxblood transition-colors">
                            Articles
                        </Link>
                        <Link href="/who-we-are" className="text-ink-soft hover:text-oxblood transition-colors">
                            Who We Are
                        </Link>
                        <Link href="/updates" className="text-ink-soft hover:text-oxblood transition-colors">
                            Updates
                        </Link>
                        <a href="mailto:mta.admn@gmail.com" className="text-ink-soft hover:text-oxblood transition-colors">
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
