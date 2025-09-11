// src/config/bloom.redis.ts
import logger from "../utils/logger";
import initializeRedisClient from "./redis.client";

export const BLOOM_KEY = "users_bloom";
export const BLOOM_CAPACITY = 100_000; // tune to your needs
export const BLOOM_ERROR_RATE = 0.01;  // 1% false positive

export async function ensureBloom() {
  const redis = await initializeRedisClient();
  const exists = await redis.exists(BLOOM_KEY); // returns 1 if key exists

  if (!exists) {
    // Create the bloom filter: BF.RESERVE key error_rate capacity
    // Use sendCommand to call RedisBloom commands
    await redis.sendCommand(["BF.RESERVE", BLOOM_KEY, String(BLOOM_ERROR_RATE), String(BLOOM_CAPACITY)]);
    logger.info(`Bloom filter created: ${BLOOM_KEY}`);
  } else {
    logger.info(`Bloom filter already exists: ${BLOOM_KEY}`);
  }
}
