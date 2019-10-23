import { IWithUser } from "@/authentication";
import { dataSources } from "@/datasources";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServerBase } from "apollo-server-core";
import { GraphQLSchema } from "graphql";
import { ParameterizedContext } from "koa";
import { Constructor } from "protobufjs";
import { deriveApolloContext } from "./context";
import { getSchemaWithMiddleware } from "./middlewares";
import { resolvers } from "./resolvers";
import gqlTypeDefs from "./schemas/index.graphql";

export * from "./inputs";
export * from "./pagination";
export * from "./resolvers";
export * from "./context";
export const typeDefs = gqlTypeDefs;

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort: number = Number(process.env.REDIS_GRAPHQL_PORT);

interface IGetApolloServerOptions<P> {
	getHeaders: (params: P) => { [key: string]: string };
	getKoaCtx: (params: P) => ParameterizedContext<IWithUser> | null;
}

export const getApolloServer = <C extends ApolloServerBase, P extends { [key: string]: any }>(
	Ctor: Constructor<C>,
	options: IGetApolloServerOptions<P>
): C => {
	const { getHeaders, getKoaCtx } = options;

	const schema: GraphQLSchema = getSchemaWithMiddleware({ resolvers, typeDefs });

	const server: C = new Ctor({
		cache: new RedisCache({
			host: cacheHost,
			port: cachePort
		}),
		context: async (params: P) => {
			const headers = getHeaders(params);
			const koaCtx = getKoaCtx(params);

			const apolloContext = await deriveApolloContext(headers, koaCtx);

			return apolloContext;
		},
		dataSources,
		playground: process.env.NODE_ENV === "development",
		schema
	});

	return server;
};
