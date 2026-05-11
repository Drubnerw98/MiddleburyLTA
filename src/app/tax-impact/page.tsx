'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AssessmentInput from './AssessmentInput';
import AboutTheNumbers from '@/app/components/AboutTheNumbers';
import {
  AVG_VALUE_INCREASE,
  BOND_Y1_PER_100K,
  DEFAULT_NEW_ASSESSMENT,
  NEW_MILL_RATE,
  OLD_MILL_RATE,
  bondYearOne,
  newAnnualTax,
  oldAnnualTax,
  townAvgOldFromNew,
} from './constants';

const formatMoney = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const formatSignedMoney = (value: number) => {
  const rounded = Math.round(value);
  if (rounded === 0) return '$0';
  const sign = rounded > 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(rounded))}`;
};

const formatSignedPct = (ratio: number) => {
  const pct = ratio * 100;
  if (Math.abs(pct) < 0.005) return '0.00%';
  const sign = pct > 0 ? '+' : '-';
  return `${sign}${Math.abs(pct).toFixed(2)}%`;
};

export default function TaxImpactPage() {
  const [newAssessment, setNewAssessment] = useState(DEFAULT_NEW_ASSESSMENT);
  const [useTownAvg, setUseTownAvg] = useState(true);
  const [manualOldAssessment, setManualOldAssessment] = useState(() =>
    Math.round(townAvgOldFromNew(DEFAULT_NEW_ASSESSMENT) / 1000) * 1000,
  );

  const oldAssessment = useTownAvg
    ? Math.round(townAvgOldFromNew(newAssessment))
    : manualOldAssessment;

  const oldTax = oldAnnualTax(oldAssessment);
  const newTax = newAnnualTax(newAssessment);
  const revalDelta = newTax - oldTax;
  const revalDeltaPct = oldTax > 0 ? revalDelta / oldTax : 0;

  const bondY1 = bondYearOne(newAssessment);
  const combined2728Tax = newTax + bondY1;
  const combinedDelta = combined2728Tax - oldTax;
  const combinedDeltaPct = oldTax > 0 ? combinedDelta / oldTax : 0;

  const revalDeltaPositive = revalDelta > 0;

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
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
            Your Property Tax Impact
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            2026 revaluation plus the FY 2027–28 Region 15 school bond, applied
            to your home. Enter your new assessment to see the dollar change.
          </p>
        </motion.section>

        {/* Vision lookup callout */}
        <motion.div
          className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-sky-900">
              Don&apos;t know your new assessment?
            </p>
            <p className="text-sm text-sky-800/80 mt-0.5">
              Look it up on the Middlebury Vision Appraisal site. Most homeowners
              search by street address.
            </p>
          </div>
          <a
            href="https://gis.vgsi.com/middleburyct"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition shadow-sm shrink-0"
          >
            Open Vision lookup
            <span aria-hidden>↗</span>
          </a>
        </motion.div>

        {/* Inputs */}
        <motion.section
          className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/60 p-6 sm:p-10 space-y-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <AssessmentInput
            label="Your New Assessment (FY 2026–27)"
            helper="From the Vision Appraisal lookup above."
            value={newAssessment}
            onChange={setNewAssessment}
          />

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useTownAvg}
                onChange={(e) => setUseTownAvg(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              <span className="text-sm">
                <span className="font-medium text-slate-800">
                  Use the town-average increase to estimate my prior assessment
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Auto-fills your FY 2025–26 assessment as your new assessment
                  ÷ {(1 + AVG_VALUE_INCREASE).toFixed(3)} (the town-wide +
                  {(AVG_VALUE_INCREASE * 100).toFixed(1)}% reval average).
                  Uncheck to enter the actual figure from your last tax bill.
                </span>
              </span>
            </label>

            {useTownAvg ? (
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estimated Prior Assessment (FY 2025–26)
                </p>
                <p className="text-2xl font-bold tabular-nums text-slate-900 mt-1">
                  {formatMoney(oldAssessment)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated from your new assessment. Your actual prior
                  assessment may differ. Check your FY 2025–26 tax bill for
                  the exact figure.
                </p>
              </div>
            ) : (
              <AssessmentInput
                label="Your Prior Assessment (FY 2025–26)"
                helper="The assessed value on your last tax bill, before October 2025."
                value={manualOldAssessment}
                onChange={setManualOldAssessment}
              />
            )}
          </div>
        </motion.section>

        {/* Reval impact */}
        <motion.section
          className="space-y-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">
              Step 1
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              FY 2026–27 Revaluation Impact
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Mill rate moves from {OLD_MILL_RATE} to {NEW_MILL_RATE}. Applied
              to your assessment values above.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white border border-slate-200 py-5 px-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                FY 2025–26 Tax
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800">
                {formatMoney(oldTax)}
              </p>
              <p className="text-xs text-slate-400 mt-1">at {OLD_MILL_RATE} mills</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 py-5 px-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                FY 2026–27 Tax
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800">
                {formatMoney(newTax)}
              </p>
              <p className="text-xs text-slate-400 mt-1">at {NEW_MILL_RATE} mills</p>
            </div>
            <div
              className={`rounded-xl border py-5 px-4 shadow-sm ${
                revalDeltaPositive
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  revalDeltaPositive ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                Change
              </p>
              <p
                className={`mt-2 text-2xl font-bold tabular-nums ${
                  revalDeltaPositive ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {formatSignedMoney(revalDelta)}
              </p>
              <p
                className={`text-xs mt-1 font-medium ${
                  revalDeltaPositive ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {formatSignedPct(revalDeltaPct)} vs. FY 2025–26
              </p>
            </div>
          </div>
        </motion.section>

        {/* Bond impact */}
        <motion.section
          className="space-y-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Step 2
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Starting FY 2027–28: $224M School Bond
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Approved May 6, 2026. Year-1 charge: ${BOND_Y1_PER_100K} per
              $100,000 of assessment, layered on top of the new mill rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white border border-slate-200 py-5 px-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Year-1 Bond Charge
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">
                {formatMoney(bondY1)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                per year, starting FY 2027–28
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 py-5 px-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                FY 2027–28 Total Tax
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800">
                {formatMoney(combined2728Tax)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                new mill rate + bond Y1
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 border border-rose-200 py-5 px-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Two-Year Change
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-rose-700">
                {formatSignedMoney(combinedDelta)}
              </p>
              <p className="text-xs mt-1 font-medium text-rose-600">
                {formatSignedPct(combinedDeltaPct)} vs. FY 2025–26
              </p>
            </div>
          </div>
        </motion.section>

        {/* Caveat */}
        <motion.aside
          className="rounded-2xl border border-slate-300 bg-slate-100/70 p-5 sm:p-6 text-sm text-slate-700 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <p className="font-semibold text-slate-900 mb-2">
            What this doesn&apos;t include
          </p>
          <p>
            These figures do <span className="font-semibold">not</span> include
            any further increases in the town or school operating budgets. In
            FY 2026–27, the Board of Finance cut the proposed town budget from{' '}
            <span className="font-semibold">+12.29%</span> down to{' '}
            <span className="font-semibold">+3.80%</span>. That level of
            cutting may not be possible in FY 2027–28. The Region 15 ADM
            formula also reset Middlebury&apos;s share of the FY 2026–27
            increase to roughly <span className="font-semibold">10%</span>{' '}
            (against its 33.13% standing obligation); this is a one-year
            outcome and is not guaranteed to recur.
          </p>
        </motion.aside>

        {/* About the Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <AboutTheNumbers />
        </motion.div>
      </div>
    </main>
  );
}
