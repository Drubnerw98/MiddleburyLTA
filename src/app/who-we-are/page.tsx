// app/who-we-are/page.tsx
import Image from "next/image";

export const metadata = {
    title: "Who are we? | Middlebury Taxpayers",
    description:
        "Middlebury Taxpayers tracks how the 2025 revaluation and the $224M Region 15 school bond affect property tax bills, and advocates for a broader commercial tax base.",
};

export default function WhoWeArePage() {
    return (
        <main className="min-h-[calc(100vh-80px)]">
            {/* Top banner */}
            <section className="relative h-[36vh] min-h-[260px] w-full overflow-hidden">
                <Image
                    src="/images/townhall-middlebury.jpg"
                    alt="Middlebury Town Hall"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                        <h1 className="text-white text-3xl sm:text-4xl font-bold">
                            Who are we?
                        </h1>
                    </div>
                </div>
            </section>

            {/* Body */}
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
                <div className="space-y-8 text-[15px] leading-relaxed text-gray-900">
                    <p>
                        Middlebury Taxpayers is a group of property owners tracking how
                        the 2025 revaluation and the $224 million Region 15 school bond
                        will affect property tax bills in town. With residential property
                        now over 90% of the Grand List, most future cost increases will
                        fall directly on homeowners. We publish the numbers, follow
                        decisions at Town Hall and the Region 15 board, and advocate for
                        a broader commercial tax base to reduce the pressure on residents.
                    </p>

                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                            <div className="shrink-0">
                                <Image
                                    src="/images/drubner-equities-logo.png"
                                    alt="Drubner Equities"
                                    width={88}
                                    height={88}
                                    className="rounded-lg object-contain"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <h2 className="text-xl font-semibold">Drubner Equities</h2>
                                <p>
                                    Over more than three decades in the real estate industry,
                                    David Drubner has profitably invested in most real estate
                                    sectors. Today all of his active real estate investments
                                    are with operating partners like TPG Hotels and Resorts
                                    and Atlantic Management. He is focused on acquiring
                                    unique assets with intrinsic, enduring value that can be
                                    held for the long term. This has led him to focus on
                                    marinas, hotel/resorts, and select development
                                    opportunities. These types of assets should be relatively
                                    inflation-protected over the long run and provide
                                    additional downside protection through the ability to
                                    increase value with active, professional management.
                                </p>
                                <p>
                                    Over the years David has developed relationships with
                                    restructuring advisors, lenders, and institutional owners,
                                    as well as numerous operating partners across sectors and
                                    geographies. He expects these relationships to give
                                    access to off-market and distressed situations.
                                </p>
                                <p>
                                    After launching Drubner Equities in 2020, he formed a
                                    joint venture with TPG Hotels and Resorts Companies to
                                    create TPG Marinas. To date they have acquired 8 marinas,
                                    three of which are hotel/resort properties, all in high
                                    barrier-to-entry markets in New England, New York, and
                                    Coastal Georgia.
                                </p>
                                <p>
                                    He is also pursuing a hotel strategy with TPG Hotels and
                                    Resorts, acquiring independent boutique hotels in
                                    high-barrier-to-entry, drive-to-destination markets such
                                    as coastal New England, the Mid-Atlantic, the Carolinas,
                                    and Florida.
                                </p>
                                <p>
                                    He is also actively involved in industrial development,
                                    specifically in Middlebury, CT. He has partnered with
                                    Atlantic Management, a best-in-class industrial property
                                    owner/developer based in Boston, MA. They are currently
                                    partners in Southford Park, the former Timex Headquarters,
                                    where they have approval for a 670,000 square foot
                                    warehouse development (currently in the Appellate legal
                                    process). They have also received full approvals and
                                    sustained several appeals on a 171,000 square foot
                                    warehouse project in Middlebury at 1535 Straits Turnpike.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                            <div className="shrink-0">
                                <Image
                                    src="/images/atlantic-management-logo.png"
                                    alt="Atlantic Management"
                                    width={144}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <h2 className="text-xl font-semibold">Atlantic Management</h2>
                                <p>
                                    Investing successfully requires an in-depth understanding
                                    of the market&rsquo;s complexities, an ability to
                                    identify and track trends, the capacity to utilize
                                    leverage effectively, and a thorough knowledge of local
                                    and regional markets. In short, it requires experience
                                    and skill, the very same that Atlantic Management
                                    Corporation has been offering its Partners for more than
                                    40 years.
                                </p>
                                <p>
                                    The company was formed in 1972 to provide investors with
                                    long-term capital growth through conservatively
                                    structured real estate investments. Since its inception,
                                    Atlantic Management has remained committed to achieving
                                    this goal for its Partners. That commitment has required
                                    the company to evolve and adapt with ever-changing real
                                    estate market conditions. The willingness to stay
                                    flexible but focused has resulted in the identification,
                                    acquisition, and redevelopment of properties throughout
                                    New England. Atlantic Management today owns and manages
                                    a portfolio of over 6 million square feet across the
                                    region.
                                </p>
                                <p>
                                    Atlantic Management has a proven track record of
                                    performance, demonstrating:
                                </p>
                                <ul className="list-disc pl-6 space-y-1.5">
                                    <li>
                                        The expertise necessary to acquire and manage quality
                                        investment real estate.
                                    </li>
                                    <li>
                                        Strong relationships with both the brokerage
                                        community and financial lending institutions.
                                    </li>
                                    <li>
                                        An awareness of the market&rsquo;s direction for
                                        formulating future real estate investment strategies
                                        and opportunities.
                                    </li>
                                    <li>
                                        An entrepreneurial spirit, forever exploring new ways
                                        to construct economically sound real estate
                                        investments.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Murtha Enterprises / Route 188 LLC</h2>
                        <p className="mt-2">
                            Murtha Enterprises own and manages industrial properties in Beacon
                            Falls and their entity Route 188 LLC owns 671 Southford Road a
                            large LI-200 development site in Middlebury on Southford and
                            Christian Roads.
                        </p>
                    </section>

                    <p className="font-semibold">
                        Collectively these groups are the biggest taxpayers in Middlebury,
                        CT
                    </p>
                </div>
            </section>
        </main>
    );
}
