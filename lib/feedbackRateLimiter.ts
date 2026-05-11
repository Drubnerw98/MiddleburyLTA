import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Strict cap on the public feedback endpoint, since every successful call
// triggers an outbound email. Abuse here costs both money and inbox quota.
//
// Two-layer rate limit:
//   - per-IP bucket (3/hour) caps the common case
//   - global circuit-breaker bucket (50/hour, single key) is the
//     last-resort cap when IP attribution breaks (proxy spoofing,
//     direct hits to the runtime, etc.)
//
// Both are enforced — a request must pass both buckets to proceed.

const redis = Redis.fromEnv();

export const feedbackRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1h"),
  analytics: true,
  prefix: "rl:feedback:ip",
});

export const feedbackGlobalRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1h"),
  analytics: true,
  prefix: "rl:feedback:global",
});
