# MiddleburyLTA

Public-facing site for the Middlebury Lower Taxes Alliance (MLTA). It
explains why the town's tax base needs new commercial development and gives
homeowners a calculator to estimate the personal impact of two specific
projects that were blocked in 2024.

Live at <https://middleburylowertaxesalliance.com>.

## What's here

- **Landing page** lays out the case for commercial development and links
  to town records (permit fees, commercial assessment rolls, the CT Farm
  Bureau cost-of-services chart).
- **Tax Impact Calculator** is an interactive slider that scales the modeled
  2024 tax bill for the median Middlebury home to your home's value, and
  shows the bill with vs. without the proposed development.
- **Articles & Links** is a curated set of external coverage and source
  documents.
- **Posts and comments** support community discussion with auth-gated
  posting and admin moderation.
- **Admin dashboard** manages posts, comments, the About copy, the link
  list, and site settings. Gated by a Firebase custom claim, not an email
  allowlist.

## Tax calculator methodology

The calculator anchors on a single base case for a $360,000 Middlebury home
in 2024:

| Scenario                | Modeled annual tax bill |
| ----------------------- | ----------------------- |
| Without new development | $11,729                 |
| With new development    | $10,692                 |
| Savings per household   | $1,037 (about 8.84%)    |

The "with development" scenario assumes the two specific projects (Southford
Road and Straits Turnpike) had been built, contributing the new tax revenue
documented in `public/docs/`.

For homes other than $360k, the bill scales linearly:

```
multiplier      = userHomeValue / 360_000
taxWithoutDev   = 11_729 × multiplier
taxWithDev      = 10_692 × multiplier
```

Linear scaling is correct for Connecticut property tax math: a single mill
rate is applied to a uniform-ratio assessment, so doubling the assessed
value doubles the tax bill. As a consequence, **every household sees the
same percentage savings (~8.84%)**. The dollar amount changes with home
value but the rate does not. That's a feature of the model, not a bug.

If the constants need to be updated for a new revaluation or revised
projection, edit them in `src/app/tax-impact/page.tsx`.

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
