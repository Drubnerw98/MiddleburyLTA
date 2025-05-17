import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📨 Incoming feedback:", body);

    const { name, email, message } = body;

    if (!name || !email || !message) {
      console.log("❌ Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: "Middlebury Feedback <notifications@middleburytaxpayers.com>",
      to: ["mta.admn@gmail.com"],
      replyTo: email, // ✅ Correct casing
      subject: `📝 New Feedback from ${name}`,
      html: `
    <h2>New Feedback Submitted</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
  `,
    });

    console.log("✅ Resend response:", response);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
