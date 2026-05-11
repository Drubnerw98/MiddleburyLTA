import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import {
  feedbackRatelimit,
  feedbackGlobalRatelimit,
} from "../../../../lib/feedbackRateLimiter";

// Resend is constructed inside the handler, not at module load. The
// Resend constructor throws when RESEND_API_KEY is missing, which would
// break `next build` page-data collection in any environment that doesn't
// have the secret (e.g. GitHub Actions CI).

const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL ?? "mta.admn@gmail.com";
const FEEDBACK_FROM =
  process.env.FEEDBACK_FROM_EMAIL ??
  "Middlebury Feedback <notifications@middleburytaxpayers.com>";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Origins allowed to POST to this endpoint. The site origin in prod,
// localhost in dev. Anything else is rejected before the email is sent.
const ALLOWED_ORIGINS = new Set(
  [
    "https://middleburytaxpayers.com",
    "https://www.middleburytaxpayers.com",
    process.env.NODE_ENV !== "production" ? "http://localhost:3000" : null,
    process.env.NODE_ENV !== "production" ? "http://localhost:3030" : null,
  ].filter((origin): origin is string => Boolean(origin)),
);

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Pull the client IP for rate-limit keying. On Vercel the platform sets
// x-real-ip from its own edge, so we prefer that. Fall back to the first
// hop in x-forwarded-for, then to a sentinel — but if we hit the sentinel
// the global ratelimit will still catch abuse.
function getClientIp(h: Headers): string {
  return (
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(req: Request) {
  const h = await headers();

  // CSRF defense: same-site cookie auth is the primary protection, but
  // this endpoint accepts unauthenticated POSTs (it's the contact form),
  // so an explicit Origin allowlist is the only thing standing between
  // a malicious third-party site and our Resend bill.
  const origin = h.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  // Global circuit breaker first — if we're being attacked at scale,
  // this caps total per-deployment spend regardless of per-IP keying.
  const { success: globalAllowed } = await feedbackGlobalRatelimit.limit("global");
  if (!globalAllowed) {
    return NextResponse.json(
      { error: "We're temporarily limiting feedback submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  const ip = getClientIp(h);
  const { success: ipAllowed } = await feedbackRatelimit.limit(`ip:${ip}`);
  if (!ipAllowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const trimName = name.trim();
  const trimEmail = email.trim();
  const trimMessage = message.trim();

  if (!trimName || !trimEmail || !trimMessage) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (trimName.length > MAX_NAME || trimEmail.length > MAX_EMAIL || trimMessage.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }
  if (!EMAIL_RE.test(trimEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const safeName = escapeHtml(trimName);
  const safeEmail = escapeHtml(trimEmail);
  const safeMessage = escapeHtml(trimMessage).replace(/\n/g, "<br/>");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FEEDBACK_FROM,
      to: [FEEDBACK_TO],
      replyTo: trimEmail,
      subject: `New feedback from ${trimName}`,
      html: `
        <h2>New Feedback Submitted</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong><br/>${safeMessage}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
