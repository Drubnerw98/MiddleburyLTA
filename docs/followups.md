# Followups

A queue between "noticed it" and "decided what to do about it." Items might become Jira tickets, get fixed inline during related work, or be explicitly abandoned. Triage periodically.

Format: see the user-level `~/.claude/CLAUDE.md` "Followup detection" section.

## Contents

- [Active](#active)
  - [2026-05-11 — Confirm AdsSection placeholder copy against the real ads](#2026-05-11--confirm-adssection-placeholder-copy-against-the-real-ads)
  - [2026-05-11 — Bond-impact explainer page (Work item E, deferred)](#2026-05-11--bond-impact-explainer-page-work-item-e-deferred)
- [Resolved](#resolved)
  - [2026-05-11 — Activate AdsSection once ad PDFs land](#2026-05-11--activate-adssection-once-ad-pdfs-land-resolved)
  - [2026-05-11 — Restructure "Who we are" around the underlying entities](#2026-05-11--restructure-who-we-are-around-the-underlying-entities-resolved)
- [Abandoned](#abandoned)

## Active

### 2026-05-11 — Confirm AdsSection placeholder copy against the real ads

**What:** The titles ("The Harsh Reality", "Closed for Business") and one-line summaries in `AdsSection.tsx` were inferred from the May 11, 2026 brief, not lifted from the actual ad creative. They should be verified against the real ad copy before the section goes live.

**Why noticed:** Brief did not include the verbatim ad text. To avoid stalling the build, placeholders were written that match the brief's framing and the headline figures (Yale Avenue, 764 Southford, 199 Benson, 60-68% commercial drops). Want David or Dan to confirm.

**Anchors:** `src/app/components/AdsSection.tsx` (the `ads` array).

**Open questions:** Final ad titles. Approved one-line summaries.

### 2026-05-11 — Bond-impact explainer page (Work item E, deferred)

**What:** Brief §4-E proposes a dedicated `/bond-impact` page that explains the $224M Region 15 bond mechanics, shows a Year-1 vs. peak table, embeds the Phoenix Advisors amortization PDF, and links back to the calculator from a landing-page CTA card. Not started — flagged as optional in the brief and skipped in the May 11 session in favor of finishing the core refresh.

**Why noticed:** The new calculator covers the Year-1 bond impact, but homeowners may want a deeper "where does this $240 per $100k come from?" reference. Worth doing if the bond is going to be the dominant story for the next 18 months.

**Anchors:** Brief §3.4 (canonical bond facts), `src/app/tax-impact/constants.ts` (`BOND_Y1_PER_100K`, `BOND_PEAK_PER_100K`).

**Shape of work:** New route `src/app/bond-impact/page.tsx`. Static read-only content with a peak-year table. Phoenix Advisors PDF dropped into `public/docs/` and embedded. A `TaxImpactCTA`-shaped card added to the landing page that links to it.

**Open questions:** Does Phoenix Advisors' amortization PDF exist in a shareable form? Do we want a year-by-year chart or just a Year-1 / peak summary?

## Resolved

### 2026-05-11 — Activate AdsSection once ad PDFs land (resolved)

**What:** `src/app/components/AdsSection.tsx` was built but unmounted on May 11 because the two ad PDFs were not yet in `public/docs/`. Same-session resolution: the PDFs were dropped into `public/docs/harsh-reality-may-2026.pdf` and `public/docs/closed-for-business-may-2026.pdf`, the component's `href` values were updated to match, and `<AdsSection />` was mounted in `src/app/page.tsx` below `<HeroSection />`.

**Anchors:** `src/app/components/AdsSection.tsx`, `src/app/page.tsx`, `public/docs/harsh-reality-may-2026.pdf`, `public/docs/closed-for-business-may-2026.pdf`.

### 2026-05-11 — Restructure "Who we are" around the underlying entities (resolved)

**What:** David and Norman Drubner were removed as a named individuals section on `/who-we-are`. In their place, two corporate sections were added: Drubner Equities (David's firm) and Atlantic Management (their industrial development partner), each with a logo and a corporate bio supplied by David. The Murtha Enterprises / Route 188 LLC section was preserved unchanged.

**Anchors:** `src/app/who-we-are/page.tsx`, `public/images/drubner-equities-logo.png`, `public/images/atlantic-management-logo.png`.

## Abandoned

(items move here when explicitly decided against — note the reason in a one-line addendum so the decision is recoverable)
