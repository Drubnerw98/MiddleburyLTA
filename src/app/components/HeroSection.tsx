'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from '@/app/components/About/ContactModal';

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for easeOut
        },
    },
};

export default function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <main className="flex items-center justify-center px-2 sm:px-4 pt-0 pb-2 sm:pb-4">
                <div className="relative w-full min-h-[calc(100vh-80px)] rounded-lg overflow-hidden">
                    <Image
                        src="/images/townhall-middlebury.jpg"
                        alt="Middlebury Town Hall"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 sm:px-8">
                        <motion.div
                            className="text-white max-w-5xl"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.h1 className="text-[32px] font-bold mb-4" variants={itemVariants}>
                                Middlebury Taxpayers
                            </motion.h1>
                            <motion.p className="mx-auto max-w-3xl text-[16px] mb-4" variants={itemVariants}>
                                Middlebury Taxpayers is a nonpartisan, community-based organization committed to
                                advocating for a strong local economy, efficient use of taxpayer dollars, and
                                policies that support businesses and residents alike. We believe Middlebury’s
                                prosperity depends on practical solutions — not expensive legal entanglements.
                            </motion.p>
                            <motion.p className="mx-auto max-w-2xl text-[14px] mb-6" variants={itemVariants}>
                                One of the group’s most urgent concerns is the upcoming property revaluation
                                scheduled for October 2025, which is expected to dramatically shift the town’s tax
                                burden from the business and industrial sectors to residential homeowners.
                            </motion.p>
                            <motion.div className="flex justify-center gap-4" variants={itemVariants}>
                                <Link
                                    href="/tax-impact"
                                    className="no-underline rounded-md bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 transition"
                                >
                                    See Your Savings
                                </Link>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 text-[14px] transition cursor-pointer"
                                >
                                    Contact Us
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <ContactModal
                    isOpen={isModalOpen}
                    onCloseAction={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
