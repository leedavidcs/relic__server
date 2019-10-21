import { Middleware } from "koa";
import Logger from "koa-logger";

export const LoggerMiddleware: Middleware = Logger();
