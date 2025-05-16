"use client";

import { useState } from "react";

export default function TaxImpactPage() {
  const SLIDER_MIN = 100000;
  const SLIDER_MAX = 10000000;
  const DEFAULT_VALUE = 350000;

  const [inputValue, setInputValue] = useState(DEFAULT_VALUE.toString());
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_VALUE);

  const handleSubmit = () => {
    const raw = parseInt(inputValue.replace(/[^\d]/g, "") || "0");
    const clean = Math.max(SLIDER_MIN, raw);
    setConfirmedValue(clean);
  };

  const handleReset = () => {
    setInputValue(DEFAULT_VALUE.toString());
    setConfirmedValue(DEFAULT_VALUE);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Realistic rates and assumptions
  const projectedHomeValue = confirmedValue * 1.5; // 50% reassessment increase
  const millRateWithoutDev = 0.027; // No distribution center
  const millRateWithDev = 0.02589; // With distribution center

  const taxWithoutDev = Math.round(projectedHomeValue * millRateWithoutDev);
  const taxWithDev = Math.round(projectedHomeValue * millRateWithDev);
  const taxDifference = taxWithoutDev - taxWithDev;

  const formatMoneyShort = (num: number) => {
    if (num >= 1_000_000_000_000) return "$999.9B+";
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num}`;
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <h1 className="text-4xl font-serif font-semibold text-blue-300">
        Next Year's Taxes: With and Without the Distribution Center
      </h1>
      <p className="text-gray-300 text-lg">
        Property taxes are increasing due to a mandatory reassessment. Use this
        tool to see how much the new distribution center could reduce the size
        of that increase.
      </p>

      {/* Calculator Card */}
      <div className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-6">
        {/* Input + Buttons */}
        <div className="space-y-2">
          <label htmlFor="homeInput" className="block text-blue-200 text-lg">
            Your Home Value Today:
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 w-full">
            {/* Input w/ $ prefix */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-white text-lg font-semibold">$</span>
              <input
                id="homeInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value.replace(/[^\d]/g, ""))
                }
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-800 text-white border border-blue-700 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
                placeholder="e.g. 350000"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Submit
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div>
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
              Slider display capped at $10M — but calculations still apply.
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="bg-red-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-red-300">Taxes Next Year (No Center)</p>
            <p className="text-2xl font-bold text-white">
              {formatMoneyShort(taxWithoutDev)}
            </p>
          </div>
          <div className="bg-green-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-green-300">
              Taxes Next Year (With Center)
            </p>
            <p className="text-2xl font-bold text-green-100">
              {formatMoneyShort(taxWithDev)}
            </p>
          </div>
        </div>

        <div className="text-center text-yellow-200 text-lg font-medium">
          Estimated Savings:{" "}
          <span className="font-bold text-yellow-100">
            {formatMoneyShort(taxDifference)}
          </span>
        </div>
      </div>

      {/* Explanation section */}
      <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 shadow-inner space-y-3">
        <h2 className="text-xl font-semibold text-blue-200">
          Why Are Taxes Going Up?
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          Like every town in Connecticut, Middlebury is undergoing a property
          value reassessment. Most home values will go up around{" "}
          <strong>50%</strong>, and that means taxes will go up too — even if
          the mill rate stays flat.
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
          But there's good news: the new{" "}
          <strong>$90 million distribution center</strong> would bring in around{" "}
          <strong>$3 million in tax revenue</strong>, helping to spread the
          burden and lower the mill rate town-wide. This keeps your tax increase
          smaller.
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
          Without the project, the town would need to raise the mill rate to
          cover the budget. With the project, the rate actually{" "}
          <em>drops slightly</em>, helping homeowners save.
        </p>
      </div>

      <p className="text-sm text-gray-400 italic text-center">
        This estimate assumes a 50% reassessment increase in home value and uses
        mill rate data provided by local financial experts.
      </p>
    </main>
  );
}
