// Source of truth for all Middlebury tax-impact math. Anywhere a number
// from this file appears in the codebase, it should be imported from here.
// Each constant cites its source so a future editor can audit before
// changing it.

// FY 2025-26 mill rate (pre-revaluation), set by the Board of Finance May 2025.
export const OLD_MILL_RATE = 32.52;

// FY 2026-27 mill rate (post-revaluation), set by the Board of Finance May 2026.
// NOTE: The 2026 ad PDFs say "26.46" in body text but compute every dollar
// figure inside the same ads with 26.56. Proof: 764 Southford published new
// tax $81,354 / new assessment $3,063,060 = 26.559 mills. Old tax
// $211,308 / old assessment $6,497,800 = 32.519 mills (= 32.52). The
// 26.46 figure in the ad copy is a typo; 26.56 is the source of truth.
// Do not "correct" this back to 26.46 without verifying the ad math.
export const NEW_MILL_RATE = 26.56;

// $224M Region 15 school construction bond, approved May 6, 2026.
// Annual tax impact starts FY 2027-28.
// Source: Phoenix Advisors amortization schedule, March 9, 2026.
// Year 1 charge: $240 per $100,000 of assessment.
// Peaks at ~$321 per $100,000 ca. FY 2032-33.
export const BOND_Y1_PER_100K = 240;
export const BOND_PEAK_PER_100K = 321;

// Town-wide revaluation averages, October 2025 (3,097 residential homes).
// Source: Town Assessor's office summary, Spring 2026.
export const AVG_VALUE_INCREASE = 0.354;
export const AVG_TAX_INCREASE = 0.104;

// Slider range for assessment inputs. $100k floor / $5M ceiling covers
// every Middlebury residential assessment with headroom.
export const ASSESSMENT_MIN = 100_000;
export const ASSESSMENT_MAX = 5_000_000;
export const ASSESSMENT_STEP = 1_000;

// Default starting point: town-average new assessment, FY 2026-27.
// Source: Town Assessor's office summary, Spring 2026.
export const DEFAULT_NEW_ASSESSMENT = 394_000;

export function oldAnnualTax(oldAssessment: number): number {
  return (oldAssessment * OLD_MILL_RATE) / 1000;
}

export function newAnnualTax(newAssessment: number): number {
  return (newAssessment * NEW_MILL_RATE) / 1000;
}

/**
 * Year-1 bond charge for a given new assessment.
 * Checkpoints (verified):
 *   $200,000 → $480
 *   $394,296 → $946.31  (matches the average-Middlebury figure in the 2026 ad)
 *   $500,000 → $1,200
 */
export function bondYearOne(newAssessment: number): number {
  return (newAssessment / 100_000) * BOND_Y1_PER_100K;
}

export function bondPeak(newAssessment: number): number {
  return (newAssessment / 100_000) * BOND_PEAK_PER_100K;
}

/**
 * Estimate a homeowner's prior assessment from their new assessment using
 * the town-average 35.4% increase. Used when the homeowner doesn't have
 * their pre-reval tax bill handy. The result is a town-average estimate,
 * not the homeowner's actual prior assessment.
 */
export function townAvgOldFromNew(newAssessment: number): number {
  return newAssessment / (1 + AVG_VALUE_INCREASE);
}
