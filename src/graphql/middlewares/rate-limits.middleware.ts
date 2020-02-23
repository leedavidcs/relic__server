import { IServerContext } from "@/graphql/context";
import { IMiddlewareGenerator } from "graphql-middleware";
import { createRateLimitRule } from "graphql-rate-limit";
import { shield } from "graphql-shield";

const identifyContext = ({ user, koaCtx }: IServerContext) => {
	const userId: Maybe<string> = user?.id;
	const ip: Maybe<string> = koaCtx?.ip;

	const identityKey: string = userId || ip || "";

	return identityKey;
};

const rate = createRateLimitRule({ identifyContext });

export const rateLimits: IMiddlewareGenerator<any, IServerContext, any> = shield({
	Query: {
		stockPortfolios: rate({ window: "1m", max: 30 })
	},
	Mutation: {
		loginLocalUser: rate({ window: "1m", max: 30 }),
		refreshAccessToken: rate({ window: "1m", max: 30 }),
		registerLocalUser: rate({ window: "1m", max: 1 }),
		resendVerifyEmail: rate({ window: "1m", max: 30 }),
		createStockPortfolio: rate({ window: "1m", max: 30 }),
		updateStockPortfolio: rate({ window: "1m", max: 30 }),
		deleteStockPortfolio: rate({ window: "1m", max: 30 })
	}
});
