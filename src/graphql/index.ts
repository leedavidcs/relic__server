import { IWithUser } from "@/authentication";
import { dataSources } from "@/datasources";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServerBase, Config } from "apollo-server-core";
import { GraphQLSchema } from "graphql";
import { ParameterizedContext } from "koa";
import { deriveApolloContext } from "./context";
import { applyMiddlewaresToSchema } from "./middlewares";
import { getPlugins } from "./plugins";
import { applyResolversToSchema } from "./resolvers";
import { nexusSchema } from "./schemas";
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

const isDebug: boolean = process.env.NODE_ENV !== "production";

export const getApolloServer = <C extends ApolloServerBase, P extends { [key: string]: any }>(
	Ctor: Constructor<C>,
	options: IGetApolloServerOptions<P>
): C => {
	const { getHeaders, getKoaCtx, maxComplexity = Infinity, maxDepth = Infinity } = options;

	const schemaWithResolvers: GraphQLSchema = applyResolversToSchema(nexusSchema);
	const schemaWithMiddlewares: GraphQLSchema = applyMiddlewaresToSchema(schemaWithResolvers);
	const schema: GraphQLSchema = schemaWithMiddlewares;

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
		debug: isDebug,
		extensions: [],
		playground: isDebug,
		plugins: getPlugins({ maxComplexity, schema }),
		schema,
		validationRules: getValidationRules({ maxDepth })
	};

	const server: C = new Ctor(config);

	return server;
};
