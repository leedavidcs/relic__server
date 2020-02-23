import { IServerContextWithUser } from "@/graphql/context";
import { GraphQLSchema } from "graphql";
import { addResolveFunctionsToSchema, IResolvers } from "graphql-tools";
import {
	StockPortfolioMutations,
	StockPortfolioQueries,
	StockPortfolioTypes
} from "./stock-portfolio.resolver";

export * from "./connection.resolver";
export * from "./stock-portfolio.resolver";

export const resolvers: IResolvers<any, IServerContextWithUser> = {
	Query: {
		...StockPortfolioQueries
	},
	Mutation: {
		...StockPortfolioMutations
	},
	...StockPortfolioTypes
};

export const applyResolversToSchema = (schema: GraphQLSchema): GraphQLSchema => {
	const schemaWithResolvers = addResolveFunctionsToSchema({ schema, resolvers });

	return schemaWithResolvers;
};
