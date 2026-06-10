import { describe, expect, test } from "vitest";

import {
  AVG_VALUE_INCREASE,
  bondPeak,
  bondYearOne,
  newAnnualTax,
  oldAnnualTax,
  townAvgOldFromNew,
} from "./constants";

// Every expected value below comes from a documented checkpoint in
// constants.ts (real tax bills, the Phoenix Advisors schedule, the 2026
// ads). If one of these fails, a constant or formula drifted — audit the
// source citations before "fixing" the test.

describe("mill rate math — 10 Yale St checkpoint", () => {
  test("old tax: $165,400 at 32.52 mills = $5,378.81", () => {
    expect(oldAnnualTax(165_400)).toBeCloseTo(5_378.81, 2);
  });

  test("new tax: $242,270 at 26.56 mills = $6,434.69", () => {
    expect(newAnnualTax(242_270)).toBeCloseTo(6_434.69, 2);
  });

  test("delta: +$1,055.88 / +19.63%", () => {
    const oldTax = oldAnnualTax(165_400);
    const delta = newAnnualTax(242_270) - oldTax;
    expect(delta).toBeCloseTo(1_055.88, 2);
    expect((delta / oldTax) * 100).toBeCloseTo(19.63, 1);
  });
});

describe("bond charges — Phoenix Advisors schedule", () => {
  test("year 1: $200,000 → $480", () => {
    expect(bondYearOne(200_000)).toBeCloseTo(480, 2);
  });

  test("year 1: $394,296 → $946.31 (average-Middlebury figure in the 2026 ad)", () => {
    expect(bondYearOne(394_296)).toBeCloseTo(946.31, 2);
  });

  test("year 1: $500,000 → $1,200", () => {
    expect(bondYearOne(500_000)).toBeCloseTo(1_200, 2);
  });

  test("peak: $100,000 → $321", () => {
    expect(bondPeak(100_000)).toBeCloseTo(321, 2);
  });
});

describe("town-average estimate", () => {
  test("reverses the documented 35.4% increase exactly", () => {
    const old = townAvgOldFromNew(394_000);
    expect(old * (1 + AVG_VALUE_INCREASE)).toBeCloseTo(394_000, 6);
  });
});

describe("slider bounds produce sane output", () => {
  test("minimum assessment ($100k)", () => {
    expect(oldAnnualTax(100_000)).toBeCloseTo(3_252, 2);
    expect(newAnnualTax(100_000)).toBeCloseTo(2_656, 2);
    expect(bondYearOne(100_000)).toBeCloseTo(240, 2);
  });

  test("maximum assessment ($5M)", () => {
    expect(oldAnnualTax(5_000_000)).toBeCloseTo(162_600, 0);
    expect(newAnnualTax(5_000_000)).toBeCloseTo(132_800, 0);
    expect(bondYearOne(5_000_000)).toBeCloseTo(12_000, 0);
  });
});
