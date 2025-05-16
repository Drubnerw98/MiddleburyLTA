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

  const currentRate = 0.025;
  const newRate = 0.0225;

  const currentTax = Math.round(confirmedValue * currentRate);
  const newTax = Math.round(confirmedValue * newRate);
  const savings = currentTax - newTax;

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
        Tax Savings with the Distribution Center
      </h1>
      <p className="text-gray-300 text-lg">
        Use the slider or enter your home's value to see how the new
        distribution center could lower your property taxes.
      </p>

      {/* Calculator Card */}
      <div className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-6">
        {/* Input + Buttons */}
        <div className="space-y-2">
          <label htmlFor="homeInput" className="block text-blue-200 text-lg">
            Your Home Value:
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-900/60 rounded-md p-4 break-words">
            <p className="text-sm text-blue-300">Current Taxes</p>
            <p className="text-2xl font-bold text-white">
              {formatMoneyShort(currentTax)}
            </p>
          </div>
          <div className="bg-green-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-green-300">After Distribution Center</p>
            <p className="text-2xl font-bold text-green-100">
              {formatMoneyShort(newTax)}
            </p>
          </div>
          <div className="bg-yellow-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-yellow-300">Estimated Savings</p>
            <p className="text-2xl font-bold text-yellow-100">
              {formatMoneyShort(savings)}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation placeholder */}
      <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 shadow-inner space-y-3">
        <h2 className="text-xl font-semibold text-blue-200">
          Why would taxes go down?
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          [You’ll put your explanation here later — e.g. added tax revenue from
          commercial properties reduces burden on homeowners, etc.]
        </p>
      </div>

      <p className="text-sm text-gray-400 italic text-center">
        This is a simple estimate based on a projected reduction in the local
        tax rate. Exact savings may vary depending on budget decisions and
        property assessments.
      </p>
    </main>
  );
}
