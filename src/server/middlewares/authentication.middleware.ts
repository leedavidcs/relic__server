import { getAuthorizedUser } from "@/authentication";
import { IUser } from "@/mongodb";
import { Middleware, ParameterizedContext } from "koa";

export const AuthMiddleware: Middleware = async (
	ctx: ParameterizedContext<any>,
	next: () => Promise<void>
): Promise<void> => {
	const user: IUser | null = null;
	await getAuthorizedUser(ctx);

	/* tslint:disable:no-object-mutation */
	ctx.state.user = user;
	/* tslint:enable:no-object-mutation */

	await next();
};
