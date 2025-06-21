'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from "@/app/components/About/ContactModal";


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <main className="flex min-h-screen items-center justify-center bg-white px-2 sm:px-4 py-6">
                <div className="w-full bg-white shadow-md">
                    <div className="relative w-full h-[90vh]">
                        <Image
                            src="/images/townhall-middlebury.jpg"
                            alt="Middlebury Town Hall"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/50" />

                        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 text-center">
                            <div className="text-white max-w-5xl">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                                    Middlebury Taxpayers
                                </h1>
                                <p className="mx-auto max-w-3xl text-lg sm:text-xl md:text-2xl mb-6">
                                    Middlebury Taxpayers is a nonpartisan, community-based organization committed to
                                    advocating for a strong local economy, efficient use of taxpayer dollars, and
                                    policies that support businesses and residents alike. We believe Middlebury’s
                                    prosperity depends on practical solutions — not expensive legal entanglements.
                                </p>
                                <p className="mx-auto max-w-2xl text-md sm:text-lg md:text-xl mb-8">
                                    One of the group’s most urgent concerns is the upcoming property revaluation
                                    scheduled for next year, which is expected to dramatically shift the town’s tax
                                    burden from the business and industrial sectors to residential homeowners.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link
                                        href="/tax-impact"
                                        className="rounded-md bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 transition"
                                    >
                                        See Your Savings
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="rounded-md border border-white px-6 py-3 text-white hover:bg-white hover:text-black transition"
                                    >
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Contact Modal */}
            {isModalOpen && (
                <ContactModal
                    isOpen={isModalOpen}
                    onCloseAction={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
