// src/app/tax-impact/page.tsx
"use client";

import { useState } from "react";

export default function TaxImpactPage() {
  const DEFAULT_VALUE = 360000;

  const [inputValue, setInputValue] = useState(DEFAULT_VALUE.toString());
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_VALUE);

  const handleSubmit = () => {
    const raw = parseInt(inputValue.replace(/[^\d]/g, "") || "0");
    const clean = Math.max(100000, raw);
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

  // 2024 mill rates
  const millWithDev = 0.00996;
  const millWithoutDev = 0.01092;

  const taxWithDev = Math.round(confirmedValue * millWithDev);
  const taxWithoutDev = Math.round(confirmedValue * millWithoutDev);
  const savings = taxWithoutDev - taxWithDev;
  const percentSavings = ((savings / taxWithoutDev) * 100).toFixed(1);

  const formatMoney = (num: number) =>
      `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-blue-300">
          2024 Property Tax Comparison
        </h1>
        <p className="text-gray-300 text-base sm:text-lg">
          Use this tool to estimate your 2024 property tax bill with and without the added
          revenue from the warehouse properties on Southford Road and Straits Turnpike.
        </p>

        {/* Input Form */}
        <div className="bg-[#2c3545]/90 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur space-y-6">
          <div className="space-y-2">
            <label htmlFor="homeInput" className="block text-blue-200 text-lg">
              Your Home Value:
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
            <p className="text-sm text-gray-400 mt-2">
              Don’t know your assessment? You can look it up at{" "}
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

          {/* Comparison Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-red-900/50 rounded-md p-4">
              <p className="text-sm text-red-300">Without Development</p>
              <p className="text-2xl font-bold text-white">
                {formatMoney(taxWithoutDev)}
              </p>
            </div>
            <div className="bg-green-900/50 rounded-md p-4">
              <p className="text-sm text-green-300">With Development</p>
              <p className="text-2xl font-bold text-green-100">
                {formatMoney(taxWithDev)}
              </p>
            </div>
            <div className="bg-blue-900/50 rounded-md p-4">
              <p className="text-sm text-blue-300">Savings</p>
              <p className="text-2xl font-bold text-yellow-100">
                {formatMoney(savings)} ({percentSavings}%)
              </p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-[#2c3545]/80 border border-white/10 rounded-lg p-6 shadow-inner space-y-4">
          <h2 className="text-xl font-semibold text-blue-200">Context</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              In 2024, the average home value in Middlebury was $360,000. Based on that,
              homeowners would pay about <strong>$3,931</strong> in taxes without the warehouse development,
              or <strong>$3,585</strong> with it — a savings of about <strong>8.8%</strong>.
            </li>
            <li>
              Southford Park and Straits Turnpike together generate <strong>$2.67 million</strong> in recurring
              tax revenue and over <strong>$1.81 million</strong> in one-time fees for the town.
            </li>
            <li>
              These projects represent <strong>~7.5%</strong> of the 2024 Grand List and help stabilize the mill rate.
            </li>
            <li>
              Residential properties tend to consume more services than they pay for.
              A 2016 study found CT homes consume <strong>$1.11</strong> in services for every <strong>$1.00</strong> in taxes paid,
              while commercial properties pay far more than they use.
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-400 italic text-center">
          Figures based on 2024 Grand List, mill rates, and official fee estimates. Subject to change with future budgets and revaluations.
        </p>
      </main>
  );
}
