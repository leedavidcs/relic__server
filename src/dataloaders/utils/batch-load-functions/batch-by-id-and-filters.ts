import { models } from "@/mongodb";
import objectHash from "object-hash";
import { IFilter, IObjectFilterKey } from ".";
import { logOperation } from "../log-operation";

const mapToIds = <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	entities: ReadonlyArray<T>
): { [id: string]: T } => {
	const entitiesMap: { [id: string]: T } = entities.reduce(
		(acc, entity) => ({ ...acc, [entity.id]: entity }),
		{} as { [id: string]: T }
	);

	return entitiesMap;
};

const getFiltersMap = (
	hashesTuple: ReadonlyArray<[string, IObjectFilterKey]>
): { [hash: string]: IFilter } => {
	const filtersMap: { [hash: string]: IFilter } = hashesTuple.reduce((acc, [hash, key]) => {
		const { id, ...filter }: IObjectFilterKey = key;

		const mostUpdatedFilter: IFilter = acc[hash] || filter;

		const withId: IFilter = {
			...mostUpdatedFilter,
			id: {
				$in: ((mostUpdatedFilter.id && mostUpdatedFilter.id.$in) || []).concat(id)
			}
		};

		return { ...acc, [hash]: withId };
	}, {} as { [key: string]: IFilter });

	return filtersMap;
};

const getResultsMap = async <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	sourceName: S,
	filtersMap: { [hash: string]: IFilter }
): Promise<{ [hash: string]: { [id: string]: T } }> => {
	const model = models[sourceName];

	const filtersTuple: ReadonlyArray<[string, IFilter]> = Object.keys(filtersMap).map((hash) => {
		return [hash, filtersMap[hash]];
	});

	const resultsTuples: ReadonlyArray<[string, T[]]> = await Promise.all(
		filtersTuple.map(
			async ([hash, filter]): Promise<[string, any[]]> => {
				logOperation(sourceName, "MongoDB.Model.find", filter);

				const entities = await model.find(filter);

				return [hash, entities];
			}
		)
	);

	const resultsMap: { [hash: string]: { [id: string]: T } } = resultsTuples.reduce(
		(acc, [hash, entities]) => ({ ...acc, [hash]: mapToIds(entities) }),
		{} as { [hash: string]: { [id: string]: T } }
	);

	return resultsMap;
};

const getOrderedResults = <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	hashesTuple: ReadonlyArray<[string, IObjectFilterKey]>,
	resultsMap: { [hash: string]: { [id: string]: T } }
): Array<(T & IDataNode) | null> => {
	const results: Array<(T & IDataNode) | null> = hashesTuple.map(([hash, key]) => {
		const { id } = key;

		const resultsSet: { [id: string]: T } | null = resultsMap[hash] || null;

		return resultsSet === null ? null : { ...resultsSet[id], id } || null;
	});

	return results;
};

export const batchByIdAndFilters = async <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	sourceName: S,
	keys: ReadonlyArray<IObjectFilterKey>
): Promise<Array<(T & IDataNode) | null>> => {
	const hashesTuple: ReadonlyArray<[string, IObjectFilterKey]> = keys.map((key) => {
		return [objectHash(key), key];
	});

	const filtersMap: { [hash: string]: IFilter } = getFiltersMap(hashesTuple);

	const resultsMap: { [hash: string]: { [id: string]: T } } = await getResultsMap(
		sourceName,
		filtersMap
	);

	const results: Array<(T & IDataNode) | null> = getOrderedResults(hashesTuple, resultsMap);

	return results;
};
