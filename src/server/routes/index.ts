import { IUser, UserModel } from "@/mongodb";
import { Server } from "@/server";
import KoaRouter from "@koa/router";
import HttpStatus from "http-status-codes";
import Koa from "koa";

/* tslint:disable:no-object-mutation */
export const applyRoutes = (server: Server): void => {
	const app: Koa = server.app;

	const router: KoaRouter = new KoaRouter();

	router.get(
		"/verifyEmail/:userId",
		async (ctx): Promise<void> => {
			const { userId } = ctx.params;

			const user: IUser | null = await UserModel.findOne({ _id: userId });

			if (user === null) {
				ctx.status = HttpStatus.NOT_FOUND;
				ctx.body = {
					email: null,
					username: null
				};

				return;
			}

			user.emailVerified = true;

			await user.save();

			ctx.redirect("http://google.com");
		}
	);

	app.use(router.routes()).use(router.allowedMethods());
};
/* tslint:enable:no-object-mutation */
