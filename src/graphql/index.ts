import { IWithUser } from "@/authentication";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServerBase } from "apollo-server-core";
import { ParameterizedContext } from "koa";
import { Constructor } from "protobufjs";
import { pipe } from "ramda";
import { deriveApolloContext } from "./context";
import { resolvers } from "./resolvers";
import typeDefs from "./schemas/index.graphql";

export * from "./inputs";
export * from "./pagination";
export * from "./resolvers";
export * from "./context";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort: number = Number(process.env.REDIS_GRAPHQL_PORT);

interface IGetApolloServerOptions<P> {
	getHeaders: (params: P) => { [key: string]: string };
	getKoaCtx: (params: P) => ParameterizedContext<IWithUser> | null;
	props?: { [key: string]: any };
}

export const getApolloServer = <C extends ApolloServerBase, P extends { [key: string]: any }>(
	Ctor: Constructor<C>,
	options: IGetApolloServerOptions<P>
): C => {
	const { getHeaders, getKoaCtx, props } = options;

	const server: C = new Ctor({
		cache: new RedisCache({
			host: cacheHost,
			port: cachePort
		}),
		context: pipe(
			(params: P) => ({
				headers: getHeaders(params),
				koaCtx: getKoaCtx(params)
			}),
			({ headers, koaCtx }) => deriveApolloContext(headers, koaCtx, props)
		),
		dataSources: () => ({}),
		playground: process.env.NODE_ENV === "development",
		resolvers,
		typeDefs
	});

	return server;
};
