'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactModal from '@/app/components/About/ContactModal';

export default function Home() {
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

                    {/* darker overlay */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* hero content */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 sm:px-8">
                        <div className="text-white max-w-5xl">
                            <h1 className="text-[24px] font-bold mb-4">Middlebury Taxpayers</h1>
                            <p className="mx-auto max-w-3xl text-[16px] mb-4">
                                Middlebury Taxpayers is a nonpartisan, community-based organization committed to
                                advocating for a strong local economy, efficient use of taxpayer dollars, and
                                policies that support businesses and residents alike. We believe Middlebury’s
                                prosperity depends on practical solutions — not expensive legal entanglements.
                            </p>
                            <p className="mx-auto max-w-2xl text-[14px] mb-6">
                                One of the group’s most urgent concerns is the upcoming property revaluation
                                scheduled for next year, which is expected to dramatically shift the town’s tax
                                burden from the business and industrial sectors to residential homeowners.
                            </p>
                            <div className="flex justify-center gap-4">
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
                            </div>
                        </div>
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
