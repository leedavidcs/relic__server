import { Document, Model } from "mongoose";
import objectHash from "object-hash";
import { IFilter, IObjectFilterKey } from ".";

const mapToIds = <T extends Document>(entities: ReadonlyArray<T>): { [id: string]: T } => {
	const entitiesMap: { [id: string]: T } = entities.reduce(
		(acc, entity) => ({ ...acc, [entity.id]: entity }),
		{} as { [id: string]: T }
	);

	return entitiesMap;
};

const getFiltersMap = (
	hashesTuple: ReadonlyArray<[string, IObjectFilterKey]>
): { [hash: string]: IFilter } => {
	const filtersMap: { [hash: string]: IFilter } = hashesTuple.reduce(
		(acc, [hash, key]) => {
			const { id, ...filter }: IObjectFilterKey = key;

			const mostUpdatedFilter: IFilter = acc[hash] || filter;

			const withId: IFilter = {
				...mostUpdatedFilter,
				id: {
					$in: ((mostUpdatedFilter.id && mostUpdatedFilter.id.$in) || []).concat(id)
				}
			};

			return { ...acc, [hash]: withId };
		},
		{} as { [key: string]: IFilter }
	);

	return filtersMap;
};

const getResultsMap = async <T extends Document>(
	model: Model<T, {}>,
	filtersMap: { [hash: string]: IFilter }
): Promise<{ [hash: string]: { [id: string]: T } }> => {
	const filtersTuple: ReadonlyArray<[string, IFilter]> = Object.keys(filtersMap).map((hash) => {
		return [hash, filtersMap[hash]];
	});

	const resultsTuples: ReadonlyArray<[string, T[]]> = await Promise.all(
		filtersTuple.map(([hash, filter]) => {
			return model.find(filter).then<[string, T[]]>((entities) => [hash, entities]);
		})
	);

	const resultsMap: { [hash: string]: { [id: string]: T } } = resultsTuples.reduce(
		(acc, [hash, entities]) => ({ ...acc, [hash]: mapToIds(entities) }),
		{} as { [hash: string]: { [id: string]: T } }
	);

	return resultsMap;
};

const getOrderedResults = <T extends Document>(
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

export const batchByIdAndFilters = async <T extends Document>(
	model: Model<T, {}>,
	keys: ReadonlyArray<IObjectFilterKey>
): Promise<Array<(T & IDataNode) | null>> => {
	const hashesTuple: ReadonlyArray<[string, IObjectFilterKey]> = keys.map((key) => {
		return [objectHash(key), key];
	});

	const filtersMap: { [hash: string]: IFilter } = getFiltersMap(hashesTuple);

	const resultsMap: { [hash: string]: { [id: string]: T } } = await getResultsMap(
		model,
		filtersMap
	);

	const results: Array<(T & IDataNode) | null> = getOrderedResults(hashesTuple, resultsMap);

	return results;
};
