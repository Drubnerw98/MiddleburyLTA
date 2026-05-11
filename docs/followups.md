# Followups

A queue between "noticed it" and "decided what to do about it." Items might become Jira tickets, get fixed inline during related work, or be explicitly abandoned. Triage periodically.

Format: see the user-level `~/.claude/CLAUDE.md` "Followup detection" section.

## Contents

- [Active](#active)
  - [2026-05-11 — Confirm AdsSection placeholder copy against the real ads](#2026-05-11--confirm-adssection-placeholder-copy-against-the-real-ads)
  - [2026-05-11 — Bond-impact explainer page (Work item E, deferred)](#2026-05-11--bond-impact-explainer-page-work-item-e-deferred)
  - [2026-05-11 — Reskin posts, auth modals, contact, and admin UI for editorial-civic](#2026-05-11--reskin-posts-auth-modals-contact-and-admin-ui-for-editorial-civic)
  - [2026-05-11 — Remaining 11 low/moderate npm audit advisories](#2026-05-11--remaining-11-lowmoderate-npm-audit-advisories)
- [Resolved](#resolved)
  - [2026-05-11 — SECURITY: rotate Firebase service-account key (leaked in debug session)](#2026-05-11--security-rotate-firebase-service-account-key-leaked-in-debug-session-resolved)
  - [2026-05-11 — Investigate admin-SDK Firestore auth failure on /articles](#2026-05-11--investigate-admin-sdk-firestore-auth-failure-on-articles-resolved)
  - [2026-05-11 — Activate AdsSection once ad PDFs land](#2026-05-11--activate-adssection-once-ad-pdfs-land-resolved)
  - [2026-05-11 — Restructure "Who we are" around the underlying entities](#2026-05-11--restructure-who-we-are-around-the-underlying-entities-resolved)
  - [2026-05-11 — SECURITY: migrate admin Firestore writes to server actions with Zod](#2026-05-11--security-migrate-admin-firestore-writes-to-server-actions-with-zod-resolved)
  - [2026-05-11 — SECURITY: validate post image uploads](#2026-05-11--security-validate-post-image-uploads-resolved)
  - [2026-05-11 — SECURITY: revoke refresh tokens on logout](#2026-05-11--security-revoke-refresh-tokens-on-logout-resolved)
  - [2026-05-11 — SECURITY: harden /api/send-feedback against IP spoofing and CSRF](#2026-05-11--security-harden-apisend-feedback-against-ip-spoofing-and-csrf-resolved)
  - [2026-05-11 — SECURITY: sanitize URLs in markdown and link inputs](#2026-05-11--security-sanitize-urls-in-markdown-and-link-inputs-resolved)
  - [2026-05-11 — SECURITY: add CSP + security headers + /admin middleware](#2026-05-11--security-add-csp--security-headers--admin-middleware-resolved)
  - [2026-05-11 — Convert home, /articles, /post pages to RSC](#2026-05-11--convert-home-articles-post-pages-to-rsc-resolved)
  - [2026-05-11 — Cleanup: dead components, scaffold SVGs, .DS_Store](#2026-05-11--cleanup-dead-components-scaffold-svgs-dsstore-resolved)
  - [2026-05-11 — Modal accessibility: focus trap, ARIA, dialog primitive](#2026-05-11--modal-accessibility-focus-trap-aria-dialog-primitive-resolved)
  - [2026-05-11 — Resolve 29 npm audit vulnerabilities (3 critical, 9 high)](#2026-05-11--resolve-29-npm-audit-vulnerabilities-3-critical-9-high-resolved-down-to-11-lowmoderate)
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

### 2026-05-11 — Reskin posts, auth modals, contact, and admin UI for editorial-civic

**What:** Three pockets of the site still wear the pre-redesign dark navy + yellow palette and look visually disconnected from the editorial-civic surfaces shipped on May 11. (1) Posts/admin components (no live posts yet, admin is claim-gated, so they're invisible to the public for now). (2) The auth modals (`LoginModal`, `RegisterModal`) and `ContactModal` — `bg-[#373F4D]`, `bg-sky-600` buttons, `bg-[#1e2633]` error chips. These are *publicly visible* the moment a user clicks Login / Register / Contact on the navbar, so this is the higher-priority half. (3) `LinkPreview`, `CommentManager`, comment UI — all in the same pocket.

**Why noticed:** Surfaced twice. First during May 11 propagation when grepping for residual `bg-yellow` / `text-yellow-300` references (deferred because no public surfaces depended on it). Second when the user confirmed it post-redesign: "we never upped the look for the rest of the site."

**Anchors:** `src/app/components/Auth/LoginModal.tsx`, `src/app/components/Auth/RegisterModal.tsx`, `src/app/components/About/ContactModal.tsx` (highest-priority — public-facing). Then: `src/app/components/PostManager.tsx`, `src/app/components/PostPreview.tsx`, `src/app/components/Posts/PostDisplay.tsx`, `src/app/components/Posts/PostEdit.tsx`, `src/app/components/Posts/PostControls.tsx`, `src/app/components/LinkPreview.tsx`, `src/app/components/CommentManager.tsx`, `src/app/components/Comments/*`, `src/app/admin/page.tsx`. Reference for the target palette: `src/app/components/HeroSection.tsx`, `src/app/articles/AnimatedArticles.tsx`, `src/app/globals.css` (`@theme` tokens).

**Shape of work:** Three passes, in priority order. (1) **Auth + contact modals** — paper background, ink text, oxblood accent, sans-serif inputs, `bg-ink text-bone` primary buttons. ~30 min. (2) **Public-facing post components** (PostPreview, PostDisplay, LinkPreview) — apply paper / bone / ink / oxblood, lift typography to serif headlines + sans body to match Articles. Tag pills become small oxblood text links instead of yellow-tinted chips. (3) **Admin/editor surfaces** (PostManager, PostEdit, PostControls, CommentManager, admin dashboard) — less aesthetic load, but should at least drop the yellow buttons in favor of bg-ink so the admin feels like the same product.

**Open questions:** Do tagged posts need their own listing/filter UI, or is the search bar enough? Are comments going to stay or be reconsidered? (Comment styling lives in the same neglected pocket.)

### 2026-05-11 — Remaining 11 low/moderate npm audit advisories

**What:** After `npm update` + `npm audit fix` cleared the original 29 → 11. Remaining: 8 low, 3 moderate. All transitive through `firebase-admin` → `@google-cloud/firestore` → `google-gax` → `grpc-js` / `teeny-request` / `tar` / `node-forge` / `jws` / `flatted`. Fixing them via `npm audit fix --force` would downgrade `firebase-admin` to 12.x (breaking) or `next` to 9.x (worse), so left as-is.

**Why noticed:** Remainder of the May 11 dependency audit. Critical/high vulns are all cleared; what's left is the long tail.

**Anchors:** `package.json`, `package-lock.json`. Specifically: `@tootallnate/once`, `node-forge`, `flatted`, `tar`, `jws`, `picomatch`, `postcss` (transitive from next).

**Shape of work:** Watch for upstream releases (firebase-admin 13.10+ would likely pull in fresher transitives). When firebase-admin ships a patch that bumps google-gax, re-run `npm update && npm audit` and most of these should drop. The postcss moderate is gated on a Next.js minor bump (15.6+ when it ships).

## Resolved

### 2026-05-11 — SECURITY: rotate Firebase service-account key (leaked in debug session) (resolved)

**What:** During debugging, a `bash source` of `.env.local` echoed the full `FIREBASE_SERVICE_ACCOUNT_KEY` JSON (including the private key) into the conversation transcript. Resolved same day: user generated a new key in Firebase Console, replaced the value in Vercel env vars, redeployed, and deleted the old key from Service Accounts → Manage permissions. Login + session minting confirmed working on the new key.

**Anchors:** Firebase Console → Project Settings → Service Accounts (project `middlebury-low-tax`), service account `firebase-adminsdk-fbsvc@middlebury-low-tax.iam.gserviceaccount.com`.

### 2026-05-11 — Investigate admin-SDK Firestore auth failure on /articles (resolved)

**What:** Original framing assumed an admin-SDK auth regression, since prod `/articles` after the RSC conversion threw `16 UNAUTHENTICATED` on `adminDb` queries. Diagnostic logging on the *web*-SDK fallback revealed the actual root cause: the Firebase Web SDK cannot reliably reach Firestore from Vercel's serverless runtime — it opens a GRPC `Listen` stream, the connection fails (`@firebase/firestore: GrpcConnection RPC 'Listen' stream error`), the SDK drops into offline mode, and `getDocs` returns an empty snapshot **without throwing**. That's why the page silently said "No articles" even with 13 docs in Firestore and open read rules.

The original `16 UNAUTHENTICATED` from `adminDb` turned out to be the service-account key issue that was rotated separately (see above). Once that landed, switching `/articles` back to `adminDb` (`commit d68d4ab`) fixed it cleanly — admin SDK uses HTTP/REST and works fine in short-lived functions.

**Anchors:** `src/app/articles/page.tsx` (now uses `adminDb` again, with a comment explaining why), `lib/firebase-admin.ts`.

**Takeaway for future RSC work in this repo:** Default to `adminDb` for any server-side Firestore read. The web SDK is a browser/long-lived-Node tool and is not safe to assume works in a serverless RSC even with public reads.




### 2026-05-11 — Activate AdsSection once ad PDFs land (resolved)

**What:** `src/app/components/AdsSection.tsx` was built but unmounted on May 11 because the two ad PDFs were not yet in `public/docs/`. Same-session resolution: the PDFs were dropped into `public/docs/harsh-reality-may-2026.pdf` and `public/docs/closed-for-business-may-2026.pdf`, the component's `href` values were updated to match, and `<AdsSection />` was mounted in `src/app/page.tsx` below `<HeroSection />`.

**Anchors:** `src/app/components/AdsSection.tsx`, `src/app/page.tsx`, `public/docs/harsh-reality-may-2026.pdf`, `public/docs/closed-for-business-may-2026.pdf`.

### 2026-05-11 — Restructure "Who we are" around the underlying entities (resolved)

**What:** David and Norman Drubner were removed as a named individuals section on `/who-we-are`. In their place, two corporate sections were added: Drubner Equities (David's firm) and Atlantic Management (their industrial development partner), each with a logo and a corporate bio supplied by David. The Murtha Enterprises / Route 188 LLC section was preserved unchanged.

**Anchors:** `src/app/who-we-are/page.tsx`, `public/images/drubner-equities-logo.png`, `public/images/atlantic-management-logo.png`.

### 2026-05-11 — SECURITY: migrate admin Firestore writes to server actions with Zod (resolved)

**What:** All admin client-side Firestore writes moved to server actions in `src/app/actions/`. Each action runs `getUserIfAdmin()` at the top, parses with a Zod schema (URL allowlist, length caps, tag count caps), then writes via `adminDb`. Five new actions: `adminLinkActions.ts` (createLinkAction, deleteLinkAction), `adminAboutAction.ts` (saveAboutAction), `adminSettingsAction.ts` (saveSettingsAction), `adminCommentAction.ts` (deleteCommentAsAdminAction), `adminPostAction.ts` (updatePostInlineAction for the /post/[id] inline editor). Client components (`LinkManager`, `AboutEditor`, `SettingsPanel`, `CommentManager`, `post/[id]/page.tsx`) now call these actions instead of `addDoc`/`updateDoc`/`setDoc`/`deleteDoc`. `firestore.rules` tightened to `allow write: if false` across all collections — server actions are the only write path, rules are the safety net.

**Anchors:** `src/app/actions/adminLinkActions.ts`, `adminAboutAction.ts`, `adminSettingsAction.ts`, `adminCommentAction.ts`, `adminPostAction.ts`, `firestore.rules`.

### 2026-05-11 — SECURITY: validate post image uploads (resolved)

**What:** `PostControls.tsx`'s `uploadImageToStorage` now allowlists MIME types (PNG/JPEG/WebP/GIF), caps file size at 2 MB, and builds the storage path from a UUID + the extension derived from the validated MIME — the user-supplied filename is discarded. Returns a user-safe error message on validation failure via a new `UploadError` class. SVG is explicitly excluded (script vector when served from a public bucket).

**Anchors:** `src/app/components/Posts/PostControls.tsx` (`uploadImageToStorage`, `createPostAction`, `editPostAction`).

### 2026-05-11 — SECURITY: revoke refresh tokens on logout (resolved)

**What:** `DELETE /api/session` now reads the session cookie, runs `verifySessionCookie(cookie, true)` to extract `uid`, and calls `revokeRefreshTokens(decoded.sub)` before clearing the cookie. An already-expired or invalid cookie is tolerated (logout still succeeds for the user). Stolen session cookies are invalidated within the next request cycle instead of remaining valid for the full 5-day window.

**Anchors:** `src/app/api/session/route.ts` (DELETE handler), `lib/auth.ts`.

### 2026-05-11 — SECURITY: harden /api/send-feedback against IP spoofing and CSRF (resolved)

**What:** Three changes: (1) Origin allowlist check at the top of POST — anything not in the production / dev origin set returns 403 before any work. (2) Two-layer rate limit: per-IP (3/hour) keyed on `x-real-ip` (Vercel-set) with `x-forwarded-for` fallback, plus a global circuit breaker (50/hour) on a single key that fires regardless of IP attribution. (3) `feedbackRateLimiter.ts` split into `feedbackRatelimit` (per-IP) + `feedbackGlobalRatelimit`, both checked before sending.

**Anchors:** `src/app/api/send-feedback/route.ts`, `lib/feedbackRateLimiter.ts`.

### 2026-05-11 — SECURITY: sanitize URLs in markdown and link inputs (resolved)

**What:** Two paths: (1) `PostDisplay.tsx` now passes `urlTransform={safeUrl}` to ReactMarkdown, which drops any link whose protocol isn't `https`/`http`/`mailto`. Prevents `[click](javascript:...)` becoming a clickable href. (2) Link URLs are validated server-side in `adminLinkActions.createLinkAction` via the same allowlist. Bad URLs are rejected before they hit Firestore.

**Anchors:** `src/app/components/Posts/PostDisplay.tsx` (`safeUrl`), `src/app/actions/adminLinkActions.ts` (`SAFE_URL_SCHEMES`).

### 2026-05-11 — SECURITY: add CSP + security headers + /admin middleware (resolved)

**What:** `next.config.ts` (new) declares site-wide security headers: a CSP allowing only the explicit external services we depend on (Firebase, Vercel Analytics, Google Fonts, Upstash), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, `Strict-Transport-Security` with two-year max-age + preload. `src/middleware.ts` (new) matches `/admin/:path*` and redirects to `/` when the `__session` cookie is absent — kills the layout-flash before the page-level admin guard kicks in.

**Anchors:** `next.config.ts`, `src/middleware.ts`.

### 2026-05-11 — Convert home, /articles, /post pages to RSC (resolved)

**What:** Home page (`src/app/page.tsx`) is now a pure server component — dropped `'use client'`, deleted `PageWrapper` (its only callsite), HeroSection keeps its own client boundary for the ContactModal, AdsSection ships as pure RSC. Home went from 5.41 kB to 4.93 kB First Load JS. `/articles` switched from the client Firestore SDK (`db` from `lib/firebase.ts`) to `adminDb` from `lib/firebase-admin.ts` for its server-side query. `/post/[id]` split: the route file is now an async RSC that fetches post + comments via `adminDb`, calls `notFound()` on missing post, and renders the new `PostPageClient` client island with serialized initial state. The client island still handles all interactivity (edit toggle, comment form, comment list mutations) but doesn't need a useEffect data fetch on mount.

**Anchors:** `src/app/page.tsx`, `src/app/components/PageWrapper.tsx` (deleted), `src/app/articles/page.tsx`, `src/app/post/[id]/page.tsx`, `src/app/post/[id]/PostPageClient.tsx` (new).

### 2026-05-11 — Cleanup: dead components, scaffold SVGs, .DS_Store (resolved)

**What:** Deleted unused files: `src/app/components/Modal.tsx`, `TaxImpactCTA.tsx`, `Layout/AppLayout.tsx`, `PostFeed.tsx`, `lib/searchPosts.ts`, `PageWrapper.tsx`, plus six Next scaffold assets (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, `noise.png`). Footer's internal anchors converted to `next/link`. `.DS_Store` files were already gitignored and untracked — no action needed.

**Anchors:** see deletions in commits `cc6cc06` (cleanup) and the RSC commit.

### 2026-05-11 — Modal accessibility: focus trap, ARIA, dialog primitive (resolved)

**What:** `AnimatedModal.tsx` rewritten on top of `@radix-ui/react-dialog`. Radix handles focus trap, focus restoration, ESC, click-on-overlay, `aria-modal`, `aria-labelledby`, `aria-describedby`, and portal rendering. Framer-motion entrance/exit preserved by passing `motion.div` to Radix's `asChild` on Overlay + Content. Callers (`LoginModal`, `RegisterModal`, `ContactModal`) lost their duplicated ESC handler + modalRef + click-outside checks (~6 lines each). Also fixed a UX bug where clicking on the modal's own padding/background closed it (the previous click-outside check was on the OUTER modal container, not the scrim).

Bonus: `ContactModal` no longer reads `admin/settings.emailNotifications` from the client — that check was misleading anyway (server doesn't honor it, and "off" silently swallowed the message as a fake success). The form just POSTs to `/api/send-feedback`, which has its own server-side gating.

**Anchors:** `src/app/components/AnimatedModal.tsx`, `src/app/components/Auth/LoginModal.tsx`, `src/app/components/Auth/RegisterModal.tsx`, `src/app/components/About/ContactModal.tsx`. New dep: `@radix-ui/react-dialog`.

### 2026-05-11 — Resolve 29 npm audit vulnerabilities (3 critical, 9 high) (resolved, down to 11 low/moderate)

**What:** `npm update` + `npm audit fix` cleared the entire critical/high tier. From 29 vulnerabilities (3 critical, 9 high, 8 moderate, 9 low) down to 11 (0 critical, 0 high, 3 moderate, 8 low). The killed vulns include `next` (DoS + XSS), `fast-xml-parser`, `form-data`, `protobufjs`, `jws`, `node-forge` (high tier), `minimatch`, `picomatch`, `path-to-regexp`, `@modelcontextprotocol/sdk`. The remaining 11 are all transitive through `firebase-admin → @google-cloud/firestore → google-gax`; left as a separate followup since `--force` would mean a firebase-admin major downgrade.

**Anchors:** `package.json`, `package-lock.json` (diff is in the same commit as this entry).

## Abandoned

(items move here when explicitly decided against — note the reason in a one-line addendum so the decision is recoverable)
