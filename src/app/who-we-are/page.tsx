// app/who-we-are/page.tsx
import Image from "next/image";
import { DisplayHeading, Eyebrow, Lead } from "@/app/components/ui";

export const metadata = {
    title: "Who are we? | Middlebury Taxpayers",
    description:
        "Middlebury Taxpayers tracks how the 2025 revaluation and the $224M Region 15 school bond affect property tax bills, and advocates for a broader commercial tax base.",
};

export default function WhoWeArePage() {
    return (
        <main className="bg-paper min-h-screen">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-20">
                {/* Header */}
                <header>
                    <Eyebrow tone="oxblood">About</Eyebrow>
                    <DisplayHeading level={1} className="mt-3">
                        Who we are.
                    </DisplayHeading>
                    <Lead className="mt-5">
                        Middlebury Taxpayers is a group of property owners tracking
                        how the 2025 revaluation and the $224 million Region 15
                        school bond will affect property tax bills in town. With
                        residential property now over 90% of the Grand List, most
                        future cost increases will fall directly on homeowners.
                        We publish the numbers, follow decisions at Town Hall and
                        the Region 15 board, and advocate for a broader commercial
                        tax base to reduce the pressure on residents.
                    </Lead>
                </header>

                {/* Drubner Equities */}
                <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8">
                        <div className="shrink-0">
                            <Image
                                src="/images/drubner-equities-logo.png"
                                alt="Drubner Equities"
                                width={96}
                                height={96}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <Eyebrow>Drubner Equities</Eyebrow>
                                <DisplayHeading level={3} as="h2" className="mt-2">
                                    Investing across marinas, hotels, and Middlebury industrial.
                                </DisplayHeading>
                            </div>
                            <div className="space-y-4 font-sans text-base text-ink-soft leading-relaxed">
                                <p>
                                    Over more than three decades in the real estate
                                    industry, David Drubner has profitably invested in
                                    most real estate sectors. Today all of his active
                                    real estate investments are with operating partners
                                    like TPG Hotels and Resorts and Atlantic Management.
                                    He is focused on acquiring unique assets with intrinsic,
                                    enduring value that can be held for the long term:
                                    marinas, hotel/resorts, and select development
                                    opportunities. These types of assets should be
                                    relatively inflation-protected over the long run and
                                    provide additional downside protection through the
                                    ability to increase value with active, professional
                                    management.
                                </p>
                                <p>
                                    Over the years David has developed relationships with
                                    restructuring advisors, lenders, and institutional
                                    owners, as well as numerous operating partners across
                                    sectors and geographies. He expects these
                                    relationships to give access to off-market and
                                    distressed situations.
                                </p>
                                <p>
                                    After launching Drubner Equities in 2020, he formed a
                                    joint venture with TPG Hotels and Resorts Companies to
                                    create TPG Marinas. To date they have acquired 8
                                    marinas, three of which are hotel/resort properties,
                                    all in high barrier-to-entry markets in New England,
                                    New York, and Coastal Georgia.
                                </p>
                                <p>
                                    He is also pursuing a hotel strategy with TPG Hotels
                                    and Resorts, acquiring independent boutique hotels in
                                    high-barrier-to-entry, drive-to-destination markets
                                    such as coastal New England, the Mid-Atlantic, the
                                    Carolinas, and Florida.
                                </p>
                                <p>
                                    He is also actively involved in industrial development,
                                    specifically in Middlebury, CT. He has partnered with
                                    Atlantic Management, a best-in-class industrial
                                    property owner/developer based in Boston, MA. They are
                                    currently partners in Southford Park, the former Timex
                                    Headquarters, where they have approval for a 670,000
                                    square foot warehouse development (currently in the
                                    Appellate legal process). They have also received full
                                    approvals and sustained several appeals on a 171,000
                                    square foot warehouse project in Middlebury at 1535
                                    Straits Turnpike.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Atlantic Management */}
                <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8">
                        <div className="shrink-0">
                            <Image
                                src="/images/atlantic-management-logo.png"
                                alt="Atlantic Management"
                                width={160}
                                height={90}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <Eyebrow>Atlantic Management</Eyebrow>
                                <DisplayHeading level={3} as="h2" className="mt-2">
                                    50+ years of New England real estate, six million square feet.
                                </DisplayHeading>
                            </div>
                            <div className="space-y-4 font-sans text-base text-ink-soft leading-relaxed">
                                <p>
                                    Investing successfully requires an in-depth
                                    understanding of the market&rsquo;s complexities, an
                                    ability to identify and track trends, the capacity to
                                    utilize leverage effectively, and a thorough knowledge
                                    of local and regional markets. In short, it requires
                                    experience and skill, the very same that Atlantic
                                    Management Corporation has been offering its Partners
                                    for more than 40 years.
                                </p>
                                <p>
                                    The company was formed in 1972 to provide investors
                                    with long-term capital growth through conservatively
                                    structured real estate investments. Since its
                                    inception, Atlantic Management has remained committed
                                    to that goal for its Partners. The willingness to stay
                                    flexible but focused has resulted in the
                                    identification, acquisition, and redevelopment of
                                    properties throughout New England. Atlantic Management
                                    today owns and manages a portfolio of over 6 million
                                    square feet across the region.
                                </p>
                                <p>
                                    Atlantic Management has a proven track record of
                                    performance, demonstrating:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 marker:text-oxblood/60">
                                    <li>
                                        The expertise necessary to acquire and manage
                                        quality investment real estate.
                                    </li>
                                    <li>
                                        Strong relationships with both the brokerage
                                        community and financial lending institutions.
                                    </li>
                                    <li>
                                        An awareness of the market&rsquo;s direction for
                                        formulating future real estate investment
                                        strategies and opportunities.
                                    </li>
                                    <li>
                                        An entrepreneurial spirit, forever exploring new
                                        ways to construct economically sound real estate
                                        investments.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Murtha Enterprises */}
                <section className="border-t border-rule pt-10 sm:pt-12 mt-14 sm:mt-20">
                    <Eyebrow>Murtha Enterprises / Route 188 LLC</Eyebrow>
                    <DisplayHeading level={3} as="h2" className="mt-2">
                        Industrial property in Beacon Falls and Middlebury.
                    </DisplayHeading>
                    <p className="font-sans text-base text-ink-soft leading-relaxed mt-4 max-w-[60ch]">
                        Murtha Enterprises owns and manages industrial properties in
                        Beacon Falls. Its entity Route 188 LLC owns 671 Southford
                        Road, a large LI-200 development site in Middlebury on
                        Southford and Christian Roads.
                    </p>
                </section>

                {/* Closing */}
                <p className="font-serif text-lg sm:text-xl text-ink mt-14 sm:mt-20 border-t border-rule pt-8 max-w-[60ch]">
                    Collectively, these groups are among the biggest taxpayers in
                    Middlebury, Connecticut.
                </p>
            </div>
        </main>
    );
}
