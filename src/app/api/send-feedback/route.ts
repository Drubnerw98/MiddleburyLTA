import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { feedbackRatelimit } from "../../../../lib/feedbackRateLimiter";

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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success: allowed } = await feedbackRatelimit.limit(`feedback:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
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
