import { AbstractConnector, IAbstractCursor, IAbstractSourceWithCursor } from "@/connectors";
import { IServerContext } from "@/graphql";
import {
	getPageInfo,
	getPaginatedCursor,
	getPaginatedKeys,
	IPaginationParams,
	limitKeysById
} from "@/graphql/pagination";
import { Maybe } from "@/types";
import Base64URL from "base64-url";
import DataLoader from "dataloader";
import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { IResolverObject, IResolvers } from "graphql-tools";
import { Cursor as MongoDBCursor } from "mongodb";
import { Document } from "mongoose";
import { isNil, unless } from "ramda";

export interface IConnectionArguments extends IPaginationParams {
	before?: any;
	after?: any;
}

export interface IConnectionQueryArgs extends IConnectionArguments {
	id?: Maybe<string>;
}

export interface IPageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	count: number;
}

export interface IConnectionResults<T> {
	pageInfo: IPageInfo;
	query: MongoDBCursor<T>;
}

export interface IConnectionEdge<T> {
	cursor: { value: string };
	node: T & IDataNode;
}

export interface IConnectionResult<T> {
	edges: Array<T & IDataNode>;
	pageInfo: IPageInfo;
}

export interface IResolveConnectionOptions<T, A extends IConnectionQueryArgs> {
	adaptQueryArgs?: (queryArgs: A) => { [key: string]: any };
	loader?: DataLoader<string, T & IDataNode>;
}

export const ConnectionEdge: IResolverObject<Document, IServerContext> = {
	cursor: (parent) => ({ value: parent.id.toString() }),
	node: (parent) => parent
};

const DEFAULT_RESOLVE_CONNECTION_OPTIONS: IResolveConnectionOptions<any, any> = {};

export const resolveComplexConnection = async <T, A extends IConnectionQueryArgs>(
	connector: AbstractConnector,
	sourceName: string,
	args: A,
	options?: Partial<IResolveConnectionOptions<T, Omit<A, keyof IConnectionArguments>>>
): Promise<IConnectionResult<T>> => {
	const finalOptions: IResolveConnectionOptions<
		T,
		Pick<A, Exclude<keyof A, keyof IConnectionArguments>>
	> = { ...DEFAULT_RESOLVE_CONNECTION_OPTIONS, ...options };
	const { first, last, before, after, ...restArgs } = args;
	const source: IAbstractSourceWithCursor<T> = connector.getWithCursor<T>(sourceName);

	const adaptQueryArgs = finalOptions.adaptQueryArgs || connector.adaptQueryArgs;
	const filter: { [key: string]: any } = adaptQueryArgs(restArgs);

	const query: IAbstractCursor<T> = await connector.limitQueryWithId(source, filter, {
		before,
		after
	});

	const count: number = await query.clone().count();
	const pageInfo: IPageInfo = await getPageInfo(count, { first, last });

	const paginatedCursor: IAbstractCursor<T> = await getPaginatedCursor(query, { first, last });
	const edges: Array<T & IDataNode> = await paginatedCursor.toArray();

	const cacheEdges = unless(isNil, async (loader?: DataLoader<string, T & IDataNode>) =>
		cache(await edges, loader!)
	);

	cacheEdges(finalOptions.loader);

	return { edges, pageInfo };
};

export const resolveDefaultConnection = async <T>(
	keys: string[],
	loader: DataLoader<string, T & IDataNode>,
	args: IConnectionArguments
): Promise<IConnectionResult<T>> => {
	const { first, last, before, after } = args;
	const count: number = keys.length;

	const cursorLimitedKeys: string[] = limitKeysById(keys, { before, after });
	const paginatedKeys: string[] = getPaginatedKeys(cursorLimitedKeys, { first, last });

	const edges: Array<T & IDataNode> = await loader.loadMany(paginatedKeys);

	const pageInfo: IPageInfo = await getPageInfo(count, { first, last });

	return { edges, pageInfo };
};

const toCursor = ({ value }): string => Base64URL.encode(value.toString());

const fromCursor = (cursor: string): { value: string } | null => {
	const value: string = Base64URL.decode(cursor);

	return value ? { value } : null;
};

const cache = <T extends IDataNode>(
	data: T[],
	loader: DataLoader<string, T>
): DataLoader<string, T> => data.reduce((acc, item) => acc.prime(item.id, item), loader);

const Cursor: GraphQLScalarType = new GraphQLScalarType({
	name: "Cursor",
	serialize: (value) => (value.value ? toCursor(value) : null),
	parseLiteral: (ast: ValueNode) => (ast.kind === Kind.STRING ? fromCursor(ast.value) : null),
	parseValue: fromCursor
});

export const ConnectionTypes: IResolvers = { Cursor };
