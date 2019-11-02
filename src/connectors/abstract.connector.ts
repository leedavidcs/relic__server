import { IConnectionQueryArgs, IPaginationParams } from "@/graphql";

export interface IAbstractCursor<T> {
	clone: () => IAbstractCursor<T>;
	count: () => Promise<number>;
	limit: (value: number) => IAbstractCursor<T>;
	skip: (value: number) => IAbstractCursor<T>;
	toArray: (
		callback?: (error: Error | null, result: T) => void
	) => PromiseLike<Array<T & IDataNode>>;
}

export interface IAbstractSource<T> {
	create: (...args: any[]) => PromiseLike<T>;
	find: (...args: any[]) => PromiseLike<T[]>;
	findOne: (...args: any[]) => PromiseLike<T | null>;
	findOneAndDelete: (...args: any[]) => PromiseLike<T>;
}

export interface IAbstractSourceWithCursor<T> {
	find: (...args: any[]) => IAbstractCursor<T>;
}

export abstract class AbstractConnector {
	public abstract limitQueryWithId<T>(
		source: IAbstractSourceWithCursor<T>,
		filter: { [key: string]: any },
		pagination: Pick<IPaginationParams, "before" | "after">
	): IAbstractCursor<T>;

	public abstract get<T>(sourceName: string): IAbstractSource<T>;

	public abstract getWithCursor<T>(sourceName: string): IAbstractSourceWithCursor<T>;

	public abstract adaptQueryArgs(queryArgs: { [key: string]: any }): { [key: string]: any };

	public limitFilterToIds<F extends IConnectionQueryArgs>(
		ids: string[],
		filter: F
	): { [key: string]: any } {
		const { id: filterId, ...restArgs } = filter;

		const restrictedIds: string[] = filterId ? ids.filter((id) => id === filterId) : ids;

		return {
			id: restrictedIds,
			...restArgs
		};
	}
}
