import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Strict cap on the public feedback endpoint — it triggers an outbound email
// every successful call, so abuse here costs both money and inbox quota.
export const feedbackRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1h"),
  analytics: true,
});
