import app from "./app";
import { config } from "./config";
import { ensureBloom } from "./config/bloom.redis";
import initializeRedisClient from "./config/redis.client";
import { connectToDatabase } from "./prisma/client";
import logger from "./utils/logger";

async function startServer() {
  await connectToDatabase();
  await initializeRedisClient();
  await ensureBloom();
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

startServer();
