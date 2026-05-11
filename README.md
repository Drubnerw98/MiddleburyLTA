# MiddleburyTaxpayers

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
- **Tax Impact Calculator** lets a homeowner enter their prior and new
  assessments (or use the town-average increase to estimate the prior
  value), then shows the FY 2026–27 revaluation impact and the FY 2027–28
  bond impact layered on top.
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

If the user does not have their pre-reval tax bill handy, a "use the town
average" checkbox derives the prior assessment as
`newAssessment / (1 + 0.354)`.

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

- **Next.js 15** (App Router, Turbopack, server actions)
- **React 19**, **TypeScript**, **Tailwind v4**
- **Firebase** (Auth + Firestore + Storage), with `firebase-admin` for
  server-side privileged ops
- **Upstash Redis** for rate limiting (`@upstash/ratelimit`)
- **Resend** for the contact-form email
- **Radix UI** for the accessible slider
- **Framer Motion** for entrance animations
- Deployed on **Vercel**

## Project layout

```
src/app/
  page.tsx              landing page (server) -> HomePageClient (post feed)
  tax-impact/           calculator page + slider component
  articles/             external links page (RSC fetch)
  who-we-are/           static About page
  post/[id]/            single post with comments
  admin/                admin dashboard (claim-gated)
  api/
    session/            login/logout: mints + clears the session cookie
    send-feedback/      contact form -> Resend, with rate limit + escape
  actions/              server actions (createCommentAction, etc.)
  components/           UI: Auth/, Comments/, Posts/, Layout/, Admin/
lib/
  firebase.ts           web SDK init (client)
  firebase-admin.ts     admin SDK init (server, lazy)
  auth.ts               session-cookie helpers + admin claim check
  comments.ts           softDeleteComment server action
  editcomments.ts       editCommentContent server action
  rateLimiter.ts        general 5 req / 10s slider
  commentRateLimiter.ts 1 comment / 15s per user
  feedbackRateLimiter.ts 3 emails / hour per IP
  searchPosts.ts        Firestore query for the search bar
firestore.rules         versioned Firestore security rules
storage.rules           Firebase Storage rules (admin-only writes)
scripts/setAdmin.js     grant or revoke the `admin` custom claim on a user
```

## Auth model

- Users sign up and log in with Firebase email + password.
- On login, the client posts the Firebase ID token to `/api/session`. The
  server verifies it and exchanges it for a long-lived **session cookie**
  (5 days), set as `__session` httpOnly + Secure.
- Server actions and API routes call `getCurrentUser()` from `lib/auth.ts`,
  which calls `verifySessionCookie(cookie, true)`. The `true` flag checks
  for revocation.
- Admin status is a Firebase **custom claim** (`admin: true`), not an email
  match. Grant or revoke via `scripts/setAdmin.js`. The server reads the
  claim from the verified session cookie; the client reads it from
  `getIdTokenResult().claims.admin` via the `useIsAdmin` hook.

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
