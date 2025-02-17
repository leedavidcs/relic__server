import { Server } from "@/server";
import { Middleware } from "koa";
import { AuthMiddleware } from "./authentication.middleware";
import { BodyParserMiddleware } from "./body-parser.middleware";
import { LoggerMiddleware } from "./logger.middleware";

export const applyMiddlewares = (server: Server): void => {
	const middlewares: Middleware[] = [LoggerMiddleware, BodyParserMiddleware, AuthMiddleware];

	middlewares.forEach((middleware) => server.app.use(middleware));
};
