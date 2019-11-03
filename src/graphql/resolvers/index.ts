import { IFieldResolver, IResolvers } from "graphql-tools";
import { IServerContext } from "../context";
import { AuthenticationMutations } from "./authentication.resolver";
import { ConnectionTypes } from "./connection.resolver";
import { DataKeyQueries, DataKeyTypes } from "./data-key.resolver";
import {
	StockPortfolioMutations,
	StockPortfolioQueries,
	StockPortfolioTypes
} from "./stock-portfolio.resolver";

export * from "./connection.resolver";
export * from "./stock-portfolio.resolver";

const viewer: IFieldResolver<any, IServerContext> = (parent, args, { user }) => user;

export const resolvers: IResolvers<any, IServerContext> = {
	Query: {
		viewer,
		...DataKeyQueries,
		...StockPortfolioQueries
	},
	Mutation: {
		viewer,
		...AuthenticationMutations,
		...StockPortfolioMutations
	},
	...ConnectionTypes,
	...DataKeyTypes,
	...StockPortfolioTypes
};
