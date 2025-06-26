'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TaxImpactSlider from './TaxImpactSlider';
import AboutTheNumbers from '@/app/components/AboutTheNumbers';

const DEFAULT_HOME_VALUE = 360000;
const SLIDER_MIN = 100000;
const SLIDER_MAX = 10000000;

export default function TaxImpactPage() {
  const [confirmedValue, setConfirmedValue] = useState(DEFAULT_HOME_VALUE);
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(confirmedValue.toLocaleString());

  const baseHomeValue = 360000;
  const baseTaxWithoutDev = 11729;
  const baseTaxWithDev = 10692;
  const savingsRate = 1 - baseTaxWithDev / baseTaxWithoutDev;

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

  const multiplier = confirmedValue / baseHomeValue;
  const taxWithDev = Math.round(baseTaxWithDev * multiplier);
  const taxWithoutDev = Math.round(baseTaxWithoutDev * multiplier);
  const taxSavings = taxWithoutDev - taxWithDev;

  return (
      <main className="bg-white min-h-screen py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <motion.section
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              2024 Tax Impact Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Use this tool to estimate how the new commercial properties on
              Southford Road and Straits Turnpike would have impacted your 2024
              property taxes.
            </p>
          </motion.section>

          {/* Calculator */}
          <motion.section
              className="bg-slate-100 border border-slate-300 rounded-xl p-6 sm:p-10 space-y-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Value Input */}
            <div className="text-center space-y-1 min-h-[72px] sm:min-h-[80px]">
              <p className="text-gray-600 text-sm">Your Home’s Current Value</p>
              <div className="flex justify-center items-center gap-2 flex-wrap min-h-[48px]">
                {!isEditing ? (
                    <>
                  <span className="text-3xl sm:text-4xl font-semibold tracking-wide text-gray-900">
                    {formatMoney(confirmedValue)}
                  </span>
                      <button
                          onClick={() => {
                            setIsEditing(true);
                            setInputText(confirmedValue.toLocaleString());
                          }}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </>
                ) : (
                    <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
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
                          className="pl-7 w-44 text-2xl font-semibold bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-center text-gray-900"
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
                  setConfirmedValueAction={(val) => {
                    setConfirmedValue(val);
                    setInputText(val.toLocaleString());
                  }}
              />
            </div>

            {/* Tax Label */}
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Your 2024 Home Taxes
            </h2>

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
                color: 'text-gray-800',
              }, {
                label: 'With Development',
                value: formatMoney(taxWithDev),
                color: 'text-gray-800',
              }, {
                label: 'Your Estimated Savings',
                value: `${formatMoney(taxSavings)} (${(savingsRate * 100).toFixed(2)}%)`,
                color: 'text-green-600',
              }].map(({ label, value, color }) => (
                  <motion.div
                      key={label}
                      className="bg-white border border-slate-300 rounded-md py-6"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      }}
                  >
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Lookup Link */}
          <motion.div
              className="text-center text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
          >
            Want to look up your official assessment?&nbsp;
            <a
                href="https://gis.vgsi.com/middleburyct"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900 font-medium transition-colors"
            >
              Use the Vision Appraisal website
            </a>
            .
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
