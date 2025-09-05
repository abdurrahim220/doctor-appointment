import app from "./app";
import { config } from "./config";
import initializeRedisClient from "./config/redis.client";
import { connectToDatabase } from "./prisma/client";

async function startServer() {
  await connectToDatabase();
  await initializeRedisClient();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

startServer();
