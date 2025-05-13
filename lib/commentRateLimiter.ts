import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const commentRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(1, "15s"), // 1 comment every 15s per IP
  analytics: true,
});
