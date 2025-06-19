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
        {/* Title */}
        <section className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-3">
          <h1 className="text-4xl font-bold font-serif text-blue-300">
            2024 Tax Impact Calculator
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Use this tool to estimate how the new commercial properties on Southford Road and Straits Turnpike would have impacted your 2024 property taxes.
          </p>
        </section>

        {/* Calculator */}
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
                    onChange={(e) =>
                        setInputValue(e.target.value.replace(/[^\d]/g, ""))
                    }
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
              Don’t know your assessed value? Look it up on{" "}
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
              <p className="text-2xl font-bold text-white">
                {formatMoney(taxWithoutDev)}
              </p>
            </div>
            <div className="bg-green-900/50 rounded-md p-4">
              <p className="text-sm text-green-300">2024 With Development</p>
              <p className="text-2xl font-bold text-green-100">
                {formatMoney(taxWithDev)}
              </p>
            </div>
            <div className="bg-yellow-900/50 rounded-md p-4">
              <p className="text-sm text-yellow-300">Estimated Savings</p>
              <p className="text-2xl font-bold text-yellow-100">
                {formatMoney(taxSavings)} ({(savingsRate * 100).toFixed(2)}%)
              </p>
            </div>
          </div>
        </section>

        {/* Explainer */}
        <section className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 shadow-inner space-y-4 text-gray-300">
          <h2 className="text-xl font-semibold text-blue-200">
            About the Numbers
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>Based on 2024 projections: taxes of $11,729 without development vs. $10,692 with development (on a $360,000 home).</li>
            <li>This represents an 8.84% savings, scaled to your home’s value.</li>
            <li>Residential property values are expected to rise by 35–50% in the next revaluation, shifting more of the tax burden onto homeowners.</li>
            <li>In 2004, 82.6% of the Grand List was residential real estate. By 2024, it had risen to 86.5%. Without development, that number is expected to approach 91% — and could reach 94% in the coming years.</li>
            <li>Middlebury’s budget is projected to grow 5% annually, driven by school costs (6–7%) and other services (3%). Without new revenue, this means a 27% budget increase in five years funded mostly by residents.</li>
            <li>Commercial development adds to the Grand List, reducing mill rate pressure and helping offset the homeowner burden.</li>
            <li>The combined value of the Southford and Straits Turnpike projects is projected at $90MM — 7.5% of the 2024 Grand List.</li>
            <li>They are expected to contribute $2.7MM in recurring annual tax revenue, plus $1.8MM in one-time fees for permits and site work.</li>
            <li>Commercial properties are more efficient: they consume only $0.26 in services per $1.00 in taxes paid (2022 AFT study), compared to $1.11 for residential properties.</li>
            <li>This means commercial properties create a 74% surplus, while residential properties create an 11% deficit per dollar paid.</li>
            <li>According to the Lincoln Institute of Land Policy, cities with mostly residential tax bases like Detroit and Bridgeport have effective property tax rates over 2.2%, while commercial-heavy cities like Boston and Denver are under 1%.</li>
            <li>A 2023 Iowa State study found that every $1 increase in property tax rate (per $1,000) reduces home value by 0.16%. Middlebury’s 32.6 mill rate — compared to Oxford’s 20 — could cause home values to diverge by 5–10% over time.</li>
            <li>Pepperdine University researchers found that lower property tax burdens directly correlate to higher long-term appreciation and median home values, even when controlling for other variables.</li>
            <li>Middlebury’s mill rate is significantly higher than nearby towns: 32.6 in Middlebury vs. 23.6 in Southbury and 20.0 in Oxford — up to 63% more despite similar home values and public service levels.</li>
            <li>For example, a $400,000 assessed home pays ~$13,000/year in Middlebury vs. ~$8,000/year in Oxford — a $5,000 difference annually from mill rate alone.</li>
          </ul>
        </section>

        <p className="text-sm text-gray-400 italic text-center">
          Figures based on updated mill rate and Grand List estimates for 2024.
        </p>
      </main>
  );
}
