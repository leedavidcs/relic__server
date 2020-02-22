import { IServerContextWithUser } from "@/graphql/context";
import { GraphQLSchema } from "graphql";
import { addResolveFunctionsToSchema, IFieldResolver, IResolvers } from "graphql-tools";
import { AuthenticationMutations } from "./authentication.resolver";
import { ScalarTypes } from "./scalars.resolver";
import {
	StockPortfolioMutations,
	StockPortfolioQueries,
	StockPortfolioTypes
} from "./stock-portfolio.resolver";

export * from "./authentication.resolver";
export * from "./connection.resolver";
export * from "./scalars.resolver";
export * from "./stock-portfolio.resolver";

const viewer: IFieldResolver<any, IServerContextWithUser> = (parent, args, { user }) => user;

export const resolvers: IResolvers<any, IServerContextWithUser> = {
	Query: {
		viewer,
		...StockPortfolioQueries
	},
	Mutation: {
		viewer,
		...AuthenticationMutations,
		...StockPortfolioMutations
	},
	...ScalarTypes,
	...StockPortfolioTypes
};

export const applyResolversToSchema = (schema: GraphQLSchema): GraphQLSchema => {
	const schemaWithResolvers = addResolveFunctionsToSchema({ schema, resolvers });

	return schemaWithResolvers;
};
