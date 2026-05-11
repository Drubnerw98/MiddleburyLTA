import { NextRequest, NextResponse } from "next/server";

// Edge middleware. Runs before the page handler and is the only
// reliable place to redirect unauthed users away from /admin before
// the layout flashes to them. The cookie's cryptographic validity is
// checked inside the page itself via verifySessionCookie(..., true);
// here we just gate on presence so we don't pull the Admin SDK into
// the edge runtime.
const SESSION_COOKIE_NAME = "__session";

export function middleware(req: NextRequest) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("from", "admin");
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
