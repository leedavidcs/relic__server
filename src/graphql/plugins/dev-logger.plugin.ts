import { GraphQLRequest } from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

const isIntrospectionQuery = (request: GraphQLRequest): boolean => {
	const { operationName } = request;

	return operationName === "IntrospectionQuery";
};

/* eslint-disable no-console */
export const devLoggerPlugin: ApolloServerPlugin = {
	requestDidStart: (requestCtx) => {
		if (isDevelopment) {
			return;
		}

		const { request } = requestCtx;

		if (isIntrospectionQuery(request)) {
			console.log("IntrospectionQuery fetched");
			return;
		}

		console.log(request.query);

		return {
			willSendResponse: ({ response }) => {
				console.log(response);
			}
		};
	}
};
/* eslint-enable no-console */
