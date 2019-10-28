import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GraphQLSchema } from "graphql";
import { complexityPlugin } from "./complexity.plugin";

interface IGetPluginsConfig {
	maxComplexity?: number;
	schema: GraphQLSchema;
}

export const getPlugins = ({ maxComplexity, schema }: IGetPluginsConfig) => {
	const plugins: ApolloServerPlugin[] = [complexityPlugin({ maxComplexity, schema })];

	return plugins;
};
