import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GraphQLSchema } from "graphql";
import { complexityPlugin } from "./complexity.plugin";
import { devLoggerPlugin } from "./dev-logger.plugin";

interface IGetPluginsConfig {
	maxComplexity?: number;
	schema: GraphQLSchema;
}

export const getPlugins = ({ maxComplexity, schema }: IGetPluginsConfig) => {
	const plugins: ApolloServerPlugin[] = [
		complexityPlugin({ maxComplexity, schema }),
		devLoggerPlugin
	];

	return plugins;
};
