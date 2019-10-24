import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { DocumentNode, GraphQLSchema, separateOperations } from "graphql";
import { ComplexityEstimator, fieldConfigEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";

interface IComplexityPluginConfig {
	maxComplexity?: number;
	schema: GraphQLSchema;
}

export const complexityPlugin = ({
	maxComplexity = Infinity,
	schema
}: IComplexityPluginConfig): ApolloServerPlugin => ({
	requestDidStart: () => ({
		didResolveOperation: ({ request: { operationName, variables }, document }) => {
			const query: DocumentNode = operationName
				? separateOperations(document)[operationName]
				: document;

			const estimators: ComplexityEstimator[] = [
				fieldConfigEstimator(), simpleEstimator({ defaultComplexity: 1 })
			];

			const complexity: number = getComplexity({ estimators, query, schema, variables });

			if (complexity >= maxComplexity) {
				throw new Error(
					`Query (${complexity}) exceeds the max allowed complexity (${maxComplexity})`
				);
			}
		}
	})
});
