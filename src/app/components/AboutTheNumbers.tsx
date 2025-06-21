// src/components/AboutTheNumbers.tsx

export default function AboutTheNumbers() {
    const points = [
        "Based on 2024 projections: taxes of $11,729 without development vs. $10,692 with development (on a $360,000 home).",
        "Homeowner Savings With Development: This represents an 8.84% savings, scaled to your home's value.",
        "Without Development, Increasing Residential Tax Burden: Residential property values are expected to rise in value by 35–50% in the town’s next revaluation, far more than commercial real estate and shifting even more of the tax burden onto homeowners going forward.",
        "In 2004, only 82.6% of the real estate on the Grand List was residential, with the rest of the real estate tax being commercial property.",
        "By 2024, residential had grown to 86.5% of the Grand List’s real estate value.",
        "With the coming increase in residential values, residential will be close to 91% of the Grand List’s real estate value. With continued home appreciation and without commercial development, residential could reach 94% or higher of the Grand List’s real estate value in the next few years.",
        "Middlebury’s town budget is projected to see recurring 5%/year expense increases, driven by 6-7%/year school cost inflation and 3%/year increases in other costs. Over 5 years this will produce a 27% higher budget that, without offsetting taxes from commercial development, will require ever increasing homeowner taxes.",
        "Expanding commercial development = lower taxes for residents: Commercial development adds to the tax base and helps offset this impact on residents. Even a modest increase in commercial properties could add to the town’s taxable base and reduce mill rate pressure.",
        "The expected combined value of Southford Park and Straits Turnpike projects is $90MM, or 7.5% of the ’24 Grand List.",
        "Southford Park and Straits Turnpike are estimated to contribute $2.7 million annually in new tax revenue based on 2024 Grand List & budget. Additionally, they are projected to generate $1.8MM of one-time fees for the town for building & earthwork permits.",
        "Commercial properties are net payers to a town’s tax base, as they consume far fewer services than they fund in taxes. A study by the American Farmland Trust shows that residential property in CT consumes $1.11 for every $1.00 of tax paid, while farmland ($0.34) and commercial property ($0.26) pay in excess of their consumption and greatly subsidize services that benefit residents. This means that commercial property funds a 74% funding surplus, while residential property causes an 11% funding deficit for every dollar of tax paid.",
        "Homeowners in residential-only towns pay up to 2x more in property taxes: According to the Lincoln Institute of Land Policy, cities like Detroit and Bridgeport—where the tax base is mostly residential—have effective property tax rates over 2.2%, while cities with a stronger commercial base like Denver and Boston often stay below 1%.",
        "Homes in high-tax towns are worth less: A 2023 Iowa State study found that each additional $1 per $1,000 in property tax rate lowers home values by 0.16%. Compared to Oxford’s 20 mills, Middlebury’s 32.6 mill rate could mean diverging home values over time with Middlebury values falling 5–10% relative to what they would be under a more balanced tax structure.",
        "Tax burden impacts home appreciation: An analysis by Pepperdine University (Valadez & Smith) found that states (and towns) with lower property tax burdens had higher median home values and stronger appreciation, even after controlling for other variables. Taxes aren’t just a yearly cost—they affect long-term wealth.",
        "Middlebury’s mill rate is significantly higher than nearby towns: For FY2024–25, Middlebury’s mill rate is 32.6 mills, compared to 23.6 in Southbury and just 20.0 in Oxford. That puts Middlebury up to 63% higher, despite similar home values and public service needs. Greater commercial development can add to the tax base, lowering the mill rate and offsetting this pressure on homeowners.",
        "Middlebury’s housing costs more in taxes for the same home: A $400,000 assessed home pays about ~$13,000/year in property taxes in Middlebury, versus $8,000 in Oxford — a $5,000 difference annually just based on mill rate.",
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
                Figures based on updated mill rate and Grand List estimates for 2024.
            </section>
        </>
    );
}
