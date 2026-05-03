import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Strict cap on the public feedback endpoint, since every successful call
// triggers an outbound email. Abuse here costs both money and inbox quota.
export const feedbackRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1h"),
  analytics: true,
});
