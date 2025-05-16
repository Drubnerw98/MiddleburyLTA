"use client";

import { useState } from "react";

export default function TaxImpactPage() {
  const SLIDER_MIN = 100000;
  const SLIDER_MAX = 10000000;
  const DEFAULT_VALUE = 360000;

  const [inputValue, setInputValue] = useState(DEFAULT_VALUE.toString());
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_VALUE);
  const [showModal, setShowModal] = useState(false);

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

  const projectedHomeValue = confirmedValue * 1.5;
  const tax2024 = Math.round(confirmedValue * 0.03258);
  const millRateWithoutDev = 0.0247;
  const millRateWithDev = 0.0231;

  const taxWithoutDev = Math.round(projectedHomeValue * millRateWithoutDev);
  const taxWithDev = Math.round(projectedHomeValue * millRateWithDev);
  const taxDifference = taxWithoutDev - taxWithDev;
  const percentSavings = ((taxDifference / taxWithoutDev) * 100).toFixed(1);

  const formatMoneyShort = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num}`;
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-blue-300">
        Next Year's Taxes: With and Without the Distribution Center
      </h1>
      <p className="text-gray-300 text-base sm:text-lg">
        Use this tool to estimate how your taxes will change due to mandatory
        property reassessment — and how much the new distribution center could
        help reduce that increase.
      </p>

      {/* Calculator */}
      <div className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <label htmlFor="homeInput" className="block text-blue-200 text-lg">
            Your Home Value Today:
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 w-full">
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
                placeholder="e.g. 360000"
              />
            </div>
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

        {/* Projected Home Value */}
        <div className="bg-[#3b455a]/80 border border-white/10 rounded-md p-4 text-center space-y-1">
          <p className="text-sm text-gray-300">
            Projected Home Value Next Year (50% Increase)
          </p>
          <p className="text-xl font-bold text-blue-200">
            {formatMoneyShort(projectedHomeValue)}
          </p>
        </div>

        {/* Tax Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-blue-300">2024 Taxes</p>
            <p className="text-2xl font-bold text-white">
              {formatMoneyShort(tax2024)}
            </p>
          </div>
          <div className="bg-red-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-red-300">2025 Without Dev</p>
            <p className="text-2xl font-bold text-white">
              {formatMoneyShort(taxWithoutDev)}
            </p>
          </div>
          <div className="bg-green-900/50 rounded-md p-4 break-words">
            <p className="text-sm text-green-300">2025 With Dev</p>
            <p className="text-2xl font-bold text-green-100">
              {formatMoneyShort(taxWithDev)}
            </p>
          </div>
        </div>

        {/* Savings */}
        <div className="text-center text-yellow-200 text-lg font-medium space-y-1">
          <div>
            Estimated Savings:{" "}
            <span className="font-bold text-yellow-100">
              {formatMoneyShort(taxDifference)}
            </span>
          </div>
          <p className="text-sm text-yellow-200">
            Percent Savings:{" "}
            <span className="font-semibold">{percentSavings}%</span>
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 shadow-inner space-y-4">
        <h2 className="text-xl font-semibold text-blue-200">
          Why Are Taxes Going Up?
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          Middlebury is undergoing a property value reassessment, and most home
          values are expected to rise by about <strong>50%</strong>. That means
          tax bills will also increase — even if the town’s{" "}
          <span className="text-blue-300 font-semibold">mill rate</span>
          <button
            onClick={() => setShowModal(true)}
            className="ml-1 inline-flex items-center justify-center bg-blue-800 text-white text-xs font-bold w-4 h-4 rounded-full hover:bg-blue-700"
            aria-label="What is mill rate?"
          >
            ?
          </button>{" "}
          stays the same.
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
          The proposed <strong>$90 million distribution center</strong> helps
          offset that by generating an estimated{" "}
          <strong>$2.9 million in tax revenue</strong>. This revenue lets the
          town keep the mill rate lower, softening the tax increase for
          homeowners.
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
          Without the development, the average tax bill on a $540k home would be{" "}
          <strong>$13,172</strong>. With the development, that same bill would
          be <strong>$12,490</strong> — a savings of <strong>$681</strong>{" "}
          (about <strong>5.2%</strong>).
        </p>
      </div>

      <p className="text-sm text-gray-400 italic text-center">
        Based on 2025 mill rate estimates from updated Grand List projections
        and budget assumptions. Data provided by local financial experts.
      </p>

      {/* Modal Definition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2c3545] border border-white/10 p-6 rounded-lg max-w-sm w-full text-white shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-blue-300">
              What is a mill rate?
            </h3>
            <p className="text-sm leading-relaxed text-gray-200">
              The <strong>mill rate</strong> is the amount of tax you pay per
              $1,000 of your home’s assessed value. For example, a mill rate of
              25 means you owe $25 for every $1,000 in property value.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
