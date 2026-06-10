import { ASSESSMENT_MAX, ASSESSMENT_MIN } from './constants';

// Share-URL state for the calculator: ?new=394000&prior=291000 or
// ?new=394000&avg=1. Parsing clamps exactly like the inputs do, so a
// crafted URL can never render an out-of-bounds number.

export function parseAssessmentParam(raw: string | null): number | null {
  if (raw === null) return null;
  if (!/^\d{1,10}$/.test(raw)) return null;
  const parsed = parseInt(raw, 10);
  if (parsed === 0) return null;
  return Math.max(ASSESSMENT_MIN, Math.min(parsed, ASSESSMENT_MAX));
}

export function buildShareQuery(
  newAssessment: number | null,
  prior: number | null,
  useTownAvg: boolean,
): string {
  if (newAssessment === null) return '';
  const params = new URLSearchParams();
  params.set('new', String(newAssessment));
  if (useTownAvg) {
    params.set('avg', '1');
  } else if (prior !== null) {
    params.set('prior', String(prior));
  }
  return `?${params.toString()}`;
}
