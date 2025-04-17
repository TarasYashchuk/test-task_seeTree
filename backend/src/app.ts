import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import markersRouter from "./routes/markers";
import failureSimulator from "./middleware/failureSimulator";
import errorHandler from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";

const app = express();
app.set("trust proxy", 2);

app.use(requestLogger);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(apiRateLimiter);

app.use(failureSimulator);

app.use("/markers", markersRouter);

app.use(errorHandler);

export default app;
