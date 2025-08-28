import express, { Express, Request, Response } from "express";
import status from "http-status";
import dotenv from "dotenv";
import notFound from "./middleware/notFound";
import router from "./route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import applySecurityMiddleware from "./middleware/security";

dotenv.config();
const app: Express = express();

app.use(express.json());
applySecurityMiddleware(app);


app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    message: "Hello World!",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
