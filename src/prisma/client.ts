import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export default prisma;

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully!");
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
