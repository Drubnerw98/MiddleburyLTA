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

                    {/* Dark gradient overlay (no blur) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/55 to-black/30" />

                    {/* Content */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8">
                        <motion.div
                            className="w-full max-w-5xl text-white"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <div className="mx-auto w-full rounded-xl">
                                {/* Headline + intro */}
                                <motion.h1
                                    className="text-3xl sm:text-4xl font-bold mb-3 text-center sm:text-left"
                                    variants={itemVariants}
                                >
                                    Middlebury’s Tax Future is at Risk
                                </motion.h1>

                                <motion.p
                                    className="text-base sm:text-lg mb-6 text-center sm:text-left"
                                    variants={itemVariants}
                                >
                                    Without new commercial development, homeowners will pay the price.
                                </motion.p>

                                {/* The Problem */}
                                <motion.section
                                    className="mb-5"
                                    variants={itemVariants}
                                    aria-labelledby="problem-heading"
                                >
                                    <h2 id="problem-heading" className="text-lg sm:text-xl font-semibold mb-2">
                                        The Problem
                                    </h2>
                                    <ul className="list-disc space-y-1.5 pl-5 text-sm sm:text-base leading-relaxed">
                                        <li>Residential property values are up 40–50% since 2020 Revaluation.</li>
                                        <li>Commercial property values are falling — many worth less than five years ago.</li>
                                        <li>
                                            After the 2025 revaluation, in the years ahead, close to 95% of Middlebury’s tax base could
                                            come from homeowners. That means the tax burden shifts directly onto you.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* The Costs Keep Rising */}
                                <motion.section
                                    className="mb-5"
                                    variants={itemVariants}
                                    aria-labelledby="costs-heading"
                                >
                                    <h2 id="costs-heading" className="text-lg sm:text-xl font-semibold mb-2">
                                        The Costs Keep Rising
                                    </h2>
                                    <ul className="list-disc space-y-1.5 pl-5 text-sm sm:text-base leading-relaxed">
                                        <li>Town expenses grow 5% every year, mostly school costs.</li>
                                        <li>A new or refurbished school will cost $80–100 million — Middlebury must cover about 30%.</li>
                                        <li>
                                            With no remaining surpluses or savings, taxes will climb at least 5% annually — likely more after
                                            2025.
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Why Commercial Development Matters */}
                                <motion.section
                                    className="mb-6"
                                    variants={itemVariants}
                                    aria-labelledby="why-heading"
                                >
                                    <h2 id="why-heading" className="text-lg sm:text-xl font-semibold mb-2">
                                        Why Commercial Development Matters
                                    </h2>
                                    <ul className="list-disc space-y-1.5 pl-5 text-sm sm:text-base leading-relaxed">
                                        <li>Residential properties cost towns more than they pay in taxes. (CT Farm Bureau Chart)</li>
                                        <li>Commercial properties generate a net surplus — helping keep taxes lower for everyone.</li>
                                        <li>
                                            Two recently blocked warehouse projects alone would have added:
                                            <ul className="list-disc space-y-1.5 pl-5 mt-2">
                                                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span>
                            $2 million in one-time fees (4x all permits collected last year).
                          </span>
                                                    <Link
                                                        href="/docs/fees-last-12-months.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex w-max rounded-md bg-sky-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white no-underline hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition"
                                                        aria-label="Open PDF: All fees paid in the last 12 months"
                                                    >
                                                        View PDF
                                                    </Link>
                                                </li>
                                                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span>
                            $2.2 million annually in new tax revenue — more than half of what all commercial
                            properties now pay.
                          </span>
                                                    <Link
                                                        href="/docs/commercial-taxpayers-assessments-taxes.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex w-max rounded-md bg-sky-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white no-underline hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition"
                                                        aria-label="Open PDF: Commercial taxpayers, assessments and taxes owed"
                                                    >
                                                        View PDF
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </motion.section>

                                {/* Bottom line */}
                                <motion.p
                                    className="text-sm sm:text-base font-semibold mb-6 leading-relaxed"
                                    variants={itemVariants}
                                >
                  <span className="block">
                    Without responsible new development, homeowners will carry nearly the entire tax load — and property
                    taxes will rise year after year.
                  </span>
                                    <span className="block">
                    Middlebury needs commercial growth now to protect its residents and secure its future.
                  </span>
                                </motion.p>

                                {/* CTA buttons */}
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
                                    variants={itemVariants}
                                >
                                    <Link
                                        href="/tax-impact"
                                        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-6 py-3 text-white no-underline hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition"
                                    >
                                        See Your Savings
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-md bg-gray-500 px-5 py-2.5 text-white text-[14px] hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition cursor-pointer w-max"
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
