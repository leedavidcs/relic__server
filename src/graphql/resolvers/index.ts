import { IFieldResolver, IResolvers } from "graphql-tools";
import { IServerContext } from "../context";
import { AuthenticationMutations } from "./authentication.resolver";
import { ConnectionTypes } from "./connection.resolver";

export * from "./connection.resolver";

const viewer: IFieldResolver<any, IServerContext> = () => ({
	id: () => "Temporary ID for now."
});

export const resolvers: IResolvers<any, IServerContext> = {
	Query: {
		viewer
	},
	Mutation: {
		viewer,
		...AuthenticationMutations
	},
	...ConnectionTypes
};
