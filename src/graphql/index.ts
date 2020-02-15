import { IWithUser } from "@/authentication";
import { dataSources } from "@/datasources";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServerBase, Config } from "apollo-server-core";
import { GraphQLSchema } from "graphql";
import { ParameterizedContext } from "koa";
import { deriveApolloContext } from "./context";
import { schemaDirectives } from "./directives";
import { devLogger } from "./extensions";
import { getSchemaWithMiddleware } from "./middlewares";
import { getPlugins } from "./plugins";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schemas";
import { getValidationRules } from "./validation-rules";

export * from "./inputs";
export * from "./pagination";
export * from "./resolvers";
export * from "./context";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort = Number(process.env.REDIS_GRAPHQL_PORT);

interface IGetApolloServerOptions<P> {
	getHeaders: (params: P) => { [key: string]: string };
	getKoaCtx: (params: P) => ParameterizedContext<IWithUser> | null;
	maxComplexity?: number;
	maxDepth?: number;
}

export const getApolloServer = <C extends ApolloServerBase, P extends { [key: string]: any }>(
	Ctor: Constructor<C>,
	options: IGetApolloServerOptions<P>
): C => {
	const { getHeaders, getKoaCtx, maxComplexity = Infinity, maxDepth = Infinity } = options;

	const schema: GraphQLSchema = getSchemaWithMiddleware({
		resolvers,
		schemaDirectives,
		typeDefs
	});

	const config: Config = {
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
		debug: process.env.NODE_ENV === "development",
		extensions: [devLogger],
		playground: process.env.NODE_ENV === "development",
		plugins: getPlugins({ maxComplexity, schema }),
		schema,
		validationRules: getValidationRules({ maxDepth })
	};

	const server: C = new Ctor(config);

	return server;
};
