import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AVG_HOME_ASSESSMENT,
  BOND_PEAK_PER_100K,
  BOND_Y1_PER_100K,
  bondPeak,
  bondYearOne,
} from '../tax-impact/constants';
import { Callout, DisplayHeading, Eyebrow, Lead, StatCard } from '@/app/components/ui';

export const metadata: Metadata = {
  title: 'The $224M School Bond — Middlebury Taxpayers',
  description:
    'What the Region 15 school bond adds to a Middlebury tax bill, year by year: $240 per $100,000 of assessment in FY 2027–28, peaking near $321 around FY 2032–33.',
};

const formatMoney = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

// The published Phoenix Advisors figures give two anchor points: the
// year-1 charge and the peak. The intervening fiscal years exist in the
// amortization schedule but have not been published per-$100k, so they
// render as pending rows rather than invented numbers.
const SCHEDULE_ROWS: Array<
  | { fy: string; perHundredK: number; note?: string }
  | { fy: string; pending: true }
> = [
  { fy: 'FY 2027–28', perHundredK: BOND_Y1_PER_100K, note: 'first year on tax bills' },
  { fy: 'FY 2028–29', pending: true },
  { fy: 'FY 2029–30', pending: true },
  { fy: 'FY 2030–31', pending: true },
  { fy: 'FY 2031–32', pending: true },
  { fy: 'FY 2032–33', perHundredK: BOND_PEAK_PER_100K, note: 'approximate peak' },
];

const EXAMPLE_ASSESSMENTS = [
  { assessment: 200_000, label: '$200,000 assessment' },
  { assessment: AVG_HOME_ASSESSMENT, label: 'Town-average home' },
  { assessment: 500_000, label: '$500,000 assessment' },
];

export default function BondImpactPage() {
  return (
    <main className="bg-paper min-h-screen">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <Eyebrow tone="oxblood">The School Bond</Eyebrow>
          <DisplayHeading level={1} className="mt-3">
            $224 million,<br />paid by the $100,000.
          </DisplayHeading>
          <Lead className="mt-5">
            Voters approved 2 new Region 15 schools on May 6, 2026. The
            cost reaches Middlebury tax bills starting FY 2027–28 and is
            charged in proportion to your assessment. This page shows the
            mechanics, the published figures, and what they mean for a
            real bill.
          </Lead>
        </header>

        {/* The vote, for context */}
        <div className="mb-14 border-l-2 border-oxblood pl-5 sm:pl-6 py-1">
          <p className="font-serif text-xl sm:text-2xl font-semibold leading-[1.35] text-ink max-w-[46ch]">
            Middlebury voted no, 539 to 648. Southbury&rsquo;s yes carried
            the result — but Middlebury is on the hook for its 33.13% share.
          </p>
          <p className="font-sans text-xs text-muted mt-3">
            Combined town vote: 2,474 Yes – 1,820 No.
          </p>
        </div>

        {/* The formula */}
        <section className="mb-16 sm:mb-20">
          <Eyebrow tone="oxblood">How the charge works</Eyebrow>
          <DisplayHeading level={2} as="h2" className="mt-3">
            One number drives it: your assessment.
          </DisplayHeading>
          <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch] leading-relaxed">
            The bond charge is levied per <span className="tabular-nums">$100,000</span> of
            assessed value, on top of the regular mill rate. In Year 1 that
            is <span className="tabular-nums font-semibold">${BOND_Y1_PER_100K}</span> per{' '}
            <span className="tabular-nums">$100,000</span>; as principal repayment ramps
            up, it peaks near{' '}
            <span className="tabular-nums font-semibold">${BOND_PEAK_PER_100K}</span> around
            FY 2032–33, then falls back over the remaining life of the bond.
          </p>

          <div className="bg-bone border border-rule px-6 sm:px-8 py-6 mt-8">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted mb-2">
              Your formula
            </p>
            <p className="font-serif text-xl sm:text-2xl text-ink tabular-nums">
              (your assessment ÷ $100,000) × ${BOND_Y1_PER_100K}{' '}
              <span className="font-sans text-sm text-muted">= your Year-1 charge</span>
            </p>
          </div>
        </section>

        {/* The curve, honestly drawn from the two published points */}
        <section className="mb-16 sm:mb-20">
          <Eyebrow tone="oxblood">The schedule</Eyebrow>
          <DisplayHeading level={2} as="h2" className="mt-3">
            From $240 to a $321 peak.
          </DisplayHeading>
          <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch] leading-relaxed">
            Charge per <span className="tabular-nums">$100,000</span> of assessment, by
            fiscal year. Two figures are published; the years between them
            are in the Phoenix Advisors amortization schedule and will be
            added here when the per-year breakdown is available.
          </p>

          <div className="mt-8 space-y-4">
            {SCHEDULE_ROWS.map((row) =>
              'pending' in row ? (
                <div key={row.fy}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted/60">
                      {row.fy}
                    </span>
                    <span className="font-sans text-xs text-muted/60 italic">
                      schedule pending
                    </span>
                  </div>
                  <div className="h-2 rounded-sm border border-dashed border-rule-strong/60" />
                </div>
              ) : (
                <div key={row.fy}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {row.fy}
                      {row.note ? `  ·  ${row.note}` : ''}
                    </span>
                    <span
                      className={`font-serif text-lg font-semibold tabular-nums ${
                        row.perHundredK === BOND_PEAK_PER_100K ? 'text-oxblood' : 'text-ink'
                      }`}
                    >
                      ${row.perHundredK} / $100k
                    </span>
                  </div>
                  <div className="h-2 bg-rule rounded-sm overflow-hidden">
                    <div
                      className={`h-full ${
                        row.perHundredK === BOND_PEAK_PER_100K ? 'bg-oxblood' : 'bg-ink'
                      }`}
                      style={{ width: `${(row.perHundredK / BOND_PEAK_PER_100K) * 100}%` }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>

          <p className="font-sans text-xs text-muted mt-6 max-w-[60ch] leading-relaxed">
            After the peak, the per-year charge declines over the remaining
            term of the bond. Exact post-peak years also pend the published
            schedule.
          </p>
        </section>

        {/* What it means for a real bill */}
        <section className="mb-16 sm:mb-20">
          <Eyebrow tone="oxblood">On a real bill</Eyebrow>
          <DisplayHeading level={2} as="h2" className="mt-3">
            Three Middlebury homes.
          </DisplayHeading>
          <p className="font-sans text-sm text-ink-soft mt-3 max-w-[60ch]">
            The published rates applied to three assessment levels. The
            town-average row matches the figures in our May 2026 ads.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule-strong">
                  <th className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-left py-3 pr-4">
                    Home
                  </th>
                  <th className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-right py-3 px-4">
                    Assessment
                  </th>
                  <th className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-right py-3 px-4">
                    Year 1 · FY 2027–28
                  </th>
                  <th className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-right py-3 pl-4">
                    Peak · ca. FY 2032–33
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_ASSESSMENTS.map(({ assessment, label }) => (
                  <tr key={assessment} className="border-b border-rule">
                    <td className="font-sans text-sm text-ink py-4 pr-4">{label}</td>
                    <td className="font-sans text-sm text-ink-soft text-right py-4 px-4 tabular-nums">
                      {formatMoney(assessment)}
                    </td>
                    <td className="font-serif text-lg font-semibold text-ink text-right py-4 px-4 tabular-nums">
                      {formatMoney(bondYearOne(assessment))}/yr
                    </td>
                    <td className="font-serif text-lg font-semibold text-oxblood text-right py-4 pl-4 tabular-nums">
                      {formatMoney(bondPeak(assessment))}/yr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
            <StatCard
              label="Authorized"
              value="$224 million"
              caption="Region 15 — 2 new schools"
            />
            <StatCard
              label="Middlebury's share"
              value="33.13%"
              caption="of Region 15 obligations"
            />
            <StatCard
              label="First tax-bill impact"
              value="FY 2027–28"
              caption="July 2027 bills"
              tone="up"
            />
          </div>
        </section>

        {/* CTA into the calculator */}
        <section className="mb-16 text-center">
          <p className="font-serif text-2xl text-ink-soft max-w-[40ch] mx-auto leading-snug mb-6">
            The bond charge lands on top of your post-revaluation bill.
            See both together for your home.
          </p>
          <Link
            href="/tax-impact"
            className="inline-flex items-center gap-2 bg-ink text-paper font-sans text-sm font-semibold px-7 py-3.5 hover:bg-oxblood transition-colors"
          >
            Run your numbers →
          </Link>
        </section>

        {/* Sources */}
        <Callout title="Sources">
          Year-1 and peak charges: Phoenix Advisors amortization schedule,
          March 9, 2026. Bond authorization and vote totals: Region 15
          referendum, May 6, 2026 (Bee-Intelligencer, May 6, 2026).
          Town-average home figures as published in{' '}
          <a
            href="/docs/harsh-reality-may-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-oxblood hover:text-ink transition-colors"
          >
            our May 2026 ad (PDF)
          </a>
          . The full year-by-year schedule will be added when the per-year
          breakdown is published.
        </Callout>
      </div>
    </main>
  );
}
