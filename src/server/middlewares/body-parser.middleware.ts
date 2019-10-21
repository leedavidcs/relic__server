import { Logger } from "@/utils";
import HttpStatus from "http-status-codes";
import { Context, Middleware } from "koa";
import BodyParser from "koa-bodyparser";

export const BodyParserMiddleware: Middleware = BodyParser({
	enableTypes: ["json"],
	jsonLimit: "50mb",
	onerror: (err: Error, ctx: Context) => {
		Logger.error(err);

		ctx.throw(HttpStatus.UNPROCESSABLE_ENTITY, err);
	},
	strict: true
});
