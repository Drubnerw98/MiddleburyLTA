"use client";

import { useState } from "react";

export default function TaxImpactPage() {
  const SLIDER_MIN = 100000;
  const SLIDER_MAX = 10000000;
  const DEFAULT_HOME_VALUE = 360000;

  const [inputValue, setInputValue] = useState(DEFAULT_HOME_VALUE.toString());
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_HOME_VALUE);

  const baseHomeValue = 360000;
  const baseTaxWithoutDev = 11729;
  const baseTaxWithDev = 10692;
  const savingsRate = 1 - baseTaxWithDev / baseTaxWithoutDev;

  const handleSubmit = () => {
    const parsed = parseInt(inputValue.replace(/[^\d]/g, ""), 10);
    const cleanValue = Math.max(SLIDER_MIN, parsed);
    setConfirmedValue(cleanValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatMoney = (value: number) =>
      value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

  const multiplier = confirmedValue / baseHomeValue;
  const taxWithDev = Math.round(baseTaxWithDev * multiplier);
  const taxWithoutDev = Math.round(baseTaxWithoutDev * multiplier);
  const taxSavings = taxWithoutDev - taxWithDev;

  return (
      <main className="bg-white min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <section className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              2024 Tax Impact Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Use this tool to estimate how the new commercial properties on
              Southford Road and Straits Turnpike would have impacted your 2024
              property taxes.
            </p>
          </section>

          {/* Calculator */}
          <section className="bg-slate-100 border border-slate-300 rounded-xl p-6 sm:p-8 space-y-8">
            {/* Value Input */}
            <div className="text-center space-y-1">
              <p className="text-gray-600 text-sm">Your Home’s Current Value</p>
              <div className="flex justify-center items-center gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-semibold tracking-wide text-gray-900">
                {formatMoney(confirmedValue)}
              </span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={(e) =>
                        setInputValue(e.target.value.replace(/[^\d]/g, ""))
                    }
                    onKeyDown={handleKeyDown}
                    className="w-20 text-sm bg-transparent border border-gray-300 rounded-md px-2 py-1 focus:outline-none text-center text-gray-700"
                    placeholder="Edit"
                />
                <button
                    onClick={handleSubmit}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="px-4">
              <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={5000}
                  value={Math.min(confirmedValue, SLIDER_MAX)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInputValue(val.toString());
                    setConfirmedValue(val);
                  }}
                  className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>${SLIDER_MIN.toLocaleString()}</span>
                <span>${SLIDER_MAX.toLocaleString()}</span>
              </div>
            </div>

            {/* Tax Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white border border-slate-300 rounded-md py-6">
                <p className="text-sm text-gray-500">Without Development</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatMoney(taxWithoutDev)}
                </p>
              </div>
              <div className="bg-white border border-slate-300 rounded-md py-6">
                <p className="text-sm text-gray-500">With Development</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatMoney(taxWithDev)}
                </p>
              </div>
              <div className="bg-white border border-slate-300 rounded-md py-6">
                <p className="text-sm text-gray-500">Your Estimated Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatMoney(taxSavings)}{" "}
                  <span className="text-base text-gray-500">
                  ({(savingsRate * 100).toFixed(2)}%)
                </span>
                </p>
              </div>
            </div>
          </section>

          {/* Vision Appraisal Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t know your home&apos;s assessed value? Look it up on{" "}
            <a
                href="https://gis.vgsi.com/MiddleburyCT/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-500"
            >
              Vision Appraisal
            </a>
            .
          </p>

          {/* About the Numbers */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm text-gray-800 space-y-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-800">About the Numbers</h2>
            <ul className="list-disc pl-6 space-y-4">
              {[
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
              ].map((line, idx) => (
                  <li key={idx}>{line}</li>
              ))}
            </ul>
          </section>

          {/* Footer Note */}
          <section className="text-center text-sm text-slate-500 font-medium">
            Figures based on updated mill rate and Grand List estimates for 2024.
          </section>
        </div>
      </main>
  );
}
