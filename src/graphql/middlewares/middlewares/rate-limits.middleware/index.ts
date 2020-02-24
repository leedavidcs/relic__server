import { IServerContext } from "@/graphql/context";
import { IMiddlewareGenerator } from "graphql-middleware";
import { speedLimits } from "./speed-limits";

const identifyContext = ({ user, koaCtx }: IServerContext) => {
	const userId: Maybe<string> = user?.id;
	const ip: Maybe<string> = koaCtx?.ip;

	const identityKey: string = userId || ip || "";

	return identityKey;
};

export const rateLimits: IMiddlewareGenerator<any, IServerContext, any> = speedLimits(
	{ identifyContext },
	{
		Query: {
			viewer: { window: "1m", max: 1 },
			stockPortfolios: { window: "1m", max: 30 }
		},
		Mutation: {
			loginLocalUser: { window: "1m", max: 30 },
			refreshAccessToken: { window: "1m", max: 30 },
			registerLocalUser: { window: "1m", max: 1 },
			resendVerifyEmail: { window: "1m", max: 30 },
			createStockPortfolio: { window: "1m", max: 30 },
			updateStockPortfolio: { window: "1m", max: 30 },
			deleteStockPortfolio: { window: "1m", max: 30 }
		}
	}
);
