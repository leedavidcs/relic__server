import { IServerContext } from "@/graphql/context";
import { resolvers as ForeignScalarTypes } from "graphql-scalars";
import { IFieldResolver, IResolvers } from "graphql-tools";
import { AuthenticationMutations } from "./authentication.resolver";
import { DataKeyQueries, DataKeyTypes } from "./data-key.resolver";
import { ScalarTypes } from "./scalars.resolver";
import {
	StockPortfolioMutations,
	StockPortfolioQueries,
	StockPortfolioTypes
} from "./stock-portfolio.resolver";

export * from "./connection.resolver";
export * from "./stock-portfolio.resolver";

const viewer: IFieldResolver<any, IServerContext> = (parent, args, { user }) => user;

export const resolvers: IResolvers<any, IServerContext> = {
	...ForeignScalarTypes,
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
	...DataKeyTypes,
	...ScalarTypes,
	...StockPortfolioTypes
};
