import { Server } from "@/server";
import KoaRouter from "@koa/router";
import { User } from "@prisma/client";
import HttpStatus from "http-status-codes";

/* tslint:disable:no-object-mutation */
export const applyRoutes = (server: Server): void => {
	const { app } = server;
	const router: KoaRouter = new KoaRouter();

	router.get(
		"/verifyEmail/:userId",
		async (ctx): Promise<void> => {
			const { userId } = ctx.params;
			const { prisma } = server;

			const user: Maybe<User> = await prisma.user.findOne({ where: { id: userId } });

			if (!user) {
				ctx.status = HttpStatus.NOT_FOUND;
				ctx.body = {
					email: null,
					username: null
				};

				return;
			}

			await prisma?.user.update({
				where: { id: userId },
				data: { emailVerified: true }
			});

			ctx.redirect("http://google.com");
		}
	);

	app.use(router.routes()).use(router.allowedMethods());
};
/* tslint:enable:no-object-mutation */
