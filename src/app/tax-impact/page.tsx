'use client';

import { useState } from 'react';
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
import {
  BarCompare,
  Callout,
  DisplayHeading,
  Eyebrow,
  Lead,
  StatCard,
} from '@/app/components/ui';

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

  const revalTone: 'up' | 'down' | 'neutral' =
    revalDelta > 0 ? 'up' : revalDelta < 0 ? 'down' : 'neutral';

  return (
    <main className="bg-paper min-h-screen">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <Eyebrow tone="oxblood">The Calculator</Eyebrow>
          <DisplayHeading level={1} className="mt-3">
            Your property tax,<br />reshaped twice.
          </DisplayHeading>
          <Lead className="mt-5">
            The October 2025 revaluation already changed your tax bill.
            The $224 million school construction bond approved in May
            will change it again starting FY 2027–28. Enter your new
            assessment to see both.
          </Lead>
        </header>

        {/* Vision lookup */}
        <div className="mb-12 border-l-2 border-ink pl-5 sm:pl-6 py-1">
          <p className="font-sans text-sm font-semibold text-ink">
            Don&apos;t know your new assessment?
          </p>
          <p className="font-sans text-sm text-ink-soft mt-1">
            Look it up on the{' '}
            <a
              href="https://gis.vgsi.com/middleburyct"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oxblood underline underline-offset-4 hover:text-ink transition-colors"
            >
              Middlebury Vision Appraisal site
            </a>
            . Most homeowners search by street address.
          </p>
        </div>

        {/* Inputs */}
        <section className="bg-bone border border-rule px-6 sm:px-8 py-8 sm:py-10 mb-16">
          <AssessmentInput
            label="Your New Assessment · FY 2026–27"
            helper="From the Vision Appraisal lookup above."
            value={newAssessment}
            onChange={setNewAssessment}
          />

          <div className="mt-8 pt-8 border-t border-rule space-y-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useTownAvg}
                onChange={(e) => setUseTownAvg(e.target.checked)}
                className="mt-1 h-4 w-4 accent-ink"
              />
              <span className="font-sans text-sm">
                <span className="font-semibold text-ink">
                  Estimate my prior assessment from the town average
                </span>
                <span className="block text-muted mt-1 leading-[1.55]">
                  Auto-fills your FY 2025–26 assessment as new ÷{' '}
                  {(1 + AVG_VALUE_INCREASE).toFixed(3)} (the town-wide +
                  {(AVG_VALUE_INCREASE * 100).toFixed(1)}% revaluation average).
                  Uncheck to enter the actual figure from your last tax bill.
                </span>
              </span>
            </label>

            {useTownAvg ? (
              <div className="flex justify-between items-baseline border-t border-rule pt-5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Estimated Prior Assessment · FY 2025–26
                </p>
                <p className="font-serif text-2xl sm:text-3xl font-semibold tabular-nums text-ink">
                  {formatMoney(oldAssessment)}
                </p>
              </div>
            ) : (
              <div className="border-t border-rule pt-5">
                <AssessmentInput
                  label="Your Prior Assessment · FY 2025–26"
                  helper="From your last tax bill, before October 2025."
                  value={manualOldAssessment}
                  onChange={setManualOldAssessment}
                />
              </div>
            )}
          </div>
        </section>

        {/* Step 1: Reval impact */}
        <section className="mb-16 sm:mb-20">
          <Eyebrow tone="oxblood">Step One · Revaluation</Eyebrow>
          <DisplayHeading level={2} as="h2" className="mt-3">
            The 2025 reval, applied to your home.
          </DisplayHeading>
          <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch]">
            The mill rate moves from <span className="tabular-nums">{OLD_MILL_RATE}</span> to{' '}
            <span className="tabular-nums">{NEW_MILL_RATE}</span>. Your assessment, not the mill
            rate, drives the change in your bill.
          </p>

          <div className="mt-8 mb-10">
            <BarCompare
              bars={[
                {
                  label: `FY 2025–26  ·  ${OLD_MILL_RATE} mills`,
                  value: oldTax,
                  display: formatMoney(oldTax),
                  tone: 'neutral',
                },
                {
                  label: `FY 2026–27  ·  ${NEW_MILL_RATE} mills`,
                  value: newTax,
                  display: formatMoney(newTax),
                  tone: revalTone,
                },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="FY 2025–26 Tax"
              value={formatMoney(oldTax)}
              caption={`at ${OLD_MILL_RATE} mills`}
            />
            <StatCard
              label="FY 2026–27 Tax"
              value={formatMoney(newTax)}
              caption={`at ${NEW_MILL_RATE} mills`}
            />
            <StatCard
              label="Change"
              value={formatSignedMoney(revalDelta)}
              caption={`${formatSignedPct(revalDeltaPct)} vs. FY 2025–26`}
              tone={revalTone}
            />
          </div>
        </section>

        {/* Step 2: Bond impact */}
        <section className="mb-16 sm:mb-20">
          <Eyebrow tone="oxblood">Step Two · School Bond</Eyebrow>
          <DisplayHeading level={2} as="h2" className="mt-3">
            The $224M school bond, year one.
          </DisplayHeading>
          <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch]">
            Voters approved the Region 15 construction bond on May 6, 2026. Starting
            FY 2027–28, it adds about <span className="tabular-nums">${BOND_Y1_PER_100K}</span>{' '}
            per <span className="tabular-nums">$100,000</span> of assessment in Year 1,
            on top of the new mill rate.
          </p>

          <div className="mt-8 mb-10">
            <BarCompare
              bars={[
                {
                  label: `FY 2025–26  ·  before reval`,
                  value: oldTax,
                  display: formatMoney(oldTax),
                  tone: 'neutral',
                },
                {
                  label: `FY 2026–27  ·  reval only`,
                  value: newTax,
                  display: formatMoney(newTax),
                  tone: 'neutral',
                },
                {
                  label: `FY 2027–28  ·  reval + bond Y1`,
                  value: combined2728Tax,
                  display: formatMoney(combined2728Tax),
                  tone: 'up',
                },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Year-1 Bond Charge"
              value={formatMoney(bondY1)}
              caption="per year, FY 2027–28"
              tone="up"
            />
            <StatCard
              label="FY 2027–28 Total Tax"
              value={formatMoney(combined2728Tax)}
              caption="new mill rate + bond Y1"
            />
            <StatCard
              label="Two-Year Change"
              value={formatSignedMoney(combinedDelta)}
              caption={`${formatSignedPct(combinedDeltaPct)} vs. FY 2025–26`}
              tone="up"
            />
          </div>
        </section>

        {/* Caveat */}
        <Callout title="What this estimate does not include">
          Further increases to the town or school operating budgets. In
          FY 2026–27, the Board of Finance cut the proposed town budget
          from <span className="font-semibold">+12.29%</span> down to{' '}
          <span className="font-semibold">+3.80%</span>; that level of
          cutting may not be possible in FY 2027–28. The Region 15 ADM
          formula also reset Middlebury&apos;s share of the FY 2026–27
          increase to roughly <span className="font-semibold">10%</span>,
          against its 33.13% standing obligation; a one-year outcome that
          is not guaranteed to recur.
        </Callout>

        {/* About the numbers */}
        <div className="mt-16 sm:mt-20">
          <AboutTheNumbers />
        </div>
      </div>
    </main>
  );
}
