import app from "./app";
import { config } from "./config";
import initializeRedisClient from "./config/redis.client";
import { connectToDatabase } from "./prisma/client";
import logger from "./utils/logger";

async function startServer() {
  await connectToDatabase();
  await initializeRedisClient();
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

startServer();
