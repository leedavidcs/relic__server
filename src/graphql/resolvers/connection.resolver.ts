import { IAbstractCursor, IAbstractSourceWithCursor } from "@/connectors";
import { IObjectFilterKey } from "@/dataloaders";
import { IServerContext } from "@/graphql";
import {
	getPageInfo,
	getPaginatedCursor,
	getPaginatedKeys,
	IPaginationParams,
	limitKeysById
} from "@/graphql/pagination";
import { models } from "@/mongodb";
import { Maybe } from "@/types";
import Base64URL from "base64-url";
import DataLoader from "dataloader";
import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { IResolverObject, IResolvers } from "graphql-tools";
import { Cursor as MongoDBCursor } from "mongodb";
import { Document } from "mongoose";
import { complement, indexBy, isNil, prop } from "ramda";

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
	startCursor: string | null;
	lastCursor: string | null;
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
	nodes: Array<T & IDataNode>;
	pageInfo: IPageInfo;
}

export const ConnectionEdge: IResolverObject<Document, IServerContext> = {
	cursor: (parent) => ({ value: parent.id.toString() }),
	node: (parent) => parent
};

const doesExist = <T>(value: T | null | undefined): value is T => complement(isNil)(value);

const prime = <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	data: ReadonlyArray<T & IDataNode>,
	filters: { [key: string]: any },
	loader: DataLoader<IObjectFilterKey, (T & IDataNode) | null>
): DataLoader<IObjectFilterKey, (T & IDataNode) | null> => {
	return data.reduce((acc, item) => acc.prime({ ...filters, id: item.id }, item), loader);
};

export const resolveRootConnection = async <
	S extends keyof typeof models,
	A extends IConnectionQueryArgs = IConnectionQueryArgs,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	sourceName: S,
	args: A,
	loader: DataLoader<IObjectFilterKey, (T & IDataNode) | null>,
	context: IServerContext
) => {
	const {
		connectors: { MongoDB }
	} = context;
	const { first, last, before, after, ...restArgs } = args;

	const source: IAbstractSourceWithCursor<T> = MongoDB.getWithCursor<T>(sourceName);

	const filter: { [key: string]: any } = MongoDB.adaptQueryArgs(restArgs);

	const query: IAbstractCursor<T> = await MongoDB.limitQueryWithId(source, filter, {
		before,
		after
	});

	const paginatedCursor: IAbstractCursor<T> = await getPaginatedCursor(query, { first, last });
	const results: Array<T & IDataNode> = await paginatedCursor.toArray();
	const [edges, nodes] = [results, results];

	const count: number = await query.clone().count();
	const pageInfo: IPageInfo = getPageInfo(count, { first, last }, results);

	prime(results, filter, loader);

	return { edges, nodes, pageInfo };
};

export const resolveNestedConnection = async <
	S extends keyof typeof models,
	A extends IConnectionQueryArgs = IConnectionQueryArgs,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	keys: ReadonlyArray<string>,
	args: A,
	loader: DataLoader<IObjectFilterKey, (T & IDataNode) | null>,
	context: IServerContext
) => {
	const {
		connectors: { MongoDB }
	} = context;
	const { first, last, before, after, ...restArgs } = args;

	const withFilter: IObjectFilterKey[] = keys.map((id) => ({
		id,
		...MongoDB.adaptQueryArgs(restArgs)
	}));

	const entities: ReadonlyArray<(T & IDataNode) | null> = await loader.loadMany(withFilter);
	const withoutNulls: ReadonlyArray<T & IDataNode> = entities.filter(doesExist);
	const entitiesMap: { [key: string]: T & IDataNode } = indexBy(prop("id"), withoutNulls);

	const finalKeys: ReadonlyArray<string> = Object.keys(entitiesMap);
	const cursorLimitedKeys: ReadonlyArray<string> = limitKeysById(finalKeys, { before, after });
	const paginatedKeys: ReadonlyArray<string> = getPaginatedKeys(cursorLimitedKeys, {
		first,
		last
	});

	const results: ReadonlyArray<T & IDataNode> = paginatedKeys.map((key) => entitiesMap[key]);
	const [edges, nodes] = [results, results];

	const count: number = entities.length;
	const pageInfo: IPageInfo = await getPageInfo(count, { first, last }, results);

	return { edges, nodes, pageInfo };
};

const toCursor = ({ value }): string => Base64URL.encode(value.toString());

const fromCursor = (cursor: string): { value: string } | null => {
	const value: string = Base64URL.decode(cursor);

	return value ? { value } : null;
};

const Cursor: GraphQLScalarType = new GraphQLScalarType({
	name: "Cursor",
	serialize: (value) => (value.value ? toCursor(value) : null),
	parseLiteral: (ast: ValueNode) => (ast.kind === Kind.STRING ? fromCursor(ast.value) : null),
	parseValue: fromCursor
});

export const ConnectionTypes: IResolvers = { Cursor };
