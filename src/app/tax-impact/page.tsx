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

  const handleReset = () => {
    setInputValue(DEFAULT_HOME_VALUE.toString());
    setConfirmedValue(DEFAULT_HOME_VALUE);
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-3">
          <h1 className="text-4xl font-bold font-serif text-blue-300">
            2024 Tax Impact Calculator
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Use this tool to estimate how the new commercial properties on Southford Road and Straits Turnpike would have impacted your 2024 property taxes.
          </p>
        </section>

        <section className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-6">
          <div className="space-y-2">
            <label htmlFor="homeInput" className="block text-blue-200 text-lg">
              Your Home Value:
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
              <div className="flex items-center w-full sm:w-auto">
                <span className="text-white text-lg font-semibold mr-2">$</span>
                <input
                    id="homeInput"
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.replace(/[^\d]/g, ""))}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-gray-800 text-white border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>

              <div className="flex sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Submit
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Don’t know your assessed value? Look it up on{' '}
              <a
                  href="https://gis.vgsi.com/MiddleburyCT/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
              >
                Vision Appraisal
              </a>
              .
            </p>
          </div>

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
              className="w-full mt-4"
          />

          {confirmedValue > SLIDER_MAX && (
              <p className="text-sm text-yellow-300 mt-1 text-center italic">
                Display capped at $10M — calculations still accurate.
              </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-900/50 rounded-md p-4">
              <p className="text-sm text-blue-300">2024 Without Development</p>
              <p className="text-2xl font-bold text-white">{formatMoney(taxWithoutDev)}</p>
            </div>
            <div className="bg-green-900/50 rounded-md p-4">
              <p className="text-sm text-green-300">2024 With Development</p>
              <p className="text-2xl font-bold text-green-100">{formatMoney(taxWithDev)}</p>
            </div>
            <div className="bg-yellow-900/50 rounded-md p-4">
              <p className="text-sm text-yellow-300">Estimated Savings</p>
              <p className="text-2xl font-bold text-yellow-100">
                {formatMoney(taxSavings)} ({(savingsRate * 100).toFixed(2)}%)
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#1d2736] border border-white/10 rounded-lg p-6 shadow-inner space-y-4 text-gray-100 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-blue-200 mb-4">About the Numbers</h2>
          <div className="space-y-4">
            {[
              "• Based on 2024 projections: taxes of $11,729 without development vs. $10,692 with development (on a $360,000 home).",
              "• Homeowner Savings With Development: This represents an 8.84% savings, scaled to your home's value.",
              "• Without Development, Increasing Residential Tax Burden: Residential property values are expected to rise in value by 35–50% in the town’s next revaluation, far more than commercial real estate and shifting even more of the tax burden onto homeowners going forward.",
              "• In 2004, only 82.6% of the real estate on the Grand List was residential, with the rest of the real estate tax being commercial property.",
              "• By 2024, residential had grown to 86.5% of the Grand List’s real estate value.",
              "• With the coming increase in residential values, residential will be close to 91% of the Grand List’s real estate value. With continued home appreciation and without commercial development, residential could reach 94% or higher of the Grand List’s real estate value in the next few years.",
              "• Middlebury’s town budget is projected to see recurring 5%/year expense increases, driven by 6-7%/year school cost inflation and 3%/year increases in other costs. Over 5 years this will produce a 27% higher budget that, without offsetting taxes from commercial development, will require ever increasing homeowner taxes.",
              "• Expanding commercial development = lower taxes for residents: Commercial development adds to the tax base and helps offset this impact on residents. Even a modest increase in commercial properties could add to the town’s taxable base and reduce mill rate pressure.",
              "• The expected combined value of Southford Park and Straits Turnpike projects is $90MM, or 7.5% of the ’24 Grand List.",
              "• Southford Park and Straits Turnpike are estimated to contribute $2.7 million annually in new tax revenue based on 2024 Grand List & budget. Additionally, they are projected to generate $1.8MM of one-time fees for the town for building & earthwork permits.",
              "• Commercial properties are net payers to a town’s tax base, as they consume far fewer services than they fund in taxes. A study by the American Farmland Trust shows that residential property in CT consumes $1.11 for every $1.00 of tax paid, while farmland ($0.34) and commercial property ($0.26) pay in excess of their consumption and greatly subsidize services that benefit residents. This means that commercial property funds a 74% funding surplus, while residential property causes an 11% funding deficit for every dollar of tax paid.",
              "• Homeowners in residential-only towns pay up to 2x more in property taxes: According to the Lincoln Institute of Land Policy, cities like Detroit and Bridgeport—where the tax base is mostly residential—have effective property tax rates over 2.2%, while cities with a stronger commercial base like Denver and Boston often stay below 1%.",
              "• Homes in high-tax towns are worth less: A 2023 Iowa State study found that each additional $1 per $1,000 in property tax rate lowers home values by 0.16%. Compared to Oxford’s 20 mills, Middlebury’s 32.6 mill rate could mean diverging home values over time with Middlebury values falling 5–10% relative to what they would be under a more balanced tax structure.",
              "• Tax burden impacts home appreciation: An analysis by Pepperdine University (Valadez &amp; Smith) found that states (and towns) with lower property tax burdens had higher median home values and stronger appreciation, even after controlling for other variables. Taxes aren’t just a yearly cost—they affect long-term wealth.",
              "• Middlebury’s mill rate is significantly higher than nearby towns: For FY2024–25, Middlebury’s mill rate is 32.6 mills, compared to 23.6 in Southbury and just 20.0 in Oxford. That puts Middlebury up to 63% higher, despite similar home values and public service needs.",
              "• Greater commercial development can add to the tax base, lowering the mill rate and offsetting this pressure on homeowners.",
              "• Middlebury’s housing costs more in taxes for the same home: A $400,000 assessed home pays about ~$13,000/year in property taxes in Middlebury, versus $8,000 in Oxford — a $5,000 difference annually just based on mill rate.",
            ].map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
          </div>
        </section>

        <section className="bg-[#2c3545]/90 border border-yellow-500/30 rounded-lg p-4 text-center text-sm text-yellow-200 font-medium shadow-md">
          Figures based on updated mill rate and Grand List estimates for 2024.
        </section>
      </main>
  );
}
