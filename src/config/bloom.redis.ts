import logger from "../utils/logger";
import initializeRedisClient from "./redis.client";

export type BloomConfig = {
  key: string;
  capacity: number;
  errorRate: number;
};

export const BLOOM_FILTERS: BloomConfig[] = [
  {
    key: "users_bloom",
    capacity: 100_000,
    errorRate: 0.01,
  },
  {
    key: "clinics_bloom",
    capacity: 50_000,
    errorRate: 0.01,
  },
  {
    key: "doctors_bloom",
    capacity: 50_000,
    errorRate: 0.01,
  },
  {
    key: "nurses_bloom",
    capacity: 50_000,
    errorRate: 0.01,
  },
];

export async function ensureBloom() {
  const redis = await initializeRedisClient();

  for (const { key, capacity, errorRate } of BLOOM_FILTERS) {
    try {
      const exists = await redis.exists(key);

      if (!exists) {
        // EXPANSION=2 → auto-expand when full
        await redis.sendCommand([
          "BF.RESERVE",
          key,
          String(errorRate),
          String(capacity),
          "EXPANSION",
          "2",
        ]);
        logger.info(`Bloom filter created: ${key}`);
      } else {
        logger.info(`Bloom filter already exists: ${key}`);
      }
    } catch (err) {
      logger.error(`Failed to initialize Bloom filter ${key}`, err);
    }
  }
}
