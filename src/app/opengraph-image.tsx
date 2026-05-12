import { ImageResponse } from "next/og";

// Open Graph + Twitter card image. Next.js will serve this as
// /opengraph-image at build time and reference it from any page that
// uses the root metadata's openGraph object.

export const runtime = "edge";
export const alt = "Middlebury Taxpayers — 2025 revaluation + 2026 new schools impact.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
    paper: "#F7F3EA",
    ink: "#0B1726",
    inkSoft: "#1E2A3C",
    oxblood: "#9F2B2B",
    muted: "#6B6256",
    rule: "#E2D8C5",
};

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.paper,
                    display: "flex",
                    flexDirection: "column",
                    padding: "80px 96px",
                    position: "relative",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                }}
            >
                {/* Oxblood accent rule */}
                <div
                    style={{
                        position: "absolute",
                        top: 80,
                        left: 96,
                        width: 56,
                        height: 4,
                        backgroundColor: COLORS.oxblood,
                    }}
                />

                {/* Eyebrow */}
                <div
                    style={{
                        marginTop: 28,
                        fontSize: 22,
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 700,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        color: COLORS.oxblood,
                    }}
                >
                    Middlebury Taxpayers
                </div>

                {/* Headline */}
                <div
                    style={{
                        marginTop: 48,
                        fontSize: 104,
                        lineHeight: 1.05,
                        letterSpacing: -1.5,
                        fontWeight: 600,
                        color: COLORS.ink,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <span>Your property tax,</span>
                    <span>reshaped twice.</span>
                </div>

                {/* Sub */}
                <div
                    style={{
                        marginTop: 40,
                        fontSize: 30,
                        lineHeight: 1.45,
                        color: COLORS.inkSoft,
                        fontFamily: "Helvetica, Arial, sans-serif",
                        maxWidth: 900,
                    }}
                >
                    The 2025 revaluation moved your bill. The $224M for 2 new
                    schools in Region 15 will move it again starting FY 2027&ndash;28.
                </div>

                {/* Footer URL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 64,
                        left: 96,
                        right: 96,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: `1px solid ${COLORS.rule}`,
                        paddingTop: 24,
                    }}
                >
                    <div
                        style={{
                            fontSize: 22,
                            color: COLORS.muted,
                            fontFamily: "Helvetica, Arial, sans-serif",
                        }}
                    >
                        Calculate your home&rsquo;s impact.
                    </div>
                    <div
                        style={{
                            fontSize: 22,
                            color: COLORS.ink,
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            letterSpacing: 1,
                        }}
                    >
                        middleburytaxpayers.com
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}
