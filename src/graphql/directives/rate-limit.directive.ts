import { IServerContext } from "@/graphql";
import { AuthClient } from "@/redis";
import { createRateLimitDirective, RedisStore } from "graphql-rate-limit";

export const RateLimitDirective = createRateLimitDirective({
	identifyContext: ({ user, koaCtx }: IServerContext) => {
		const userId: string | null = user && user.id;
		const ip: string | null = koaCtx && koaCtx.ip;

		const identityKey: string = userId || ip || "";

		return identityKey;
	},
	/**
	 * @description Use the auth redis client, since requests are rate-limited by userIds
	 * @author David Lee
	 * @date October 28, 2019
	 */
	store: new RedisStore(AuthClient)
});
