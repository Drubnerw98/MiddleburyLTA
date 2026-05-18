# MiddleburyTaxpayers

Production Next.js 15 + Firebase site for a civic-advocacy group with real
users. Includes a tax-impact calculator with cited numeric constants,
edge-middleware-gated admin, Zod-validated server actions, and
session-cookie auth with explicit revocation on logout.

Public-facing site for Middlebury Taxpayers, the resident group tracking
how the 2025 revaluation and the $224M Region 15 school bond affect
Middlebury property tax bills. The site hosts a calculator that estimates
the personal impact, an "About the Numbers" facts list, curated press
coverage, and a community discussion area.

Live at <https://middleburytaxpayers.com>.

## What's here

- **Landing page** opens with the post-revaluation reality, the FY 2026–27
  town budget, and the $224M Region 15 school bond, then explains why the
  commercial tax base matters with linked source documents.
- **Tax Impact Calculator** asks for a homeowner's prior and new
  assessments (both required) and shows the FY 2026–27 revaluation
  impact plus the FY 2027–28 bond impact layered on top. A demoted
  opt-in checkbox below the inputs can estimate the prior assessment
  from the town-average +35.4% increase when the actual figure isn't
  handy; results in that mode carry a visible warning pointing back to
  Vision for the exact number.
- **About the Numbers** is a flat facts list that admins can update
  through the dashboard. Anchored on FY 2026–27 figures.
- **Articles & Links** is a curated set of external coverage and source
  documents, grouped by publication.
- **Posts and comments** support community discussion with auth-gated
  posting and admin moderation.
- **Admin dashboard** manages posts, comments, the About copy, the link
  list, and site settings. Gated by a Firebase custom claim, not an email
  allowlist.

## Tax calculator methodology

The calculator centralizes every numeric constant in
`src/app/tax-impact/constants.ts`, and every constant cites its source in
a comment. The headline inputs:

| Constant            | Value | Source                                             |
| ------------------- | ----- | -------------------------------------------------- |
| `OLD_MILL_RATE`     | 32.52 | FY 2025–26, set by the Board of Finance May 2025   |
| `NEW_MILL_RATE`     | 26.56 | FY 2026–27, set by the Board of Finance May 2026   |
| `BOND_Y1_PER_100K`  | 240   | Phoenix Advisors amortization schedule, March 2026 |
| `BOND_PEAK_PER_100K`| 321   | Same source. Peak ca. FY 2032–33                   |
| `AVG_VALUE_INCREASE`| 0.354 | October 2025 reval, 3,097 residential homes        |

> Note on the mill rate: the 2026 ad PDFs say "26.46" in body text but
> compute every dollar figure inside the same ads with 26.56. The "26.46"
> is a typo. 26.56 is the source of truth and is cross-verified against
> the published 764 Southford Road numbers ($81,354 / $3,063,060 = 26.559).

The math, in one place:

```
oldTax        = oldAssessment × 32.52 / 1000        // FY 2025–26
newTax        = newAssessment × 26.56 / 1000        // FY 2026–27
bondY1        = (newAssessment / 100_000) × 240     // FY 2027–28 onward
totalFY27_28  = newTax + bondY1
```

Both inputs are required; the results section is gated until both
fields hold valid numbers. An opt-in checkbox below the inputs (off
by default) can derive the prior assessment as
`newAssessment / (1 + 0.354)` when the homeowner can't find their
prior figure. When that path is used, the results show a warning
callout pointing back to Vision for the exact number — see the
`10 Yale St` checkpoint in `src/app/tax-impact/constants.ts` for the
reason the auto-estimate is no longer the default.

Linear scaling is correct for Connecticut property tax math: a single
mill rate is applied to a uniform-ratio assessment, so doubling the
assessed value doubles the tax bill. The calculator never invents a
non-linear curve.

**Numeric checkpoints (verify after any constant change):**

| New assessment | Year-1 bond charge |
| -------------- | ------------------ |
| $200,000       | $480               |
| $394,296       | $946.31            |
| $500,000       | $1,200             |

To update for a future revaluation or rate change, edit
`src/app/tax-impact/constants.ts` and re-run the checkpoints.

## Tech

- **Next.js 15** (App Router, Turbopack, server actions, edge
  middleware)
- **React 19**, **TypeScript**, **Tailwind v4** with CSS-based `@theme`
  tokens
- **Source Serif 4** + **Inter** loaded via `next/font/google` as the
  display + body type pairing
- **Firebase** (Auth + Firestore + Storage), with `firebase-admin` for
  server-side privileged ops
- **Zod** for boundary validation on every server action + API route
- **Upstash Redis** for rate limiting (`@upstash/ratelimit`)
- **Resend** for the contact-form email
- **Radix UI** for the accessible slider (`@radix-ui/react-slider`) and
  modal primitives (`@radix-ui/react-dialog`)
- **Framer Motion** for modal entrance/exit animations
- Deployed on **Vercel**

## Design system

Editorial-civic. Serif display typography, restrained four-color
palette, primitive components composed at the page level instead of
raw Tailwind utilities scattered across surfaces. The system is
defined in two places:

- `src/app/globals.css` registers the design tokens in a Tailwind v4
  `@theme` block: `--color-ink`, `--color-paper`, `--color-bone`,
  `--color-oxblood`, `--color-moss`, `--color-rule`, `--color-muted`
  plus `--font-sans` / `--font-serif` mapped to the loaded fonts.
  Base rules (html, body, *, a) live inside `@layer base` so utility
  classes can override them.
- `src/app/components/ui/` exports the primitives: `Eyebrow`,
  `DisplayHeading`, `Lead`, `StatCard`, `Pullquote`, `Callout`,
  `SourceLine`, `BarCompare`. Each owns its own type + spacing so
  pages stay declarative.

The site is intentionally photography-light: typography and data
visualizations carry the pages. Image attributions live in
`public/images/ATTRIBUTION.md`.

## Project layout

```
next.config.ts          CSP + security headers (HSTS, X-Frame-Options,
                        Permissions-Policy, Referrer-Policy)
src/middleware.ts       edge middleware: gates /admin/* on the
                        __session cookie before the layout renders
src/app/
  page.tsx              landing page -> HeroSection + AdsSection
  HomePageClient.tsx    posts feed renderer (used by /updates)
  layout.tsx            root layout: fonts, NavBar, Footer, metadata
  globals.css           @theme tokens, @layer base rules, markdown
  tax-impact/
    page.tsx            calculator page
    constants.ts        all tax math: mill rates, bond rates, pure fns,
                        cited sources, numeric checkpoints
    AssessmentInput.tsx slider + numeric-edit input (number | null)
    TaxImpactSlider.tsx Radix-based assessment slider
  articles/             external links page (RSC, reads via adminDb)
  who-we-are/           About page with Drubner / Atlantic / Murtha bios
  updates/              posts feed (HomePageClient)
  post/[id]/            single post with comments (RSC + client island)
  admin/                admin dashboard (claim-gated)
  api/
    session/            login/logout: mints + clears the session cookie
    send-feedback/      contact form -> Resend, lazy-instantiated
  actions/              server actions: createCommentAction,
                        adminLinkActions, adminAboutAction,
                        adminSettingsAction, adminCommentAction,
                        adminPostAction. All run getUserIfAdmin()
                        and parse input with Zod before writing
                        via adminDb.
  components/
    ui/                 editorial-civic primitives (Eyebrow,
                        DisplayHeading, Lead, StatCard, Pullquote,
                        Callout, SourceLine, BarCompare)
    HeroSection.tsx     landing-page hero (typography-led)
    AdsSection.tsx      "Our 2026 ads" landing-page block
    AboutTheNumbers.tsx editorial blocks of 2026 facts
    AnimatedModal.tsx   Radix Dialog + Framer Motion entrance
    Posts/PostControls.tsx server actions for create/edit/delete post
                          (lives next to the editor UI because of the
                          FormData + image-upload coupling)
    Layout/             NavBar + Footer
    Auth/, Comments/, Posts/, Admin/  feature-scoped UI
lib/
  firebase.ts           web SDK init (client; do NOT use server-side,
                        GRPC Listen stream is unreliable in serverless)
  firebase-admin.ts     admin SDK init (server, lazy proxy)
  auth.ts               session-cookie helpers + getUserIfAdmin()
  rateLimiter.ts        general 5 req / 10s slider
  commentRateLimiter.ts 1 comment / 15s per user
  feedbackRateLimiter.ts per-IP (3/hour) + global circuit breaker
                        (50/hour) for /api/send-feedback
docs/
  followups.md          deferred / open project-scoped work
public/
  favicon.svg           wordmark "MT" favicon (serif on paper)
  images/
    ATTRIBUTION.md      image licensing record
  docs/                 publicly linked PDFs (ads, source docs)
firestore.rules         allow read: if true on the public collections;
                        allow write: if false site-wide (server
                        actions are the only write path)
storage.rules           Firebase Storage rules (admin-only writes)
scripts/setAdmin.js     grant or revoke the `admin` custom claim on a user
```

## Auth model

- Users sign up and log in with Firebase email + password.
- On login, the client posts the Firebase ID token to `/api/session`. The
  server verifies it and exchanges it for a long-lived **session cookie**
  (5 days), set as `__session` httpOnly + Secure.
- On logout, `DELETE /api/session` calls `revokeRefreshTokens()` before
  clearing the cookie so a stolen cookie is invalidated within one
  request cycle instead of remaining valid for the full 5-day window.
- Server actions and API routes call `getCurrentUser()` from `lib/auth.ts`,
  which calls `verifySessionCookie(cookie, true)`. The `true` flag checks
  for revocation.
- Admin status is a Firebase **custom claim** (`admin: true`), not an email
  match. Grant or revoke via `scripts/setAdmin.js`. The server reads the
  claim from the verified session cookie; the client reads it from
  `getIdTokenResult().claims.admin` via the `useIsAdmin` hook.
- **All admin writes flow through server actions** in `src/app/actions/`
  (and `src/app/components/Posts/PostControls.tsx` for posts). Each
  action runs `getUserIfAdmin()` at the top, validates input with Zod
  (URL allowlist, length caps, MIME allowlist for uploads), then writes
  via `adminDb`. `firestore.rules` is `allow write: if false` site-wide —
  the rules are a safety net, not the primary gate.
- The `/admin` route is also gated by edge middleware (`src/middleware.ts`)
  that redirects unauthenticated requests to `/` before the layout
  renders, killing the auth-flash.

## Local development

```bash
nvm use                       # picks up .nvmrc
npm install
cp .env.example .env.local    # then fill in values (see below)
npm run dev                   # http://localhost:3000
```

Useful scripts:

```bash
npm run typecheck             # tsc --noEmit
npm run lint                  # next lint
npm run build                 # production build
npm run format                # prettier --write .
```

## Environment variables

| Variable                                   | Where it's used    | Notes                                       |
| ------------------------------------------ | ------------------ | ------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | client             | Web SDK config; public by design            |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | client             | "                                           |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | client + server    | "                                           |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | client + admin SDK | Read at admin-init time too                 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | client             | "                                           |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | client             | "                                           |
| `FIREBASE_SERVICE_ACCOUNT_KEY`             | **server only**    | Full service-account JSON on one line       |
| `UPSTASH_REDIS_REST_URL`                   | server             | Rate limiting backend                       |
| `UPSTASH_REDIS_REST_TOKEN`                 | server             | "                                           |
| `RESEND_API_KEY`                           | server             | Contact-form email                          |
| `FEEDBACK_TO_EMAIL` (optional)             | server             | Defaults to `mta.admn@gmail.com`            |
| `FEEDBACK_FROM_EMAIL` (optional)           | server             | Defaults to `notifications@...`             |

`.env.local` is git-ignored. Anything prefixed `NEXT_PUBLIC_` ends up in
the client bundle, so never put secrets behind that prefix.

## Granting admin

```bash
FIREBASE_SERVICE_ACCOUNT_KEY="$(cat path/to/service-account.json)" \
  node scripts/setAdmin.js you@example.com

# revoke
FIREBASE_SERVICE_ACCOUNT_KEY="$(cat ...)" \
  node scripts/setAdmin.js you@example.com --revoke
```

The user has to log out and back in for the new claim to appear in their
token.

## Deployment

Pushes to `main` deploy via Vercel. Set every variable from the table above
in the Vercel project's Environment Variables panel. For
`FIREBASE_SERVICE_ACCOUNT_KEY`, paste the full JSON contents; Vercel handles
escaping the embedded newlines correctly.

Firestore and Storage rules ship from this repo. Deploy them with the
Firebase CLI when they change:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Author

Built and maintained by **Will Drubner**. Source at
<https://github.com/Drubnerw98/MiddleburyLTA>.
