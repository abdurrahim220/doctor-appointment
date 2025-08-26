import express, { Express, Request, Response } from "express";
import cors from "cors";
import status from "http-status";
import dotenv from "dotenv";
import notFound from "./middleware/notFound";
import router from "./route";
import globalErrorHandler from "./middleware/globalErrorHandler";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1",router)

app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    message: "",
  });
});

app.use(notFound);
app.use(globalErrorHandler);


export default app;
