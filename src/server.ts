import app from "./app";
import { config } from "./config";
import { connectToDatabase } from "./prisma/client";

async function startServer() {
  await connectToDatabase();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

startServer();
