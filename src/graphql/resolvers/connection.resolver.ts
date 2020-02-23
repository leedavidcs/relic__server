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
import { doesExist, isNotError } from "@/utils";
import DataLoader from "dataloader";
import { IResolverObject } from "graphql-tools";
import { keyBy } from "lodash";
import { Document } from "mongoose";

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

export interface IConnectionEdge<T> {
	cursor: { value: string };
	node: T & IDataNode;
}

export interface IConnectionResult<T> {
	edges: (T & IDataNode)[];
	nodes: (T & IDataNode)[];
	pageInfo: IPageInfo;
}

export const ConnectionEdge: IResolverObject<Document, IServerContext> = {
	cursor: (parent) => ({ value: parent.id.toString() }),
	node: (parent) => parent
};

const prime = <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	data: readonly (T & IDataNode)[],
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
): Promise<IConnectionResult<T>> => {
	const {
		connectors: { MongoDB }
	} = context;
	const { first, last, before, after, ...filter } = args;

	const source: IAbstractSourceWithCursor<T> = MongoDB.getWithCursor<T>(sourceName);

	const query: IAbstractCursor<T> = MongoDB.limitQueryWithId(source, filter, {
		before,
		after
	});

	const paginatedCursor: IAbstractCursor<T> = await getPaginatedCursor(query, { first, last });
	const results: (T & IDataNode)[] = await paginatedCursor.toArray();
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
	keys: readonly string[],
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

	const entities: readonly (Error | (T & IDataNode) | null)[] = await loader.loadMany(withFilter);
	const withoutNulls: readonly (Error | (T & IDataNode))[] = entities.filter(doesExist);
	const withoutErrors: readonly (T & IDataNode)[] = withoutNulls.filter(isNotError);
	const entitiesMap: { [key: string]: T & IDataNode } = keyBy(withoutErrors, "id");

	const finalKeys: readonly string[] = Object.keys(entitiesMap);
	const cursorLimitedKeys: readonly string[] = limitKeysById(finalKeys, { before, after });
	const paginatedKeys: readonly string[] = getPaginatedKeys(cursorLimitedKeys, {
		first,
		last
	});

	const results: readonly (T & IDataNode)[] = paginatedKeys.map((key) => entitiesMap[key]);
	const [edges, nodes] = [results, results];

	const count: number = entities.length;
	const pageInfo: IPageInfo = getPageInfo(count, { first, last }, results);

	return { edges, nodes, pageInfo };
};
