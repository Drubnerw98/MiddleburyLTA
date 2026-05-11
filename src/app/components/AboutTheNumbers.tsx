// src/components/AboutTheNumbers.tsx
//
// Editorial-civic restructure: each fact is a self-contained block
// with an eyebrow, a stat-led headline, and supporting prose. Two
// pullquotes (ADM and commercial) carry the heaviest policy points.

import { DisplayHeading, Eyebrow, Pullquote, SourceLine } from "@/app/components/ui";

type StatBlock = {
    kind: "stat";
    eyebrow: string;
    stat: string;
    body: string;
};

type QuoteBlock = {
    kind: "quote";
    eyebrow: string;
    quote: string;
    body: string;
};

type Block = StatBlock | QuoteBlock;

const blocks: Block[] = [
    {
        kind: "stat",
        eyebrow: "The Revaluation",
        stat: "+35.4% / +10.4%",
        body: "The average Middlebury home rose 35.4% in assessed value in the October 2025 revaluation. The average residential tax bill rose 10.4%. The mill rate moved from 32.52 to 26.56.",
    },
    {
        kind: "stat",
        eyebrow: "The Town Budget",
        stat: "+3.80%",
        body: "The FY 2026–27 town budget is $13,985,958. Initial department requests totaled $15.1M (+12.29%) before the Board of Finance cut roughly $1.2M from the proposal. That level of cutting may not be repeatable in FY 2027–28.",
    },
    {
        kind: "stat",
        eyebrow: "The Schools Share",
        stat: "+1.57%",
        body: "Middlebury's portion of Region 15 rose to $31,682,404. Schools remain 69.4% of Middlebury's total budget.",
    },
    {
        kind: "quote",
        eyebrow: "The ADM Formula",
        quote: "Middlebury bore roughly 10% of the FY 2026–27 Region 15 increase. Its standing share is 33.13%.",
        body: "Under C.G.S. §10-51(b)(1), Region 15 costs are apportioned each year by Average Daily Membership. Middlebury's enrollment share dropped slightly in the October 2025 count, so the town absorbed only about 10% of the $4.86M Region 15 increase. Not guaranteed to repeat next year.",
    },
    {
        kind: "stat",
        eyebrow: "The Bond",
        stat: "$224 million",
        body: "Voters approved the Region 15 construction bond on May 6, 2026. Middlebury voted NO (539 to 648); Southbury's YES vote (1,935 to 1,172) carried the combined result. Middlebury is on the hook for its 33.13% share, roughly $26.6M to $29.8M in principal, about $49.2M over 30 years with interest.",
    },
    {
        kind: "stat",
        eyebrow: "Bond Tax Impact",
        stat: "$240 / $100k",
        body: "Starting FY 2027–28, the bond adds roughly $240 per year per $100,000 of assessment in Year 1. The charge peaks near $321 per $100,000 around FY 2032–33.",
    },
    {
        kind: "quote",
        eyebrow: "Commercial Property",
        quote: "Two commercial properties cut more than $349,000 in annual tax revenue from Middlebury's base.",
        body: "Most commercial values rose 10–15% in the revaluation, which generally meant lower commercial tax bills under the new mill rate. Two large exceptions, driven by the Pizzuto / Hartley “8-3m” law and related MSTA litigation: 764 Southford Road dropped 60% (about $129,954 per year), and 199 Benson Road dropped 68% (about $219,167 per year).",
    },
    {
        kind: "stat",
        eyebrow: "Yale Avenue",
        stat: "+16.87%",
        body: "81 homes on Yale Avenue. Average assessment rose from $193,627 to $276,006. Average tax bill rose from $6,293 to $7,331, an increase of $1,038 per year.",
    },
    {
        kind: "stat",
        eyebrow: "The Grand List",
        stat: "Over 90% residential",
        body: "Residential property is now more than 90% of the Grand List. There is effectively no commercial offset left to absorb future cost increases.",
    },
    {
        kind: "stat",
        eyebrow: "Connecticut Context",
        stat: "3rd worst nationally",
        body: "Connecticut ranks 3rd worst in the country for property taxes (effective rate roughly 1.54%, Tax Foundation 2026). The state's Education Cost Sharing foundation has been frozen at $11,525 per student since 2013. With inflation, it would be about $16,000 today.",
    },
];

export default function AboutTheNumbers() {
    return (
        <section className="space-y-1">
            <Eyebrow tone="muted">Reference</Eyebrow>
            <DisplayHeading level={2} as="h2" className="mt-2">
                About the numbers
            </DisplayHeading>
            <p className="font-sans text-base text-ink-soft mt-3 max-w-[60ch] leading-relaxed">
                The ten figures driving every calculation on this site,
                sourced and explained.
            </p>

            <div className="mt-10 space-y-12">
                {blocks.map((block, idx) => (
                    <article key={idx} className="border-t border-rule pt-8">
                        <Eyebrow>{block.eyebrow}</Eyebrow>
                        {block.kind === "stat" ? (
                            <>
                                <p className="mt-3 font-serif text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
                                    {block.stat}
                                </p>
                                <p className="mt-4 font-sans text-base text-ink-soft max-w-[60ch] leading-relaxed">
                                    {block.body}
                                </p>
                            </>
                        ) : (
                            <>
                                <Pullquote className="mt-4">{block.quote}</Pullquote>
                                <p className="mt-5 font-sans text-base text-ink-soft max-w-[60ch] leading-relaxed">
                                    {block.body}
                                </p>
                            </>
                        )}
                    </article>
                ))}
            </div>

            <SourceLine className="mt-12 pt-6 border-t border-rule">
                Figures based on the FY 2026–27 town budget, the October 2025
                revaluation, and the May 6, 2026 Region 15 bond referendum.
            </SourceLine>
        </section>
    );
}
