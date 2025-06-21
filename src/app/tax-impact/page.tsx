"use client";

import { useState } from "react";
import TaxImpactSlider from "./TaxImpactSlider";
import AboutTheNumbers from "@/app/components/AboutTheNumbers";

const DEFAULT_HOME_VALUE = 360000;
const SLIDER_MIN = 100000;
const SLIDER_MAX = 10000000;

export default function TaxImpactPage() {
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_HOME_VALUE);
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(confirmedValue.toString());

  const baseHomeValue = 360000;
  const baseTaxWithoutDev = 11729;
  const baseTaxWithDev = 10692;
  const savingsRate = 1 - baseTaxWithDev / baseTaxWithoutDev;

  const formatMoney = (value: number) =>
      value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

  const handleSubmit = () => {
    const parsed = parseInt(inputText.replace(/[^\d]/g, ""), 10);
    const cleanValue = Math.max(SLIDER_MIN, Math.min(parsed, SLIDER_MAX));
    setConfirmedValue(cleanValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const multiplier = confirmedValue / baseHomeValue;
  const taxWithDev = Math.round(baseTaxWithDev * multiplier);
  const taxWithoutDev = Math.round(baseTaxWithoutDev * multiplier);
  const taxSavings = taxWithoutDev - taxWithDev;

  return (
      <main className="bg-white min-h-screen py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
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
          <section className="bg-slate-100 border border-slate-300 rounded-xl p-6 sm:p-10 space-y-10">
            {/* Value Input */}
            <div className="text-center space-y-1">
              <p className="text-gray-600 text-sm">Your Home’s Current Value</p>
              <div className="flex justify-center items-center gap-2 flex-wrap">
                {!isEditing ? (
                    <>
                  <span className="text-3xl sm:text-4xl font-semibold tracking-wide text-gray-900">
                    {formatMoney(confirmedValue)}
                  </span>
                      <button
                          onClick={() => {
                            setIsEditing(true);
                            setInputText(confirmedValue.toString());
                          }}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </>
                ) : (
                    <input
                        type="text"
                        inputMode="numeric"
                        value={inputText}
                        onChange={(e) =>
                            setInputText(e.target.value.replace(/[^\d]/g, ""))
                        }
                        onKeyDown={handleKeyDown}
                        onBlur={handleSubmit}
                        className="w-36 text-2xl font-semibold bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-center text-gray-900"
                        placeholder="Enter Value"
                        autoFocus
                    />
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="px-4 sm:px-12">
              <TaxImpactSlider
                  confirmedValue={confirmedValue}
                  setConfirmedValue={setConfirmedValue}
              />
            </div>

            {/* Tax Label */}
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Your 2024 Home Taxes
            </h2>

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

          {/* ✅ About the Numbers Component Here */}
          <AboutTheNumbers />
        </div>
      </main>
  );
}
