import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { morganLogger } from "./logger";
import ENV from "./env";
import routers from "../routes/index";
import { errorHandler } from "../middlewares/errorHandler";
import { EventTypes } from "./events";
import subscribers from "../subscribers";

const app = express();

// Use helmet JS
app.use(helmet());

// Enable CORS
app.use(cors({ origin: "*" }));

// Use body parser to read JSON payloads
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

// Use morgan logger
app.use(morganLogger);

// Add path to swagger docs
app.use(`${ENV.API_ROOT}/docs`, routers.swaggerRouter);

// Register routes
app.use(`${ENV.API_ROOT}/test`, routers.testRouter);

// Use error handling middleware
app.use(errorHandler);

app.on(EventTypes.SET_RESET_PASSWORD, subscribers.setResetPasswordSubscriber);

export default app;
