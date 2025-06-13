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
        {/* Title block in box */}
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
          {/* Input */}
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

          {/* Slider */}
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

          {/* Result Grid */}
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
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Based on 2024 projections: $11,729 without development vs. $10,692
              with development (on a $360,000 home).
            </li>
            <li>
              This represents an 8.84% savings, scaled to your home&apos;s value.
            </li>
            <li>
              The Southford and Straits projects are estimated to contribute $2.7
              million annually in new tax revenue.
            </li>
            <li>
              Residential properties are expected to rise in value by 35–50%,
              shifting more burden onto homeowners.
            </li>
            <li>
              Commercial properties are more efficient, costing only $0.26 per
              $1.00 paid in taxes (2022 AFT study).
            </li>
          </ul>
        </section>

        <p className="text-sm text-gray-400 italic text-center">
          Figures based on updated mill rate and Grand List estimates for 2024.
        </p>
      </main>
  );
}
