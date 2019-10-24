import { IFieldResolver, IResolvers } from "graphql-tools";
import { IServerContext } from "../context";
import { AuthenticationMutations } from "./authentication.resolver";
import { ConnectionTypes } from "./connection.resolver";
import {
	StockPortfolioMutations,
	StockPortfolioQueries,
	StockPortfolioTypes
} from "./stock-portfolio.resolver";

export * from "./connection.resolver";

const viewer: IFieldResolver<any, IServerContext> = (parent, args, { user }) => user;

export const resolvers: IResolvers<any, IServerContext> = {
	Query: {
		viewer,
		...StockPortfolioQueries
	},
	Mutation: {
		viewer,
		...AuthenticationMutations,
		...StockPortfolioMutations
	},
	...ConnectionTypes,
	...StockPortfolioTypes
};
