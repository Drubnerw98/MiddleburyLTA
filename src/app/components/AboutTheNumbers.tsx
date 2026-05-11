// src/components/AboutTheNumbers.tsx

export default function AboutTheNumbers() {
    const points = [
        "2025 Revaluation: The average Middlebury home rose 35.4% in assessed value and the average residential tax bill rose 10.4%. The mill rate moved from 32.52 (FY 2025–26) to 26.56 (FY 2026–27).",
        "FY 2026–27 town budget: $13,985,958 (+3.80% over FY 2025–26). Initial department requests totaled $15.1M (+12.29%) before the Board of Finance cut roughly $1.2M out of the proposal. That kind of cutting may not be repeatable in FY 2027–28.",
        "Schools share: Middlebury's portion of Region 15 rose 1.57% to $31,682,404. Schools are still 69.4% of Middlebury's total budget.",
        "Why the school bill only rose 1.57%: under C.G.S. §10-51(b)(1), Region 15 costs are apportioned each year by Average Daily Membership (ADM). Middlebury's enrollment share dropped slightly in the October 2025 count, so the town absorbed roughly 10% of the $4.86M Region 15 increase even though its standing share is 33.13%. Not guaranteed to repeat next year.",
        "$224 million Region 15 construction bond: approved May 6, 2026. Middlebury voted NO (539 to 648); Southbury's YES vote (1,935 to 1,172) carried the combined result. Middlebury's 33.13% share is roughly $26.6M to $29.8M in principal, and about $49.2M over 30 years with interest.",
        "Tax impact of the bond: starting FY 2027–28, the bond adds roughly $240 per year per $100,000 of assessment in Year 1, peaking near $321 per year per $100,000 around FY 2032–33.",
        "Commercial property: most commercial values rose 10–15% in the revaluation, which generally meant lower commercial tax bills under the new mill rate. Two large exceptions saw dramatic drops, driven by the Pizzuto / Hartley “8-3m” law and related MSTA litigation: 764 Southford Road (–60%, about –$129,954 per year) and 199 Benson Road (–68%, about –$219,167 per year). Together those two properties removed more than $349,000 in annual tax revenue from the town.",
        "Yale Avenue (81 homes) was a representative residential example. Average assessment rose from $193,627 to $276,006; average tax bill rose from $6,293 to $7,331, or +$1,038 per year (+16.87%).",
        "Grand List composition: residential property is now over 90% of the Grand List. There is effectively no commercial offset left to absorb future cost increases.",
        "Connecticut context: Connecticut is the 3rd worst state in the country for property taxes (effective rate roughly 1.54%, Tax Foundation 2026). The state's Education Cost Sharing foundation has been frozen at $11,525 per student since 2013; with inflation it would be about $16,000 today.",
    ];

    return (
        <>
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm text-gray-800 space-y-6 text-sm leading-relaxed">
                <h2 className="text-2xl font-bold text-slate-800">About the Numbers</h2>
                <ul className="list-disc pl-6 space-y-4">
                    {points.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
            </section>

            <section className="text-center text-sm text-slate-500 font-medium mt-6">
                Figures based on the FY 2026–27 town budget, the October 2025 revaluation,
                and the May 6, 2026 Region 15 bond referendum.
            </section>
        </>
    );
}
