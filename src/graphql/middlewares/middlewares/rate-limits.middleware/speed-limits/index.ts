import { createMiddleware, IMiddlewareOptions } from "@/graphql/middlewares/create-middleware";
import { ValidationError } from "apollo-server-core";
import { GraphQLResolveInfo } from "graphql";
import { IMiddlewareGenerator } from "graphql-middleware";
import { getGraphQLRateLimiter } from "graphql-rate-limit";
import {
	GraphQLRateLimitConfig,
	GraphQLRateLimitDirectiveArgs
} from "graphql-rate-limit/build/main/lib/types";
import { isFunction } from "lodash";

type RateLimitFunction<TContext = any> = (
	parent: any,
	args: any,
	ctx: TContext,
	info: GraphQLResolveInfo
) => GraphQLRateLimitDirectiveArgs | Promise<GraphQLRateLimitDirectiveArgs>;

type RateLimitFieldMap<TContext = any> = Record<
	string,
	RateLimitFunction<TContext> | GraphQLRateLimitDirectiveArgs
>;

type RateLimitTypeMap<TContext = any> = Record<string, RateLimitFieldMap<TContext>>;

const isRateLimitFunction = <TContext = any>(
	value: RateLimitFunction<TContext> | GraphQLRateLimitDirectiveArgs
): value is RateLimitFunction<TContext> => isFunction(value);

const getPreResolver = (
	rateLimiter: ReturnType<typeof getGraphQLRateLimiter>
): IMiddlewareOptions<
	GraphQLRateLimitDirectiveArgs | RateLimitFunction<any>
>["preResolve"] => async ({ fieldConfig, params: { resolve, parent, args, ctx, info } }) => {
	const rateLimitArgs: GraphQLRateLimitDirectiveArgs = isRateLimitFunction(fieldConfig)
		? await fieldConfig(parent, args, ctx, info)
		: fieldConfig;

	const errorMessage = await rateLimiter({ parent, args, context: ctx, info }, rateLimitArgs);

	if (errorMessage) {
		throw new ValidationError(errorMessage);
	}

	return resolve(parent, args, ctx, info);
};

export const speedLimits = <TSource = any, TContext = any, TArgs = any>(
	options: GraphQLRateLimitConfig,
	rateTree: RateLimitTypeMap<TContext>
): IMiddlewareGenerator<TSource, TContext, TArgs> => {
	const rateLimiter = getGraphQLRateLimiter(options);
	const preResolve = getPreResolver(rateLimiter);

	return createMiddleware({ preResolve }, rateTree);
};
