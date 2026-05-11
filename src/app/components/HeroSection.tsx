'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '@/app/components/About/ContactModal';
import {
    Callout,
    DisplayHeading,
    Eyebrow,
    Lead,
    Pullquote,
    StatCard,
} from '@/app/components/ui';

export default function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <main className="bg-paper">
                <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
                    {/* Hero */}
                    <header>
                        <Eyebrow tone="oxblood">Middlebury Taxpayers</Eyebrow>
                        <DisplayHeading level={1} className="mt-3">
                            Middlebury&rsquo;s tax future,<br />reshaped twice.
                        </DisplayHeading>
                        <Lead className="mt-5">
                            The October 2025 revaluation already moved your tax bill.
                            The $224 million Region 15 school construction bond,
                            approved May 6, will move it again starting FY 2027&ndash;28.
                            This site shows what that means for your home and why
                            the broader tax base matters.
                        </Lead>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                            <Link
                                href="/tax-impact"
                                className="inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 font-sans text-base font-semibold text-bone no-underline hover:bg-ink-soft transition-colors"
                            >
                                See your tax impact
                                <span aria-hidden>&rarr;</span>
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center px-7 py-3.5 font-sans text-base font-semibold text-ink hover:bg-ink hover:text-bone border border-ink transition-colors w-max"
                            >
                                Contact us
                            </button>
                        </div>
                    </header>

                    {/* Section: Where things stand */}
                    <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                        <Eyebrow tone="oxblood">Where things stand</Eyebrow>
                        <DisplayHeading level={2} as="h2" className="mt-3">
                            The post-revaluation reality.
                        </DisplayHeading>
                        <p className="font-sans text-base text-ink-soft mt-4 max-w-[60ch] leading-relaxed">
                            The October 2025 revaluation set new assessed values for
                            every property in town. The numbers below describe the
                            aggregate result.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
                            <StatCard
                                label="Reval Averages"
                                value="+35.4% / +10.4%"
                                caption="Home value / tax bill, residential"
                                tone="up"
                            />
                            <StatCard
                                label="Grand List"
                                value="Over 90%"
                                caption="Residential share; minimal commercial offset"
                            />
                            <StatCard
                                label="Mill Rate"
                                value="32.52 → 26.56"
                                caption="FY 2025–26 → FY 2026–27"
                            />
                        </div>
                    </section>

                    {/* Section: What's coming */}
                    <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                        <Eyebrow tone="oxblood">What&rsquo;s coming next</Eyebrow>
                        <DisplayHeading level={2} as="h2" className="mt-3">
                            The $224 million bond ahead.
                        </DisplayHeading>
                        <p className="font-sans text-base text-ink-soft mt-4 max-w-[60ch] leading-relaxed">
                            Voters approved the Region 15 school construction bond on
                            May 6, 2026. The cost arrives in stages, starting with the
                            FY 2027&ndash;28 tax bills.
                        </p>

                        <Pullquote className="mt-8" attribution="Combined town vote: 2,474 Yes – 1,820 No.">
                            Middlebury voted no, 539 to 648. Southbury&rsquo;s yes carried
                            the result, but Middlebury is on the hook for its 33.13% share.
                        </Pullquote>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-10">
                            <StatCard
                                label="Budget Path"
                                value="+12.29% → +3.80%"
                                caption="Proposed vs. final, FY 2026–27"
                            />
                            <StatCard
                                label="Bond Authorized"
                                value="$224 million"
                                caption="Region 15 construction bond"
                                tone="up"
                            />
                            <StatCard
                                label="Year-1 Charge"
                                value="$240 / $100k"
                                caption="Starting FY 2027–28; peaks near $321"
                                tone="up"
                            />
                        </div>
                    </section>

                    {/* Section: Why the tax base matters */}
                    <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                        <Eyebrow tone="oxblood">Why the tax base matters</Eyebrow>
                        <DisplayHeading level={2} as="h2" className="mt-3">
                            The disappearing commercial offset.
                        </DisplayHeading>
                        <p className="font-sans text-base text-ink-soft mt-4 max-w-[60ch] leading-relaxed">
                            Residential property uses more in services than it pays in
                            taxes. Commercial property pays in more than it consumes.
                            When the commercial base shrinks, residents make up the
                            difference.
                        </p>

                        <ul className="mt-8 space-y-6">
                            <li className="flex items-baseline gap-4 border-b border-rule pb-6">
                                <span className="font-serif text-2xl text-oxblood tabular-nums shrink-0 w-24">$1.11</span>
                                <div className="flex-1">
                                    <p className="font-sans text-base text-ink leading-relaxed">
                                        Residential CT property uses about <span className="font-semibold">$1.11</span> in
                                        services for every <span className="font-semibold">$1.00</span> in tax paid.
                                        Commercial property pays in about <span className="font-semibold">$0.26</span>.
                                    </p>
                                    <Link
                                        href="/docs/median-cost-public-services.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                    >
                                        CT Farm Bureau chart (PDF)
                                    </Link>
                                </div>
                            </li>

                            <li className="flex items-baseline gap-4 border-b border-rule pb-6">
                                <span className="font-serif text-2xl text-oxblood tabular-nums shrink-0 w-24">$349k</span>
                                <div className="flex-1">
                                    <p className="font-sans text-base text-ink leading-relaxed">
                                        A handful of recent commercial taxpayers, including{' '}
                                        <span className="font-semibold">764 Southford Road</span> and{' '}
                                        <span className="font-semibold">199 Benson Road</span>,
                                        won large assessment cuts under the Pizzuto / Hartley
                                        &ldquo;8-3m&rdquo; law in 2025, removing more than{' '}
                                        <span className="font-semibold">$349,000</span> in
                                        annual tax revenue.
                                    </p>
                                    <Link
                                        href="/docs/commercial-taxpayers-assessments-taxes.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                    >
                                        Commercial taxpayers (PDF)
                                    </Link>
                                </div>
                            </li>

                            <li className="flex items-baseline gap-4">
                                <span className="font-serif text-2xl text-oxblood tabular-nums shrink-0 w-24">$500k</span>
                                <div className="flex-1">
                                    <p className="font-sans text-base text-ink leading-relaxed">
                                        Middlebury collected about{' '}
                                        <span className="font-semibold">$500,000</span> in
                                        permit fees in the last 12 months. A single sizeable
                                        commercial project can dwarf that number in one-time
                                        fees alone.
                                    </p>
                                    <Link
                                        href="/docs/fees-last-12-months.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                                    >
                                        Permit fees, last 12 months (PDF)
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Closing callout */}
                    <Callout title="The argument, in one line" className="mt-14 sm:mt-20">
                        The 2025 revaluation already shifted more cost onto
                        homeowners. The $224 million bond shifts more starting in
                        2027. Without a stronger commercial base, every future
                        budget increase falls squarely on residents.
                    </Callout>

                    {/* Closing CTA */}
                    <div className="mt-12 sm:mt-14 text-center">
                        <Link
                            href="/tax-impact"
                            className="inline-flex items-center justify-center gap-2 bg-ink px-8 py-4 font-sans text-base font-semibold text-bone no-underline hover:bg-ink-soft transition-colors"
                        >
                            Run your numbers
                            <span aria-hidden>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <ContactModal isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
            )}
        </>
    );
}
