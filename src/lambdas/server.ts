import { Server } from "@/server";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
	Callback,
	Context
} from "aws-lambda";
import ServerlessHttp from "serverless-http";
// tslint:disable:no-import-side-effect
import "source-map-support/register";
// tslint:enable:no-import-side-effect

const createHandler = async (): Promise<APIGatewayProxyHandler> => {
	const server: Server = new Server();

	await server.configure();

	const handler: APIGatewayProxyHandler = (
		event: APIGatewayProxyEvent,
		context: Context,
		callback: Callback<APIGatewayProxyResult>
	): void => {
		const koaHandler = ServerlessHttp(server.app);

		new Promise<APIGatewayProxyResult>(async (resolve, reject) => {
			try {
				/**
				 * @description ServerlessHttp.LambdaPartial has incorrect types. Await is required
				 * here, even if the types state that it isn't. The koaHandler is wrapped in this
				 * promise to still maintain correct types.
				 * @author David Lee
				 * @date October 10, 2019
				 */
				const result: APIGatewayProxyResult = await koaHandler(event, context);

				resolve(result);
			} catch (err) {
				reject(err);
			}
		})
			.then((result) => callback(null, result))
			.catch((err) => callback(err));
	};

	return handler;
};

export const ServerHandler: APIGatewayProxyHandler = (
	event: APIGatewayProxyEvent,
	context: Context,
	callback: Callback<APIGatewayProxyResult>
): void => {
	createHandler().then((handler) => {
		handler(event, context, callback);
	});
};
