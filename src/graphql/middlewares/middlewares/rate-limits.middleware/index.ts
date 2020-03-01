import { IServerContext } from "@/graphql/context";
import { AuthClient } from "@/redis";
import { IMiddlewareGenerator } from "graphql-middleware";
import { RedisStore } from "graphql-rate-limit";
import { speedLimits } from "./speed-limits";

const identifyContext = ({ user, koaCtx }: IServerContext) => {
	const userId: Maybe<string> = user?.id;
	const ip: Maybe<string> = koaCtx?.ip;

	const identityKey: string = userId || ip || "";

	return identityKey;
};

export const rateLimits: IMiddlewareGenerator<any, IServerContext, any> = speedLimits(
	{
		identifyContext,
		/**
		 * @description Use the auth redis client, since requests are rate-limited by userIds
		 * @author David Lee
		 * @date February 25, 2020
		 */
		store: new RedisStore(AuthClient)
	},
	{
		Query: {
			stockPortfolios: { window: "1m", max: 30 }
		},
		Mutation: {
			loginLocalUser: { window: "1m", max: 30 },
			refreshAccessToken: { window: "1m", max: 30 },
			registerLocalUser: { window: "1m", max: 1 },
			resendVerifyEmail: { window: "1m", max: 30 },
			createOneStockPortfolio: { window: "1m", max: 30 },
			updateOneStockPortfolio: { window: "1m", max: 30 },
			deleteOneStockPortfolio: { window: "1m", max: 30 }
		}
	}
);
