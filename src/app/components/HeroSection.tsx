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
                                    Middlebury Lower Taxes Alliance
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
                                    Without new commercial development, homeowners will pay the price.
                                </motion.p>

                                {/* The Problem */}
                                <motion.section
                                    className="mb-7"
                                    variants={itemVariants}
                                    aria-labelledby="problem-heading"
                                >
                                    <h2 id="problem-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        The Problem
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li>
                                            Residential property values are{' '}
                                            <Stat>up 40–50%</Stat> since 2020 Revaluation.
                                        </li>
                                        <li>
                                            Commercial property values are falling, with many worth
                                            less than five years ago.
                                        </li>
                                        <li>
                                            After the 2025 revaluation, in the years ahead, close to{' '}
                                            <Stat>95% of Middlebury’s tax base</Stat> could come
                                            from homeowners. That means the tax burden shifts
                                            directly onto you.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* The Costs Keep Rising */}
                                <motion.section
                                    className="mb-7"
                                    variants={itemVariants}
                                    aria-labelledby="costs-heading"
                                >
                                    <h2 id="costs-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        The Costs Keep Rising
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li>
                                            Town expenses grow <Stat>5% every year</Stat>, mostly
                                            school costs.
                                        </li>
                                        <li>
                                            A new or refurbished school will cost{' '}
                                            <Stat>$80 to $100 million</Stat>, of which Middlebury
                                            must cover about 30%.
                                        </li>
                                        <li>
                                            With no remaining surpluses or savings, taxes will
                                            climb at least <Stat>5% annually</Stat>, and likely
                                            more after 2025.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Why Commercial Development Matters */}
                                <motion.section
                                    className="mb-8"
                                    variants={itemVariants}
                                    aria-labelledby="why-heading"
                                >
                                    <h2 id="why-heading" className={sectionHeadingClass}>
                                        {accentBar}
                                        Why Commercial Development Matters
                                    </h2>
                                    <ul className={bulletClass}>
                                        <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span>
                                                Residential properties cost towns more than they pay
                                                in taxes. (CT Farm Bureau Chart)
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

                                        <li>
                                            Commercial properties generate a net surplus, helping
                                            keep taxes lower for everyone.
                                        </li>

                                        <li>
                                            Two recently blocked warehouse projects alone would
                                            have added:
                                            <ul className="list-[circle] space-y-2 pl-5 mt-3 marker:text-yellow-300/70">
                                                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <span>
                                                        <Stat>$2 million</Stat> in one-time fees
                                                        (4× all permits collected last year).
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

                                                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <span>
                                                        <Stat>$2.2 million annually</Stat> in new
                                                        tax revenue, more than half of what all
                                                        commercial properties now pay.
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
                                            </ul>
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Bottom line — pulled out as a callout */}
                                <motion.aside
                                    className="mb-8 border-l-4 border-yellow-300 bg-white/5 backdrop-blur-sm pl-4 sm:pl-5 pr-4 py-4 rounded-r-md"
                                    variants={itemVariants}
                                >
                                    <p className="text-sm sm:text-base font-medium leading-relaxed text-white">
                                        Without responsible new development, homeowners will carry
                                        nearly the entire tax load, and property taxes will rise
                                        year after year.
                                    </p>
                                    <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-yellow-100">
                                        Middlebury needs commercial growth now to protect its
                                        residents and secure its future.
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
                                        See Your Savings
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
