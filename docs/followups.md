# Followups

A queue between "noticed it" and "decided what to do about it." Items might become Jira tickets, get fixed inline during related work, or be explicitly abandoned. Triage periodically.

Format: see the user-level `~/.claude/CLAUDE.md` "Followup detection" section.

## Contents

- [Active](#active)
  - [2026-05-11 — Confirm AdsSection placeholder copy against the real ads](#2026-05-11--confirm-adssection-placeholder-copy-against-the-real-ads)
  - [2026-05-11 — Bond-impact explainer page (Work item E, deferred)](#2026-05-11--bond-impact-explainer-page-work-item-e-deferred)
  - [2026-05-11 — Reskin posts and admin UI for editorial-civic](#2026-05-11--reskin-posts-and-admin-ui-for-editorial-civic)
  - [2026-05-11 — SECURITY: migrate admin Firestore writes to server actions with Zod](#2026-05-11--security-migrate-admin-firestore-writes-to-server-actions-with-zod)
  - [2026-05-11 — SECURITY: validate post image uploads](#2026-05-11--security-validate-post-image-uploads)
  - [2026-05-11 — SECURITY: revoke refresh tokens on logout](#2026-05-11--security-revoke-refresh-tokens-on-logout)
  - [2026-05-11 — SECURITY: harden /api/send-feedback against IP spoofing and CSRF](#2026-05-11--security-harden-apisend-feedback-against-ip-spoofing-and-csrf)
  - [2026-05-11 — SECURITY: sanitize URLs in markdown and link inputs](#2026-05-11--security-sanitize-urls-in-markdown-and-link-inputs)
  - [2026-05-11 — SECURITY: add CSP + security headers + /admin middleware](#2026-05-11--security-add-csp--security-headers--admin-middleware)
  - [2026-05-11 — Resolve 29 npm audit vulnerabilities (3 critical, 9 high)](#2026-05-11--resolve-29-npm-audit-vulnerabilities-3-critical-9-high)
  - [2026-05-11 — Convert home, /articles, /post pages to RSC](#2026-05-11--convert-home-articles-post-pages-to-rsc)
  - [2026-05-11 — Modal accessibility: focus trap, ARIA, dialog primitive](#2026-05-11--modal-accessibility-focus-trap-aria-dialog-primitive)
  - [2026-05-11 — Cleanup: dead components, scaffold SVGs, .DS_Store](#2026-05-11--cleanup-dead-components-scaffold-svgs-dsstore)
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

### 2026-05-11 — Reskin posts and admin UI for editorial-civic

**What:** Most posts- and admin-scoped components were not touched in the May 11 redesign because there are no live posts yet and the admin dashboard is claim-gated. They still use the pre-redesign dark navy + yellow-300 palette (`bg-[#1e2633]/90`, `border-yellow-400/20`, `text-yellow-300`, `bg-yellow-500`, etc.) and will look visually disconnected the moment a post is published.

**Why noticed:** Surfaced during the editorial-civic propagation when grepping for residual `bg-yellow` / `text-yellow-300` references. Deferred so the public-facing surfaces could ship coherent without blocking on a non-visible feature.

**Anchors:** `src/app/components/PostFeed.tsx`, `src/app/components/PostManager.tsx`, `src/app/components/PostPreview.tsx`, `src/app/components/Posts/PostDisplay.tsx`, `src/app/components/Posts/PostEdit.tsx`, `src/app/components/LinkPreview.tsx`, `src/app/components/CommentManager.tsx`, `src/app/components/Comments/*`, `src/app/admin/page.tsx`.

**Shape of work:** Two passes. (1) Public-facing post components (PostFeed, PostPreview, PostDisplay, LinkPreview) — apply paper / bone / ink / oxblood, lift typography to serif headlines + sans body to match Articles. Tag pills become small oxblood text links instead of yellow-tinted chips. (2) Admin/editor surfaces (PostManager, PostEdit, CommentManager, admin dashboard) — less aesthetic load, but should at least drop the yellow buttons in favor of bg-ink.

**Open questions:** Do tagged posts need their own listing/filter UI, or is the search bar enough? Are comments going to stay or be reconsidered? (Comment styling lives in the same neglected pocket.)

### 2026-05-11 — SECURITY: migrate admin Firestore writes to server actions with Zod

**What:** Several admin surfaces write directly to Firestore from the browser using the Web SDK: `LinkManager.tsx:19` (`addDoc` to `external_links`), `AboutEditor.tsx:29` (`setDoc` to `admin/about`), `SettingsPanel.tsx:27` (`setDoc` to `admin/settings`), `CommentManager.tsx:64` (`updateDoc`/`deleteDoc` on comments), `src/app/post/[id]/page.tsx:117-118` (`updateDoc` on full post from the edit UI). All rely on `firestore.rules` admin-claim enforcement, with zero server-side validation, length caps, or URL sanitization. A compromised admin token = unbounded writes; a future rules bug = wide-open writes. The `external_links` URL field is the worst — it's never validated, so `javascript:` schemes become stored XSS on `/articles`.

**Why noticed:** May 11, 2026 security audit (two independent passes both flagged).

**Anchors:** `src/app/components/LinkManager.tsx`, `src/app/components/AboutEditor.tsx`, `src/app/components/SettingsPanel.tsx`, `src/app/components/CommentManager.tsx`, `src/app/post/[id]/page.tsx`, `src/app/components/LinkPreview.tsx:11-13` (where the unsanitized URL renders), `firestore.rules`.

**What's been considered:** Drub's CLAUDE.md "schema as contract AND validator" rule fits exactly. One Zod schema per write surface gives the same shape on client + server.

**Shape of work:** For each surface: create a server action under `src/app/actions/`, define a Zod schema (URL allowlist `http(s)`/`mailto`, length caps everywhere, tag count caps), call `getUserIfAdmin()` at the top, parse with Zod, then write via `adminDb`. Strip the client-side `addDoc`/`updateDoc`/`setDoc`/`deleteDoc` calls and replace with action invocations. Update `firestore.rules` to deny client writes on `external_links`, `admin/*` (rules become a safety net, not the primary gate).

**Open questions:** Do we keep client SDK writes for comments (where rate-limit-by-uid already runs in `createCommentAction`)? Probably yes — that path is the model the others should follow.

### 2026-05-11 — SECURITY: validate post image uploads

**What:** `PostControls.tsx:22-38` accepts any `File` from the multipart `FormData` and uploads to `post-images/${fileId}-${image.name}` with `public: true` on the storage bucket. No MIME check, no size cap beyond Next's 5 MB body limit, the original filename is interpolated raw into the storage path. A malicious admin (or compromised token) can upload an SVG with embedded scripts, a 4.9 MB file to drive storage cost, or use a crafted filename for path-traversal-adjacent shenanigans.

**Why noticed:** May 11, 2026 security audit.

**Anchors:** `src/app/components/Posts/PostControls.tsx:22-38`, `storage.rules` (currently deny-all, which is correct — the Admin SDK is the upload path).

**Shape of work:** Allowlist `image/png|image/jpeg|image/webp|image/gif`, cap `image.size` at ~2 MB, derive the file extension from the validated MIME (not the user-supplied filename), build the storage path as `post-images/${fileId}.${ext}`. Optional: run the buffer through a tiny `image-size`-style check to confirm magic bytes match the MIME.

### 2026-05-11 — SECURITY: revoke refresh tokens on logout

**What:** `DELETE /api/session` only clears the `__session` browser cookie. It does NOT call `auth.revokeRefreshTokens(uid)`, so a stolen session cookie remains valid for the full 5-day window even after a "Log out" click. Firebase only treats a session as revoked once refresh tokens are revoked server-side.

**Why noticed:** May 11, 2026 security audit.

**Anchors:** `src/app/api/session/route.ts` (`DELETE` handler), `lib/auth.ts:20` (where `checkRevoked: true` is enforced on verification).

**Shape of work:** In `DELETE`, read the session cookie, run `verifySessionCookie(cookie, true)` to extract `uid` (catching expired/invalid), then call `getAdminAuth().revokeRefreshTokens(uid)` before clearing the cookie. Tolerate failures (already-revoked, expired) gracefully — logout should always succeed on the client side.

### 2026-05-11 — SECURITY: harden /api/send-feedback against IP spoofing and CSRF

**What:** The feedback handler keys its rate limiter on `x-forwarded-for.split(',')[0]` (`src/app/api/send-feedback/route.ts:31`) with no validation. On Vercel the platform sets this header, but a direct request to the underlying runtime or any deployment without the right proxy chain lets an attacker rotate IPs per request and bypass the 3/hour cap — every accepted request bills a Resend send and lands in `mta.admn@gmail.com`'s inbox. The handler also has no `Origin` check, so cross-origin POSTs from any other site succeed.

**Why noticed:** May 11, 2026 security audit.

**Anchors:** `src/app/api/send-feedback/route.ts:31`, `lib/feedbackRateLimiter.ts`.

**Shape of work:** (1) Use Next.js's `request.ip` (Edge) or Vercel's `x-real-ip` header for the rate-limit key. (2) Add a global per-deployment circuit-breaker bucket (e.g. 100/hour total) on top of the per-IP bucket so an attacker can't email-bomb even if they break the IP key. (3) Verify `Origin` matches an allowlist (`https://middleburytaxpayers.com`) on every state-changing route; reject mismatches with 403.

### 2026-05-11 — SECURITY: sanitize URLs in markdown and link inputs

**What:** `react-markdown@10` is safe by default (no `rehype-raw`, so raw HTML is stripped), but markdown links are NOT URL-sanitized — `[click](javascript:alert(1))` renders as a clickable XSS sink. Same risk on `external_links.url` (admin-typed URL stored raw, rendered in `LinkPreview.tsx:13` as an anchor `href`). Admin-only today, but the markdown editor goes to a public page (posts) and the URL field renders on `/articles`.

**Why noticed:** May 11, 2026 security audit (also overlaps with admin-write-surface item above).

**Anchors:** `src/app/components/Posts/PostDisplay.tsx:60` (markdown render), `src/app/components/LinkPreview.tsx:13` (link href), `src/app/components/AboutEditor.tsx` (About markdown).

**Shape of work:** Add `rehype-sanitize` to the markdown pipeline (or use ReactMarkdown's `urlTransform` prop with a scheme allowlist). Validate `external_links.url` with a Zod schema that asserts `URL.protocol === 'https:' || === 'http:'` as part of the admin-write refactor.

### 2026-05-11 — SECURITY: add CSP + security headers + /admin middleware

**What:** No `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy` headers are set. Direct hits to `/admin` flash the dashboard layout to unauthenticated users before the client-side check redirects — there's no edge gate. A strict CSP would also serve as defense-in-depth against the residual XSS surfaces above.

**Why noticed:** May 11, 2026 security audit.

**Anchors:** `next.config.ts` (does not exist — needs creating or `next.config.mjs`), missing `src/middleware.ts`, `src/app/admin/page.tsx`.

**Shape of work:** (1) Add `next.config.ts` with `headers()` returning CSP (start with `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live; ...`), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. (2) Add `src/middleware.ts` that runs on `/admin/:path*` and redirects to `/` if no `__session` cookie is present (verify in the route, not the middleware — keep middleware fast).

### 2026-05-11 — Resolve 29 npm audit vulnerabilities (3 critical, 9 high)

**What:** `npm audit` reports 29 vulnerabilities. Critical: `fast-xml-parser` (entity-encoding bypass), `form-data` (unsafe random for boundary), `protobufjs` (arbitrary code execution). High includes `next` (DoS via server components, XSS in App Router) — the most concerning since it's the framework. Plus `jws`, `node-forge`, `minimatch`, `picomatch`, `tar`, `path-to-regexp`, `@modelcontextprotocol/sdk`, `flatted`.

**Why noticed:** May 11, 2026 security audit.

**Anchors:** `package.json`, `package-lock.json`.

**Shape of work:** (1) Bump `next` to `15.5.16+` to clear the Next.js advisories. (2) Run `npm audit fix` for non-breaking transitive fixes. (3) For remaining: identify which are reachable from the actual app (most criticals are likely transitive from `firebase-admin` or build tooling). (4) Run typecheck + build + smoke-test before pushing. Hold the more aggressive `--force` updates until each can be validated individually.

### 2026-05-11 — Convert home, /articles, /post pages to RSC

**What:** Three pages are needlessly client-rendered or use the wrong SDK. (1) `src/app/page.tsx:1` has `'use client'` only to wrap in a framer-motion `PageWrapper`. `HeroSection` already declares its own boundary; `AdsSection` is pure static. The home page (highest-traffic surface) ships unnecessary JS. (2) `src/app/articles/page.tsx:1-4` is an async RSC but imports `db` from the client SDK (`lib/firebase.ts`). Should use `adminDb` from `lib/firebase-admin.ts`. (3) `src/app/post/[id]/page.tsx` fetches post + comments in `useEffect` with no Suspense; should be RSC with a client island for the comment form only.

**Why noticed:** May 11, 2026 code audit.

**Anchors:** `src/app/page.tsx`, `src/app/components/PageWrapper.tsx` (delete after the conversion — only callsite is `page.tsx`), `src/app/articles/page.tsx`, `src/app/post/[id]/page.tsx`.

**Shape of work:** Per page: remove `'use client'` from the route, move client-only pieces (ContactModal, comment form) into their own boundaries. Switch articles to `adminDb`. Replace post-page `useEffect` fetch with server-side fetch + a Suspense boundary around the comments client island.

### 2026-05-11 — Modal accessibility: focus trap, ARIA, dialog primitive

**What:** `LoginModal`, `RegisterModal`, `ContactModal` all lack `role="dialog"`, `aria-modal="true"`, focus trap, and return-focus on close. ESC + click-outside handlers are duplicated across the three (identical 6-line blocks). Each is built on a custom `AnimatedModal` component.

**Why noticed:** May 11, 2026 code audit.

**Anchors:** `src/app/components/AnimatedModal.tsx`, `src/app/components/Auth/LoginModal.tsx`, `src/app/components/Auth/RegisterModal.tsx`, `src/app/components/About/ContactModal.tsx`.

**Shape of work:** Adopt `@radix-ui/react-dialog` (already transitively in the bundle via `@radix-ui/react-slider`). It handles focus trap, ESC, click-outside, ARIA, and return-focus automatically. Drop the custom `AnimatedModal`; preserve the framer-motion entrance by wrapping Radix's `Content` with a `motion.div`.

### 2026-05-11 — Cleanup: dead components, scaffold SVGs, .DS_Store

**What:** Several files have zero callsites and should be deleted per the "delete instead of half-finished" rule: `src/app/components/Modal.tsx` (superseded by AnimatedModal), `src/app/components/TaxImpactCTA.tsx` (no callsites after the redesign), `src/app/components/Layout/AppLayout.tsx`, `src/app/components/PostFeed.tsx` (PostManager has its own list), `lib/searchPosts.ts` (HomePageClient does its own filtering). Plus Next scaffold SVGs in `public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, `noise.png`) — none referenced. `.DS_Store` files are tracked in the repo and should be removed + gitignored. Footer's internal `<a href>` should be `<Link>` for client-side nav.

**Why noticed:** May 11, 2026 code audit.

**Anchors:** files listed above, `.gitignore`, `src/app/components/Layout/Footer.tsx`.

**Shape of work:** Delete the unused files. `git rm --cached` the `.DS_Store` files, ensure `.gitignore` covers them. Convert Footer `<a href>` → `<Link href>`. Single small commit.

## Resolved

### 2026-05-11 — Activate AdsSection once ad PDFs land (resolved)

**What:** `src/app/components/AdsSection.tsx` was built but unmounted on May 11 because the two ad PDFs were not yet in `public/docs/`. Same-session resolution: the PDFs were dropped into `public/docs/harsh-reality-may-2026.pdf` and `public/docs/closed-for-business-may-2026.pdf`, the component's `href` values were updated to match, and `<AdsSection />` was mounted in `src/app/page.tsx` below `<HeroSection />`.

**Anchors:** `src/app/components/AdsSection.tsx`, `src/app/page.tsx`, `public/docs/harsh-reality-may-2026.pdf`, `public/docs/closed-for-business-may-2026.pdf`.

### 2026-05-11 — Restructure "Who we are" around the underlying entities (resolved)

**What:** David and Norman Drubner were removed as a named individuals section on `/who-we-are`. In their place, two corporate sections were added: Drubner Equities (David's firm) and Atlantic Management (their industrial development partner), each with a logo and a corporate bio supplied by David. The Murtha Enterprises / Route 188 LLC section was preserved unchanged.

**Anchors:** `src/app/who-we-are/page.tsx`, `public/images/drubner-equities-logo.png`, `public/images/atlantic-management-logo.png`.

## Abandoned

(items move here when explicitly decided against — note the reason in a one-line addendum so the decision is recoverable)
