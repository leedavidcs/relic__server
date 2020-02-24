import { createMiddleware, IMiddlewareOptions } from "@/graphql/middlewares/create-middleware";
import { GraphQLResolveInfo } from "graphql";
import { IMiddlewareGenerator } from "graphql-middleware";
import { isFunction } from "lodash";
import { array, boolean, date, number, object, ObjectSchemaDefinition, string } from "yup";

/**
 * @description Proxy the yup module, since it has been designed with extending prototypes
 * @see (@link https://github.com/jquense/yup#yupaddmethodschematype-schema-name-string-method--schema-void)
 * @authr David Lee
 * @date February 19, 2020
 */
const yupProxy = { array, boolean, date, number, object, string };

export type ValidatorFunction<TContext = any> = (
	parent: any,
	args: any,
	ctx: TContext,
	info: GraphQLResolveInfo
) => ObjectSchemaDefinition<any> | Promise<ObjectSchemaDefinition<any>>;

export interface IValidatorFieldMap<TContext = any> {
	[fieldName: string]: ValidatorFunction<TContext> | ObjectSchemaDefinition<any>;
}

export interface IValidatorTypeMap<TContext = any> {
	[typeName: string]: IValidatorFieldMap<TContext>;
}

const isValidatorFunction = <TContext = any>(
	value: ValidatorFunction<TContext> | ObjectSchemaDefinition<any>
): value is ValidatorFunction<TContext> => isFunction(value);

const preResolve: IMiddlewareOptions<
	ObjectSchemaDefinition<any> | ValidatorFunction<any>
>["preResolve"] = async ({ fieldConfig, params: { resolve, parent, args, ctx, info } }) => {
	const objSchemaDef: ObjectSchemaDefinition<any> = isValidatorFunction(fieldConfig)
		? await fieldConfig(parent, args, ctx, info)
		: fieldConfig;

	const validatedArgs = await yupProxy.object(objSchemaDef).validate(args);
	const result = await resolve(parent, validatedArgs, ctx, info);

	return result;
};

export const guardRails = <TSource = any, TContext = any, TArgs = any>(
	validatorTree: (yup: typeof yupProxy) => IValidatorTypeMap<TContext>
): IMiddlewareGenerator<TSource, TContext, TArgs> => {
	return createMiddleware({ preResolve }, validatorTree(yupProxy));
};
