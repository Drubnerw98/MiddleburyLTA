'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import AssessmentInput from './AssessmentInput';
import { buildShareQuery, parseAssessmentParam } from './urlState';
import AboutTheNumbers from '@/app/components/AboutTheNumbers';
import {
  AVG_VALUE_INCREASE,
  BOND_Y1_PER_100K,
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
  // Both inputs start empty. The user has to enter their actual numbers
  // from Vision before any results render. Auto-estimating from the
  // town-average understates the impact for homes that appreciated
  // above the 35.4% average; see the 10 Yale St checkpoint in
  // constants.ts.
  const [newAssessment, setNewAssessment] = useState<number | null>(null);
  const [manualOldAssessment, setManualOldAssessment] = useState<number | null>(null);
  const [useTownAvg, setUseTownAvg] = useState(false);

  // Derive prior assessment only when the user has explicitly opted into
  // the town-average shortcut AND given us a new assessment to derive from.
  const derivedOldAssessment =
    useTownAvg && newAssessment !== null
      ? Math.round(townAvgOldFromNew(newAssessment))
      : null;

  const oldAssessment = useTownAvg ? derivedOldAssessment : manualOldAssessment;

  const hasResults = newAssessment !== null && oldAssessment !== null;

  // Restore state from a shared link on first mount. Read from
  // window.location instead of useSearchParams so this client page
  // doesn't need a Suspense boundary.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedNew = parseAssessmentParam(params.get('new'));
    if (sharedNew !== null) setNewAssessment(sharedNew);
    if (params.get('avg') === '1') {
      setUseTownAvg(true);
    } else {
      const sharedPrior = parseAssessmentParam(params.get('prior'));
      if (sharedPrior !== null) setManualOldAssessment(sharedPrior);
    }
  }, []);

  // Mirror current inputs into the URL so the address bar is always a
  // shareable link. replaceState keeps Back/Forward history clean.
  useEffect(() => {
    const query = buildShareQuery(newAssessment, manualOldAssessment, useTownAvg);
    window.history.replaceState(null, '', `${window.location.pathname}${query}`);
  }, [newAssessment, manualOldAssessment, useTownAvg]);

  // Results render below the fold; without a cue, entering numbers
  // appears to do nothing. Scroll to them when they first appear.
  const resultsRef = useRef<HTMLDivElement>(null);
  const hadResults = useRef(false);
  useEffect(() => {
    if (hasResults && !hadResults.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      resultsRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    hadResults.current = hasResults;
  }, [hasResults]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied — it opens with your numbers filled in.');
    } catch {
      toast.error('Could not copy. Copy the address bar URL instead.');
    }
  };

  return (
    <main className="bg-paper min-h-screen">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <Eyebrow tone="oxblood">The Calculator</Eyebrow>
          <DisplayHeading level={1} className="mt-3">
            Your property tax,<br />reshaped twice.
          </DisplayHeading>
          <Lead className="mt-5">
            The October 2025 revaluation already changed your tax bill.
            The $224 million for 2 new schools approved in May
            will change it again starting FY 2027–28. Enter both
            assessments below to see the dollar change for your home.
          </Lead>
        </header>

        {/* Vision lookup */}
        <div className="mb-12 border-l-2 border-ink pl-5 sm:pl-6 py-1">
          <p className="font-sans text-sm font-semibold text-ink">
            Don&apos;t know your assessment figures?
          </p>
          <p className="font-sans text-sm text-ink-soft mt-1 leading-relaxed max-w-[60ch]">
            On your property&apos;s Vision page, scroll to the assessment
            history. You&apos;ll see both your FY 2025–26 and FY 2026–27
            figures listed together. Copy both into the calculator below.
          </p>
          <a
            href="https://gis.vgsi.com/middleburyct"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors w-max"
          >
            Open property lookup ↗
          </a>
        </div>

        {/* Inputs */}
        <section className="bg-bone border border-rule px-6 sm:px-8 py-8 sm:py-10 mb-10">
          <AssessmentInput
            label="Your New Assessment · FY 2026–27"
            helper="From the Vision Appraisal lookup above."
            value={newAssessment}
            onChange={setNewAssessment}
          />

          <div className="mt-8 pt-8 border-t border-rule">
            {useTownAvg ? (
              <div className="space-y-2">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Estimated Prior Assessment · FY 2025–26
                </p>
                <div className="flex justify-between items-baseline gap-3 flex-wrap">
                  <p className="font-sans text-xs text-muted/80 max-w-[40ch]">
                    Derived from your new assessment using the town-average
                    revaluation increase.
                  </p>
                  <p
                    className={`font-serif text-3xl sm:text-4xl font-semibold tabular-nums ${
                      derivedOldAssessment !== null ? 'text-ink' : 'text-rule-strong'
                    }`}
                  >
                    {derivedOldAssessment !== null
                      ? formatMoney(derivedOldAssessment)
                      : '$ —'}
                  </p>
                </div>
              </div>
            ) : (
              <AssessmentInput
                label="Your Prior Assessment · FY 2025–26"
                helper="From your last tax bill, before October 2025."
                value={manualOldAssessment}
                onChange={setManualOldAssessment}
              />
            )}
          </div>
        </section>

        {/* Town-average shortcut, demoted */}
        <label className="flex items-start gap-3 cursor-pointer select-none mb-14 sm:mb-20">
          <input
            type="checkbox"
            checked={useTownAvg}
            onChange={(e) => setUseTownAvg(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ink"
          />
          <span className="font-sans text-xs text-muted leading-relaxed max-w-[60ch]">
            <span className="font-semibold text-ink-soft">
              I don&apos;t have my prior assessment.
            </span>{' '}
            Estimate it from the town-average +
            {(AVG_VALUE_INCREASE * 100).toFixed(1)}% revaluation increase
            (your new assessment ÷ {(1 + AVG_VALUE_INCREASE).toFixed(3)}). Less
            accurate for homes that rose above or below the average; for the
            exact figure, look up your FY 2025–26 assessment on Vision.
          </span>
        </label>

        {/* Results, gated on both inputs populated */}
        {!hasResults ? (
          <div className="border-t border-rule pt-10 mb-16 text-center">
            <Eyebrow tone="muted">Awaiting your numbers</Eyebrow>
            <p className="font-serif text-2xl text-ink-soft mt-4 max-w-[40ch] mx-auto leading-snug">
              Enter both your prior and new assessments to see your
              FY 2026–27 and FY 2027–28 tax impact.
            </p>
          </div>
        ) : (
          <div ref={resultsRef} className="scroll-mt-6">
            <Results
              oldAssessment={oldAssessment!}
              newAssessment={newAssessment!}
              usingTownAvg={useTownAvg}
            />
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
              >
                Copy a link to these numbers
              </button>
            </div>
          </div>
        )}

        {/* About the numbers */}
        <div className="mt-16 sm:mt-20">
          <AboutTheNumbers />
        </div>
      </div>
    </main>
  );
}

type ResultsProps = {
  oldAssessment: number;
  newAssessment: number;
  usingTownAvg: boolean;
};

function Results({ oldAssessment, newAssessment, usingTownAvg }: ResultsProps) {
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
    <>
      {usingTownAvg && (
        <Callout tone="warning" className="mb-10" title="Town-average estimate">
          Your actual prior assessment may have been higher or lower. For
          exact numbers, look up your FY 2025–26 assessment on Vision.
        </Callout>
      )}

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
        <Eyebrow tone="oxblood">Step Two · 2 New Schools</Eyebrow>
        <DisplayHeading level={2} as="h2" className="mt-3">
          The $224M for 2 new schools, year one.
        </DisplayHeading>
        <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch]">
          Voters approved 2 new schools in Region 15 on May 6, 2026. Starting
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
                label: `FY 2027–28  ·  reval + schools Y1`,
                value: combined2728Tax,
                display: formatMoney(combined2728Tax),
                tone: 'up',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Year-1 Schools Charge"
            value={formatMoney(bondY1)}
            caption="per year, FY 2027–28"
            tone="up"
          />
          <StatCard
            label="FY 2027–28 Total Tax"
            value={formatMoney(combined2728Tax)}
            caption="new mill rate + schools Y1"
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
        <span className="font-semibold">+3.80%</span>. That level of
        cutting may not be possible in FY 2027–28. The Region 15 ADM
        formula also reset Middlebury&apos;s share of the FY 2026–27
        increase to roughly <span className="font-semibold">10%</span>,
        against its 33.13% standing obligation; a one-year outcome that
        is not guaranteed to recur.
      </Callout>
    </>
  );
}
