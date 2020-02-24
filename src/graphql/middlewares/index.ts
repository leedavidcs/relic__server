import { GraphQLSchema } from "graphql";
import { applyMiddleware, IMiddlewareGenerator } from "graphql-middleware";
import { IExecutableSchemaDefinition, makeExecutableSchema } from "graphql-tools";
import { permissions, rateLimits, validation } from "./middlewares";

export const getSchemaWithMiddleware = ({
	schemaDirectives,
	resolvers,
	typeDefs
}: Pick<
	IExecutableSchemaDefinition,
	"resolvers" | "schemaDirectives" | "typeDefs"
>): GraphQLSchema => {
	const schema: GraphQLSchema = makeExecutableSchema({ resolvers, schemaDirectives, typeDefs });
	const middlewares: readonly IMiddlewareGenerator<any, any, any>[] = [validation, permissions];

	const schemaWithMiddleware: GraphQLSchema = applyMiddleware(schema, ...middlewares);

	return schemaWithMiddleware;
};

export const applyMiddlewaresToSchema = (schema: GraphQLSchema): GraphQLSchema => {
	const middlewares: readonly IMiddlewareGenerator<any, any, any>[] = [
		rateLimits,
		validation,
		permissions
	];

	const schemaWithMiddleware: GraphQLSchema = applyMiddleware(schema, ...middlewares);

	return schemaWithMiddleware;
};
