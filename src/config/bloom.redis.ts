import logger from "../utils/logger";
import initializeRedisClient from "./redis.client";

export const BLOOM_KEY = "users_bloom";
export const BLOOM_CAPACITY = 100_000; 
export const BLOOM_ERROR_RATE = 0.01;

export async function ensureBloom() {
  const redis = await initializeRedisClient();
  const exists = await redis.exists(BLOOM_KEY); 

  if (!exists) {
    await redis.sendCommand(["BF.RESERVE", BLOOM_KEY, String(BLOOM_ERROR_RATE), String(BLOOM_CAPACITY)]);
    logger.info(`Bloom filter created: ${BLOOM_KEY}`);
  } else {
    logger.info(`Bloom filter already exists: ${BLOOM_KEY}`);
  }
}
