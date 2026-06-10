// URL scheme allowlist for any stored URL that gets rendered as an href.
// javascript:/data: URLs are a stored-XSS sink when admin-authored content
// renders to the public. One source of truth — the create-time Zod refine
// and every render site import from here.
export const SAFE_URL_SCHEMES = ["https:", "http:", "mailto:"];

// Returns the URL unchanged if its scheme is allowlisted, else "".
// Empty string makes react-markdown drop the href; plain JSX callers
// should coerce "" to undefined so the anchor renders dead.
export function safeUrl(url: string): string {
  try {
    const parsed = new URL(url, "https://placeholder.invalid/");
    return SAFE_URL_SCHEMES.includes(parsed.protocol) ? url : "";
  } catch {
    return "";
  }
}
