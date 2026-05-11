'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from '@/app/components/About/ContactModal';

const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
};

// Reusable styles
const pdfBtnClass =
    'inline-flex w-max items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-2.5 py-1 text-xs font-medium text-white no-underline hover:bg-white/20 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition backdrop-blur-sm';

const sectionHeadingClass =
    'flex items-center gap-2.5 text-base sm:text-lg font-semibold uppercase tracking-wider text-yellow-300 mb-3';

const accentBar = (
    <span aria-hidden className="inline-block h-4 w-1 rounded-full bg-yellow-300" />
);

const bulletClass =
    'list-disc space-y-2 pl-5 text-sm sm:text-base leading-relaxed marker:text-yellow-300/70';

// Inline highlight for key figures so the eye lands on the punch.
function Stat({ children }: { children: React.ReactNode }) {
    return (
        <span className="font-semibold text-yellow-200 whitespace-nowrap">{children}</span>
    );
}

export default function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <main className="flex items-center justify-center px-2 sm:px-4 pt-0 pb-2 sm:pb-4">
                <div className="relative w-full min-h-[calc(100vh-80px)] rounded-lg overflow-hidden">
                    {/* Background image */}
                    <Image
                        src="/images/townhall-middlebury.jpg"
                        alt="Middlebury Town Hall"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Layered overlay: dark gradient + radial vignette for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/35" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />

                    {/* Content wrapper:
              - Mobile: top-aligned & scrollable to prevent cropping (with extra bottom padding)
              - ≥sm: vertically centered like before */}
                    <div className="absolute inset-0 z-10 flex justify-center px-4 sm:px-8 overflow-y-auto items-start sm:items-center py-8 sm:py-0 pb-12">
                        <motion.div
                            className="w-full max-w-5xl text-white"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <div className="mx-auto w-full">
                                {/* Eyebrow */}
                                <motion.p
                                    className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300/90 mb-3 text-center sm:text-left"
                                    variants={itemVariants}
                                >
                                    Middlebury Taxpayers
                                </motion.p>

                                {/* Headline + intro */}
                                <motion.h1
                                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 text-center sm:text-left"
                                    variants={itemVariants}
                                >
                                    Middlebury’s Tax Future is{' '}
                                    <span className="text-yellow-300">at Risk</span>
                                </motion.h1>

                                <motion.p
                                    className="text-base sm:text-xl text-white/85 mb-10 max-w-2xl text-center sm:text-left leading-relaxed"
                                    variants={itemVariants}
                                >
                                    The 2025 revaluation moved your tax bill. The $224 million
                                    Region 15 school bond will move it again starting in 2027.
                                </motion.p>

                                {/* The Problem */}
                                <motion.section
                                    className="mb-7"
                                    variants={itemVariants}
                                    aria-labelledby="problem-heading"
                                >
                                    <h2 id="problem-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        Where Things Stand
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li>
                                            The October 2025 revaluation raised the average
                                            Middlebury home’s value by <Stat>35.4%</Stat> and
                                            the average tax bill by <Stat>10.4%</Stat>.
                                        </li>
                                        <li>
                                            Residential property is now{' '}
                                            <Stat>over 90%</Stat> of the Grand List. There is
                                            almost no commercial base left to absorb new town
                                            and school costs.
                                        </li>
                                        <li>
                                            The mill rate reset from <Stat>32.52</Stat> to{' '}
                                            <Stat>26.56</Stat>, but home values rose faster, so
                                            most homeowners still pay more in FY 2026–27.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* What's coming */}
                                <motion.section
                                    className="mb-7"
                                    variants={itemVariants}
                                    aria-labelledby="costs-heading"
                                >
                                    <h2 id="costs-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        What’s Coming Next
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li>
                                            The FY 2026–27 town budget was first proposed at{' '}
                                            <Stat>+12.29%</Stat>. The Board of Finance cut it
                                            to <Stat>+3.80%</Stat>. Those kinds of cuts may
                                            not be possible again in FY 2027–28.
                                        </li>
                                        <li>
                                            Voters approved the <Stat>$224 million</Stat>{' '}
                                            Region 15 construction bond on May 6, 2026.
                                            Middlebury voted no (539 to 648), but Southbury’s
                                            yes vote carried the result. Middlebury is on the
                                            hook for its 33.13% share, about{' '}
                                            <Stat>$49.2 million</Stat> over 30 years with
                                            interest.
                                        </li>
                                        <li>
                                            The bond adds about <Stat>$240 per $100,000</Stat>{' '}
                                            of assessment per year starting FY 2027–28, peaking
                                            near <Stat>$321 per $100,000</Stat> around
                                            FY 2032–33.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Why the tax base matters */}
                                <motion.section
                                    className="mb-8"
                                    variants={itemVariants}
                                    aria-labelledby="why-heading"
                                >
                                    <h2 id="why-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        Why the Tax Base Matters
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span>
                                                Residential property in CT consumes about{' '}
                                                <Stat>$1.11</Stat> in services for every{' '}
                                                <Stat>$1.00</Stat> in tax paid. Commercial
                                                property pays in about <Stat>$0.26</Stat>.
                                            </span>
                                            <Link
                                                href="/docs/median-cost-public-services.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={pdfBtnClass}
                                                aria-label="Open PDF: Median cost to provide public services chart"
                                            >
                                                View PDF
                                            </Link>
                                        </li>

                                        <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span>
                                                A handful of recent commercial taxpayers, including{' '}
                                                <Stat>764 Southford Road</Stat> and{' '}
                                                <Stat>199 Benson Road</Stat>, won large
                                                assessment cuts under the Pizzuto / Hartley
                                                “8-3m” law in 2025, removing more than{' '}
                                                <Stat>$349,000</Stat> in annual tax revenue.
                                            </span>
                                            <Link
                                                href="/docs/commercial-taxpayers-assessments-taxes.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={pdfBtnClass}
                                                aria-label="Open PDF: Commercial taxpayers, assessments and taxes owed"
                                            >
                                                View PDF
                                            </Link>
                                        </li>

                                        <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span>
                                                Middlebury collected about{' '}
                                                <Stat>$500,000</Stat> in permit fees in the
                                                last 12 months. A single sizeable commercial
                                                project can dwarf that number in one-time fees
                                                alone.
                                            </span>
                                            <Link
                                                href="/docs/fees-last-12-months.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={pdfBtnClass}
                                                aria-label="Open PDF: All fees paid in the last 12 months"
                                            >
                                                View PDF
                                            </Link>
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Bottom line callout */}
                                <motion.aside
                                    className="mb-8 border-l-4 border-yellow-300 bg-white/5 backdrop-blur-sm pl-4 sm:pl-5 pr-4 py-4 rounded-r-md"
                                    variants={itemVariants}
                                >
                                    <p className="text-sm sm:text-base font-medium leading-relaxed text-white">
                                        The 2025 revaluation already shifted more cost onto
                                        homeowners. The $224 million bond shifts more starting
                                        in 2027. Without a stronger commercial base, every
                                        future budget increase falls squarely on residents.
                                    </p>
                                    <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-yellow-100">
                                        Run your numbers, then watch what the town and the
                                        region do next.
                                    </p>
                                </motion.aside>

                                {/* CTA buttons */}
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
                                    variants={itemVariants}
                                >
                                    <Link
                                        href="/tax-impact"
                                        className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-7 py-3 text-base font-semibold text-white no-underline shadow-lg shadow-sky-900/40 hover:bg-sky-500 hover:shadow-sky-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition"
                                    >
                                        See Your Tax Impact
                                        <span aria-hidden>→</span>
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/20 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition cursor-pointer w-max backdrop-blur-sm"
                                    >
                                        Contact Us
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <ContactModal isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
            )}
        </>
    );
}
