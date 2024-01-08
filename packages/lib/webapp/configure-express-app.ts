import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/error-handler.js";
import compression from "compression";
import cookieParser from "cookie-parser";
import { setRequestContext } from "./middlewares/set-request-context.js";
import gracefulShutdownHandler from "../utils/graceful-shutdown.js";
import { createGracefulShutdownMiddleware } from "./middlewares/graceful-shutdown.js";
import { logMiddleware } from "./middlewares/log.js";
import { Authenticator } from "./types.js";
import { createAuthenticatorMiddlware } from "./middlewares/auth.js";

export function configureExpress(app: express.Application, authenticator?: Authenticator) {
  app.use(helmet());
  app.use(createGracefulShutdownMiddleware(gracefulShutdownHandler));
  app.use(compression());
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }));
  app.use(cookieParser());
  app.use(logMiddleware);
  app.use(setRequestContext);
  if (authenticator) app.use(createAuthenticatorMiddlware(authenticator));
  app.use(errorHandler); // handle sync errors
}
