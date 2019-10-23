import { GraphQLSchema } from "graphql";
import { applyMiddleware, IMiddlewareGenerator } from "graphql-middleware";
import { IExecutableSchemaDefinition, makeExecutableSchema } from "graphql-tools";
import { permissions } from "./permissions.middleware";

export const getSchemaWithMiddleware = ({
	resolvers,
	typeDefs
}: Pick<IExecutableSchemaDefinition, "resolvers" | "typeDefs">): GraphQLSchema => {
	const schema: GraphQLSchema = makeExecutableSchema({ resolvers, typeDefs });
	const middlewares: ReadonlyArray<IMiddlewareGenerator<any, any, any>> = [permissions];

	const schemaWithMiddleare: GraphQLSchema = applyMiddleware(schema, ...middlewares);

	return schemaWithMiddleare;
};
