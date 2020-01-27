import { GraphQLLogger } from "@/utils";
import { GraphQLExtension } from "apollo-server-koa";
import { print } from "graphql";

const debug: boolean = process.env.NODE_ENV === "development";

export const devLogger = (): GraphQLExtension => {
	if (!debug) {
		return {};
	}

	return {
		requestDidStart: ({ queryString, parsedQuery, variables }) => {
			const query: string = queryString ?? "";
			const parsed: string = (parsedQuery && print(parsedQuery)) ?? "";
			const variablesText: string = (variables && JSON.stringify(variables, null, 2)) ?? "";

			const info = { query, parsed, variables: variablesText };

			GraphQLLogger.info("GraphQL request start:", info);
		},
		willSendResponse: ({ graphqlResponse }) => {
			const responseText: string = JSON.stringify(graphqlResponse);
			const info = { response: responseText };

			GraphQLLogger.info("GraphQL will send response:", info);
		}
	};
};
