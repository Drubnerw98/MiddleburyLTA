import { describe, expect, test } from 'vitest';

import { ASSESSMENT_MAX, ASSESSMENT_MIN } from './constants';
import { buildShareQuery, parseAssessmentParam } from './urlState';

describe('parseAssessmentParam', () => {
  test('passes through an in-range value', () => {
    expect(parseAssessmentParam('394000')).toBe(394_000);
  });

  test('clamps below-minimum to the floor', () => {
    expect(parseAssessmentParam('5')).toBe(ASSESSMENT_MIN);
  });

  test('clamps above-maximum to the ceiling', () => {
    expect(parseAssessmentParam('99999999')).toBe(ASSESSMENT_MAX);
  });

  test('rejects junk: non-numeric, negative, decimal, empty, missing', () => {
    expect(parseAssessmentParam('abc')).toBeNull();
    expect(parseAssessmentParam('-394000')).toBeNull();
    expect(parseAssessmentParam('394000.5')).toBeNull();
    expect(parseAssessmentParam('')).toBeNull();
    expect(parseAssessmentParam(null)).toBeNull();
    expect(parseAssessmentParam('0')).toBeNull();
    expect(parseAssessmentParam('1e9')).toBeNull();
  });
});

describe('buildShareQuery', () => {
  test('manual prior produces new+prior', () => {
    expect(buildShareQuery(394_000, 291_000, false)).toBe('?new=394000&prior=291000');
  });

  test('town-average produces new+avg and drops prior', () => {
    expect(buildShareQuery(394_000, 291_000, true)).toBe('?new=394000&avg=1');
  });

  test('no new assessment produces empty query', () => {
    expect(buildShareQuery(null, 291_000, false)).toBe('');
  });

  test('new without prior produces new only', () => {
    expect(buildShareQuery(394_000, null, false)).toBe('?new=394000');
  });
});
