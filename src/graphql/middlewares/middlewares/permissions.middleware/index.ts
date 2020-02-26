import { IServerContext } from "@/graphql/context";
import { IMiddlewareGenerator } from "graphql-middleware";
import { and, not, shield } from "graphql-shield";
import { doesUserOwnStockPortfolio, isAuthenticated } from "./rules";

const isDebug: boolean = process.env.NODE_ENV !== "production";

export const permissions: IMiddlewareGenerator<any, IServerContext, any> = shield(
	{
		Mutation: {
			loginLocalUser: not(isAuthenticated),
			registerLocalUser: not(isAuthenticated),
			refreshAccessToken: isAuthenticated,
			resendVerifyEmail: isAuthenticated,
			createOneStockPortfolio: isAuthenticated,
			updateOneStockPortfolio: and(isAuthenticated, doesUserOwnStockPortfolio),
			deleteOneStockPortfolio: and(isAuthenticated, doesUserOwnStockPortfolio)
		}
	},
	{
		allowExternalErrors: isDebug,
		debug: isDebug
	}
);
