import { GraphQLSchema } from "graphql";
import { applyMiddleware, IMiddlewareGenerator } from "graphql-middleware";
import { IExecutableSchemaDefinition, makeExecutableSchema } from "graphql-tools";
import { permissions } from "./permissions.middleware";
import { validation } from "./validation.middleware";

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
		/**
		 * @todo Add rate limits, but in a way that is isolated
		 * @author David Lee
		 * @date February 22, 2020
		 */
		// rateLimits,
		validation,
		permissions
	];

	const schemaWithMiddleware: GraphQLSchema = applyMiddleware(schema, ...middlewares);

	return schemaWithMiddleware;
};
