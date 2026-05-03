'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TaxImpactSlider from './TaxImpactSlider';
import AboutTheNumbers from '@/app/components/AboutTheNumbers';

// Modeled 2024 tax bills for the Middlebury median-value home, with and without
// the proposed Southford Road / Straits Turnpike commercial development. Linear
// scaling against home value is correct so long as the mill rate and assessment
// ratio are uniform across town, which is true in Middlebury.
const BASE_HOME_VALUE = 360_000;
const BASE_TAX_WITHOUT_DEV = 11_729;
const BASE_TAX_WITH_DEV = 10_692;
const SAVINGS_RATE = 1 - BASE_TAX_WITH_DEV / BASE_TAX_WITHOUT_DEV;

const DEFAULT_HOME_VALUE = BASE_HOME_VALUE;
const SLIDER_MIN = 100_000;
const SLIDER_MAX = 10_000_000;

export default function TaxImpactPage() {
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_HOME_VALUE);
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(confirmedValue.toLocaleString());

  const formatMoney = (value: number) =>
      value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });

  const handleSubmit = () => {
    const parsed = parseInt(inputText.replace(/[^\d]/g, ''), 10);
    if (!parsed || isNaN(parsed)) {
      setConfirmedValue(DEFAULT_HOME_VALUE);
      setInputText(DEFAULT_HOME_VALUE.toLocaleString());
    } else {
      const cleanValue = Math.max(SLIDER_MIN, Math.min(parsed, SLIDER_MAX));
      setConfirmedValue(cleanValue);
      setInputText(cleanValue.toLocaleString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const multiplier = confirmedValue / BASE_HOME_VALUE;
  const taxWithDev = Math.round(BASE_TAX_WITH_DEV * multiplier);
  const taxWithoutDev = Math.round(BASE_TAX_WITHOUT_DEV * multiplier);
  const taxSavings = taxWithoutDev - taxWithDev;

  return (
      <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <motion.section
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              Calculator
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              2024 Tax Impact Calculator
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Estimate how the new commercial properties on Southford Road
              and Straits Turnpike would have impacted your 2024 property
              taxes.
            </p>
          </motion.section>

          {/* Calculator */}
          <motion.section
              className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/60 p-6 sm:p-10 space-y-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Value Input */}
            <div className="text-center space-y-2 min-h-[72px] sm:min-h-[80px]">
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
                Your Home’s Current Value
              </p>
              <div className="flex justify-center items-center gap-3 flex-wrap min-h-[48px]">
                {!isEditing ? (
                    <>
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {formatMoney(confirmedValue)}
                  </span>
                      <button
                          onClick={() => {
                            setIsEditing(true);
                            setInputText(confirmedValue.toLocaleString());
                          }}
                          className="text-sm bg-sky-600 text-white px-3 py-1.5 rounded-md hover:bg-sky-700 transition shadow-sm"
                      >
                        Edit
                      </button>
                    </>
                ) : (
                    <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-xl">
                    $
                  </span>
                      <input
                          type="text"
                          inputMode="numeric"
                          value={inputText}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/[^\d]/g, '');
                            if (digitsOnly.length <= 8) {
                              setInputText(digitsOnly);
                            }
                          }}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSubmit}
                          className="pl-7 w-48 text-2xl font-semibold bg-white border-2 border-sky-300 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 text-center text-slate-900"
                          placeholder="Enter Value"
                          autoFocus
                      />
                    </div>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="px-4 sm:px-12">
              <TaxImpactSlider
                  confirmedValue={confirmedValue}
                  onConfirmedValueChange={(val) => {
                    setConfirmedValue(val);
                    setInputText(val.toLocaleString());
                  }}
              />
            </div>

            {/* Tax Label */}
            <div className="text-center pt-4 border-t border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">
                Your 2024 Home Taxes
              </h2>
            </div>

            {/* Tax Results with Stagger */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
            >
              {[{
                label: 'Without Development',
                value: formatMoney(taxWithoutDev),
                cardClass: 'bg-slate-50 border border-slate-200',
                textClass: 'text-slate-800',
              }, {
                label: 'With Development',
                value: formatMoney(taxWithDev),
                cardClass: 'bg-slate-50 border border-slate-200',
                textClass: 'text-slate-800',
              }, {
                label: 'Your Estimated Savings',
                value: `${formatMoney(taxSavings)} (${(SAVINGS_RATE * 100).toFixed(2)}%)`,
                cardClass: 'bg-emerald-50 border border-emerald-200 shadow-sm',
                textClass: 'text-emerald-700',
              }].map(({ label, value, cardClass, textClass }) => (
                  <motion.div
                      key={label}
                      className={`${cardClass} rounded-lg py-6 px-4 transition`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      }}
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{label}</p>
                    <p className={`text-2xl font-bold tabular-nums ${textClass}`}>{value}</p>
                  </motion.div>
              ))}
            </motion.div>

            <p className="text-xs text-slate-500 text-center pt-2 max-w-xl mx-auto leading-relaxed">
              Every household sees the same percentage savings ({(SAVINGS_RATE * 100).toFixed(2)}%);
              the dollar amount scales with home value.
            </p>
          </motion.section>

          {/* Lookup Link */}
          <motion.div
              className="text-center text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span>
              Want to look up your official assessment?{' '}
              <a
                  href="https://gis.vgsi.com/middleburyct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800 font-medium transition-colors"
              >
                Use the Vision Appraisal website
              </a>
            </span>
          </motion.div>


          {/* About the Numbers */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
          >
            <AboutTheNumbers />
          </motion.div>
        </div>
      </main>
  );
}
