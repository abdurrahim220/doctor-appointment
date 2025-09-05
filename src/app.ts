import express, { Application, Express, Request, Response } from "express";
import status from "http-status";
import dotenv from "dotenv";
import morgan from "morgan";
import notFound from "./middleware/notFound";
import router from "./route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import applySecurityMiddleware from "./middleware/security";
import logger from "./utils/logger";

dotenv.config();
const app: Application = express();

app.use(express.json());
applySecurityMiddleware(app as Express);

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    }),
  );
}

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  logger.info("Server is running 🚀");
  logger.info(`Uptime: ${process.uptime()}`);
  res.status(status.OK).json({
    message: "Server is running 🚀",
    uptime: process.uptime(),
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
