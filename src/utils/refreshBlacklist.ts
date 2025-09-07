import initializeRedisClient from "../config/redis.client";

// blacklist key prefix
const BLACKLIST_PREFIX = "blacklist:refresh:";

// Add token to blacklist until it expires
export const blacklistRefreshToken = async (token: string, exp: number) => {
  const client = await initializeRedisClient();

  // exp is token expiration timestamp (unix)
  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await client.set(`${BLACKLIST_PREFIX}${token}`, "true", { EX: ttl });
  }
};

// Check if token is blacklisted
export const isRefreshTokenBlacklisted = async (token: string) => {
  const client = await initializeRedisClient();
  const result = await client.get(`${BLACKLIST_PREFIX}${token}`);
  return !!result;
};
