import { createClient } from "redis";
import logger from "../utils/logger";

let redisClient: ReturnType<typeof createClient> | null = null;
const redisHost = process.env.NODE_ENV === "development" ? "redis" : "localhost";
const redisUrl = `redis://${redisHost}:6379`;

const initializeRedisClient = async (): Promise<ReturnType<typeof createClient>> => {
  if (!redisClient) {
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error", err);
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });
    redisClient.on("reconnecting", () => {
      logger.info("Redis reconnecting");
    });

    try {
      await redisClient.connect();
    } catch (err) {
      logger.error("Failed to connect to Redis:", err);
      throw err;
    }
  }

  return redisClient;
};

export default initializeRedisClient;
