import { Server } from "@/server";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
	Callback,
	Context
} from "aws-lambda";
import ServerlessHttp, { Handler } from "serverless-http";
// tslint:disable:no-import-side-effect
import "source-map-support/register";
// tslint:enable:no-import-side-effect

/**
 * TODO
 * @description Websocket support still needs to be added. For now, use dedicated instance
 * @see {@link: https://github.com/michalkvasnicak/aws-lambda-graphql}
 * @author David Lee
 * @date January 27, 2020
 */

const createHandler = async (): Promise<APIGatewayProxyHandler> => {
	const server: Server = new Server();

	await server.configure();

	const handler: APIGatewayProxyHandler = (
		event: APIGatewayProxyEvent,
		context: Context,
		callback: Callback<APIGatewayProxyResult>
	): void => {
		const koaHandler: Handler = ServerlessHttp(server.app);

		const asyncHandler = async (): Promise<APIGatewayProxyResult> => {
			/**
			 * @description ServerlessHttp.LambdaPartial has incorrect types. Await is required
			 * here, even if the types state that it isn't. The koaHandler is wrapped in this
			 * promise to still maintain correct types.
			 * @author David Lee
			 * @date October 10, 2019
			 */
			const result: APIGatewayProxyResult = await koaHandler(event, context);

			await server.stop();

			return result;
		};

		asyncHandler()
			.then((result) => callback(null, result))
			.catch(async (err) => {
				await server.stop();

				callback(err);
			});
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
