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
import { TypeMap } from "graphql/type/schema";
import { isFunction } from "lodash";
import { array, boolean, date, number, object, ObjectSchemaDefinition, string } from "yup";

/**
 * @description Proxy the yup module, since it has been designed with extending prototypes
 * @see (@link https://github.com/jquense/yup#yupaddmethodschematype-schema-name-string-method--schema-void)
 * @authr David Lee
 * @date February 19, 2020
 */
const yupProxy = { array, boolean, date, number, object, string };

type ValidatorResult = string | ValidationError;

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

const doesValidatorTreeFitSchema = <TContext = any>(
	typeMap: TypeMap,
	validatorTree: IValidatorTypeMap<TContext>
): string | null => {
	const typeErrors: string = Object.keys(validatorTree)
		.filter((typeName: string) => !Object.prototype.hasOwnProperty.call(typeMap, typeName))
		.join(", ");

	return typeErrors || null;
};

const doesValidatorFitFields = <TContext = any>(
	type: GraphQLObjectType,
	fieldMap: GraphQLFieldMap<any, TContext>,
	validatorFieldMap: IValidatorFieldMap<TContext>
): string | null => {
	const fieldErrors = Object.keys(validatorFieldMap)
		.filter((fieldName) => !Object.prototype.hasOwnProperty.call(fieldMap, fieldName))
		.map((fieldName) => `${type.name}.${fieldName}`)
		.join(", ");

	return fieldErrors || null;
};

const generateFieldMiddlewareFromValidator = <TContext = any>(
	validator: ValidatorFunction<TContext> | ObjectSchemaDefinition<any>
): IMiddlewareFunction<any, TContext> => async (
	resolve,
	parent,
	args,
	ctx,
	info
): Promise<ValidatorResult> => {
	const objSchemaDef: ObjectSchemaDefinition<any> = isValidatorFunction(validator)
		? await validator(parent, args, ctx, info)
		: validator;

	try {
		const validatedArgs = await yupProxy.object(objSchemaDef).validate(args);
		const result = await resolve(parent, validatedArgs, ctx, info);

		return result;
	} catch (err) {
		if (!(err instanceof ValidationError)) {
			throw err;
		}

		return err;
	}
};

const applyValidationToType = <TContext = any>(
	namedType: GraphQLObjectType,
	validators: IValidatorFieldMap<TContext>
): IMiddleware => {
	const fieldMap: GraphQLFieldMap<any, TContext> = namedType.getFields();
	const fieldErrors: string | null = doesValidatorFitFields(namedType, fieldMap, validators);

	if (fieldErrors) {
		throw new ValidationError(
			`Validators were applied to ${fieldErrors} fields, not in the schema`
		);
	}

	const fieldMiddleware: IMiddleware = Object.keys(fieldMap).reduce<IMiddleware>(
		(acc, fieldName) => ({
			...acc,
			[fieldName]: generateFieldMiddlewareFromValidator(validators[fieldName])
		}),
		{}
	);

	return fieldMiddleware;
};

const generateMiddlewareFromSchemaAndValidatorTree = <TContext = any>(
	schema: GraphQLSchema,
	validatorTree: IValidatorTypeMap<TContext>
): IMiddleware => {
	const typeMap: TypeMap = schema.getTypeMap();
	const typeErrors: string | null = doesValidatorTreeFitSchema(typeMap, validatorTree);

	if (typeErrors) {
		throw new ValidationError(
			`Validators were applied to ${typeErrors} types, not in the schema`
		);
	}

	const typeMiddleware: IMiddleware = Object.keys(validatorTree)
		.filter((typeName: string) => !isIntrospectionType(typeMap[typeName]))
		.reduce<IMiddleware>((acc, typeName: string) => {
			const namedType: GraphQLNamedType = typeMap[typeName];
			const validator: IValidatorFieldMap<TContext> = validatorTree[typeName];

			return isObjectType(namedType)
				? { ...acc, [typeName]: applyValidationToType(namedType, validator) }
				: acc;
		}, {});

	return typeMiddleware;
};

export const guardRails = <TSource = any, TContext = any, TArgs = any>(
	validatorTree: (yup: typeof yupProxy) => IValidatorTypeMap<TContext>
): IMiddlewareGenerator<TSource, TContext, TArgs> => {
	return middleware((schema: GraphQLSchema) =>
		generateMiddlewareFromSchemaAndValidatorTree(schema, validatorTree(yupProxy))
	);
};
