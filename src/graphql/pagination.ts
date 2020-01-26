import { IAbstractCursor } from "@/connectors";
import { IPageInfo } from "@/graphql";
import { Maybe } from "@/types";
import { sort } from "ramda";

const DEFAULT_LIMIT = 50;

export interface IPaginationParams {
	before?: { value: string };
	after?: { value: string };
	first?: Maybe<number>;
	last?: Maybe<number>;
}

interface IGetSkipAndLimitParams extends Pick<IPaginationParams, "first" | "last"> {
	count: number;
}

export const getPageInfo = <T extends IDataNode>(
	count: number,
	pagination: Pick<IPaginationParams, "first" | "last">,
	results: readonly T[]
): IPageInfo => {
	const { first, last } = pagination;

	const startCursor: string | null = results.length ? results[0].id : null;
	const lastCursor: string | null = results.length ? results[results.length - 1].id : null;

	const partial = { count, startCursor, lastCursor };

	const pageInfo: IPageInfo =
		first || last
			? {
					hasNextPage: Boolean(first && count > first),
					hasPreviousPage: Boolean(last && count > last),
					...partial
			  }
			: {
					hasNextPage: false,
					hasPreviousPage: false,
					...partial
			  };

	return pageInfo;
};

const getSkipAndLimit = (params: IGetSkipAndLimitParams): [number, number] => {
	const { count, first, last } = params;
	const trueDefaultLimit: number = Math.min(count, DEFAULT_LIMIT);

	// prettier-ignore
	const [skip, limit]: [number, number] =
		// No pagination. Skip none, limit max.
		(!first && !last)                                  ? [0, trueDefaultLimit]
		// Not recommended. First and last supplied. Get last of first
		: (first && last && count > first && first > last) ? [first - last, last]
		// Limit by first
		: (first && count > first)                         ? [0, first]
		// Get last of count
		: (last && count > last)                           ? [count - last, last]
		// Default
														   : [0, trueDefaultLimit];

	return [skip, limit];
};

export const limitDocsById = <T extends IDataNode>(
	data: T[],
	pagination: Pick<IPaginationParams, "before" | "after">
): T[] => {
	const { before, after } = pagination;

	const sorted: T[] = sort<T>((a, b) => {
		const strA = a.id.toString();
		const strB = b.id.toString();

		return strA.localeCompare(strB);
	}, data);
	const count: number = sorted.length;

	const afterIndex: number = after ? sorted.findIndex(({ id }) => id === after.value) : 0;
	const beforeIndex: number = before ? sorted.findIndex(({ id }) => id === before.value) : count;

	const sliceStart: number = Math.max(0, afterIndex);
	const sliceEnd: number = Math.max(0, beforeIndex);

	const cursorLimitedDocs: T[] = sorted.slice(sliceStart, sliceEnd);

	return cursorLimitedDocs;
};

export const limitKeysById = (
	keys: readonly string[],
	pagination: Pick<IPaginationParams, "before" | "after">
): string[] => {
	const { before, after } = pagination;

	const sorted: string[] = sort<string>((a, b) => {
		const strA: string = a.toString();
		const strB: string = b.toString();

		return strA.localeCompare(strB);
	}, keys);
	const count: number = sorted.length;

	const afterIndex: number = after ? sorted.findIndex((key) => key === after.value) : 0;
	const beforeIndex: number = before ? sorted.findIndex((key) => key === before.value) : count;

	const cursorLimitedKeys: string[] = sorted.slice(afterIndex, beforeIndex);

	return cursorLimitedKeys;
};

export const getPaginatedKeys = (
	keys: readonly string[],
	pagination: Pick<IPaginationParams, "first" | "last">
): string[] => {
	const { first, last } = pagination;

	const count: number = keys.length;
	const [skip, limit]: [number, number] = getSkipAndLimit({ count, first, last });

	return keys.slice(skip, skip + limit);
};

export const getPaginatedCursor = async <T>(
	query: IAbstractCursor<T>,
	pagination: Pick<IPaginationParams, "first" | "last">
): Promise<IAbstractCursor<T>> => {
	const { first, last } = pagination;

	const count: number = await query.clone().count();
	const [skip, limit] = getSkipAndLimit({ count, first, last });

	const cursor: IAbstractCursor<T> = query.skip(skip).limit(limit);

	return cursor;
};
