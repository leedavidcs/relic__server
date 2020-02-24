import { ValidationError } from "apollo-server-core";
import {
	GraphQLFieldMap,
	GraphQLNamedType,
	GraphQLObjectType,
	GraphQLResolveInfo,
	GraphQLSchema,
	isIntrospectionType,
	isObjectType
} from "graphql";
import {
	IMiddleware,
	IMiddlewareFunction,
	IMiddlewareGenerator,
	middleware
} from "graphql-middleware";
import { IMiddlewareResolver } from "graphql-middleware/dist/types";
import { TypeMap } from "graphql/type/schema";

type IFieldConfigResult = any | ValidationError;

interface IConfigFieldFunctionInputParams<TContext = any> {
	resolve: Parameters<IMiddlewareResolver<any, TContext>>[0];
	parent: any;
	args: any;
	ctx: TContext;
	info: GraphQLResolveInfo;
}

interface IConfigFieldFunctionInput<TFieldConfig = any, TContext = any> {
	fieldConfig: TFieldConfig;
	params: IConfigFieldFunctionInputParams<TContext>;
}

export type IConfigFieldPreFunction<TFieldConfig = any> = (
	input: IConfigFieldFunctionInput<TFieldConfig>
) => any;

export type IConfigFieldPostFunction<TFieldConfig = any> = (
	input: IConfigFieldFunctionInput<TFieldConfig> & { result: any }
) => any;

export interface IMiddlewareOptions<TFieldConfig = any> {
	preResolve: IConfigFieldPreFunction<TFieldConfig>;
	postResolve: IConfigFieldPostFunction<TFieldConfig>;
}

export interface IConfigFieldMap<TConfig = any> {
	[fieldName: string]: TConfig;
}

export interface IConfigTypeMap<TConfig = any> {
	[typeName: string]: IConfigFieldMap<TConfig>;
}

const defaultOptions: IMiddlewareOptions = {
	preResolve: ({ params: { resolve, parent, args, ctx, info } }) =>
		resolve(parent, args, ctx, info),
	postResolve: ({ result }) => result
};

const doesConfigTreeFitSchema = <TConfig extends Record<string, any> = {}>(
	typeMap: TypeMap,
	configTree: IConfigTypeMap<TConfig>
): string | null => {
	const typeErrors: string = Object.keys(configTree)
		.filter((typeName: string) => !Object.prototype.hasOwnProperty.call(typeMap, typeName))
		.join(", ");

	return typeErrors || null;
};

const doesFieldConfigFitFields = <TConfig extends Record<string, any> = {}, TContext = any>(
	type: GraphQLObjectType,
	fieldMap: GraphQLFieldMap<any, TContext>,
	fieldConfigMap: IConfigFieldMap<TConfig>
): string | null => {
	const fieldErrors = Object.keys(fieldConfigMap)
		.filter((fieldName: string) => !Object.prototype.hasOwnProperty.call(fieldMap, fieldName))
		.map((fieldName: string) => `${type.name}.${fieldName}`)
		.join(", ");

	return fieldErrors || null;
};

const generateFieldMiddlewareFromFieldConfig = <TConfig = any, TContext = any>(
	fieldConfig: TConfig,
	options: IMiddlewareOptions<TConfig>
): IMiddlewareFunction<any, TContext> => async (
	resolve,
	parent,
	args,
	ctx,
	info
): Promise<IFieldConfigResult> => {
	const { preResolve, postResolve } = options;

	const params = { resolve, parent, args, ctx, info };

	try {
		const result = await preResolve({ fieldConfig, params });
		const postResult = await postResolve({ fieldConfig, params, result });

		return postResult;
	} catch (err) {
		if (!(err instanceof ValidationError)) {
			throw err;
		}

		return err;
	}
};

const applyFieldConfigToType = <TConfig extends Record<string, any> = {}, TContext = any>(
	namedType: GraphQLObjectType,
	fieldConfigMap: IConfigFieldMap<TConfig>,
	options: IMiddlewareOptions<TConfig>
): IMiddleware => {
	const fieldMap: GraphQLFieldMap<any, TContext> = namedType.getFields();
	const fieldErrors: string | null = doesFieldConfigFitFields(
		namedType,
		fieldMap,
		fieldConfigMap
	);

	if (fieldErrors) {
		throw new ValidationError(
			`Middleware field configs were applied to ${fieldErrors} fields, not in the schema`
		);
	}

	const fieldMiddleware: IMiddleware = Object.keys(fieldConfigMap).reduce<IMiddleware>(
		(acc, fieldName) => ({
			...acc,
			[fieldName]: generateFieldMiddlewareFromFieldConfig(fieldConfigMap[fieldName], options)
		}),
		{}
	);

	return fieldMiddleware;
};

const generateMiddlewareFromSchemaAndConfigTree = <
	TConfig extends Record<string, any> = {},
	TContext = any
>(
	schema: GraphQLSchema,
	configTree: IConfigTypeMap<TConfig>,
	options: IMiddlewareOptions<TConfig>
): IMiddleware => {
	const typeMap: TypeMap = schema.getTypeMap();
	const typeErrors: string | null = doesConfigTreeFitSchema<TConfig>(typeMap, configTree);

	if (typeErrors) {
		throw new ValidationError(
			`Middleware configs were applied to ${typeErrors} types, not in the schema`
		);
	}

	const typeMiddleware: IMiddleware = Object.keys(configTree)
		.filter((typeName: string) => !isIntrospectionType(typeMap[typeName]))
		.reduce<IMiddleware>((acc, typeName: string) => {
			const namedType: GraphQLNamedType = typeMap[typeName];
			const configFieldMap = configTree[typeName];

			if (!isObjectType(namedType)) {
				return acc;
			}

			return {
				...acc,
				[typeName]: applyFieldConfigToType<TConfig, TContext>(
					namedType,
					configFieldMap,
					options
				)
			};
		}, {});

	return typeMiddleware;
};

export const createMiddleware = <
	TConfig extends Record<string, any> = {},
	TSource = any,
	TContext = any,
	TArgs = any
>(
	options: Partial<IMiddlewareOptions<TConfig>>,
	configTree: IConfigTypeMap<TConfig>
): IMiddlewareGenerator<TSource, TContext, TArgs> => {
	const finalOptions: IMiddlewareOptions<TConfig> = { ...defaultOptions, ...options };

	return middleware((schema: GraphQLSchema) =>
		generateMiddlewareFromSchemaAndConfigTree(schema, configTree, finalOptions)
	);
};
