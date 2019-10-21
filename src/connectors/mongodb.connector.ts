import {
	IConnectionInput,
	IDateTimeInput,
	IPaginationParams,
	IVariableDateTimeInput
} from "@/graphql";
import { models } from "@/mongodb";
import { Logger } from "@/utils";
import { isConnectionInput, isVariableDateTimeInput } from "@/validators";
import { ObjectId } from "bson";
import moment from "moment";
import { Cursor } from "mongodb";
import { Types } from "mongoose";
import { isNil, reject } from "ramda";
import {
	AbstractConnector,
	IAbstractCursor,
	IAbstractSource,
	IAbstractSourceWithCursor
} from "./abstract.connector";

const MONTHS_IN_YEAR: number = 12;

const isId = (value: any): value is string => {
	try {
		const strValue: string = value.toString();
		const isValid: boolean = Types.ObjectId.isValid(strValue);

		return !isValid ? false : new ObjectId(strValue).toString() === strValue;
	} catch (err) {
		return false;
	}
};

const idAdjustValue = <T>(value: T): T | ObjectId => (isId(value) ? new ObjectId(value) : value);

const toDate = (dateTime: IDateTimeInput): Date => {
	const month = dateTime.month ? dateTime.month - 1 : 0;

	return moment({ ...dateTime, month }).toDate();
};

const getEndDate = (dateTime: IDateTimeInput): Date => {
	const month = dateTime.month || MONTHS_IN_YEAR;

	return moment({
		day: moment({ ...dateTime, month: month - 1 }).daysInMonth(),
		hours: 23,
		minutes: 59,
		seconds: 59,
		milliseconds: 999,
		...dateTime,
		month: month - 1
	}).toDate();
};

const applyArrayFilter = <T>(
	filter: { [key: string]: any },
	key: string,
	values: T[]
): { [key: string]: any } => {
	const idAdjustedValues: Array<T | ObjectId> = values.map(idAdjustValue);
	const op: string = idAdjustedValues.length ? "$in" : "eq";

	return { ...filter, [key]: { [op]: idAdjustedValues } };
};

const applyDefaultFilter = <T>(
	filter: { [key: string]: any },
	key: string,
	value: T
): { [key: string]: any } => ({ ...filter, [key]: { $eq: idAdjustValue(value) } });

const applyDateTimeInputFilter = (
	filter: { [key: string]: any },
	key: string,
	value: IVariableDateTimeInput
): { [key: string]: any } => {
	const { before, after, equal } = value;
	const oldFilters: Array<{ [key: string]: any }> = filter.$or || [];

	const newFilters: Array<{ [key: string]: any } | null | undefined> = reject(isNil, [
		isNil(before) ? before : { [key]: { $lt: toDate(before) } },
		isNil(after) ? after : { [key]: { $gt: toDate(after) } },
		isNil(equal) ? equal : { [key]: { $lt: getEndDate(equal), $gt: toDate(equal) } }
	]);

	const $or = oldFilters.concat(newFilters);

	return { ...filter, $or };
};

const applyConnectionInputFilter = (
	filter: { [key: string]: any },
	key: string,
	value: IConnectionInput
): { [key: string]: any } => {
	const { someOf, allOf, size, empty } = value;
	const oldFilters: Array<{ [key: string]: any }> = filter.$and || [];

	const newFilters: Array<{ [key: string]: any } | null | undefined> = reject(isNil, [
		isNil(someOf) ? someOf : { [key]: { $in: someOf.map(idAdjustValue) } },
		isNil(allOf) ? allOf : { [key]: { $in: allOf.map(idAdjustValue) } },
		isNil(size) ? size : { [key]: { $size: size } },
		isNil(empty) ? empty : { [key]: empty ? { $size: 0 } : { $not: { $size: 0 } } }
	]);

	const $and = oldFilters.concat(newFilters);

	return { ...filter, $and };
};

const useId = <T extends { _id: string }>(value: T): T & IDataNode => {
	return { ...value, id: value._id };
};

const logOperation = (
	sourceName: string,
	op: string,
	filter: { [key: string]: any }
): typeof Logger | null =>
	process.env.NODE_ENV === "development"
		? Logger.info(`Connector - MongoDB ${sourceName} ${op}: ${JSON.stringify(filter)}`)
		: null;

export class MongoDBConnector extends AbstractConnector {
	public limitQueryWithId<T>(
		source: IAbstractSourceWithCursor<T>,
		filter: { [key: string]: any },
		pagination: Pick<IPaginationParams, "before" | "after">
	): IAbstractCursor<T> {
		const { before, after } = pagination;

		const paginatedFilter: { [key: string]: any } = {
			...filter,
			...((before || after) &&
				typeof filter._id !== "string" && {
					_id: {
						...filter._id,
						...(before && { $lt: new ObjectId(before.value) }),
						...(after && { $gt: new ObjectId(after.value) })
					}
				})
		};

		return source.find(paginatedFilter);
	}

	public get<T>(sourceName: keyof typeof models): IAbstractSource<T> {
		const model: any = models[sourceName];

		return {
			create: (...args) => {
				logOperation(sourceName, "Model.create", args[0]);

				return model.create(...args);
			},
			find: (...args) => {
				logOperation(sourceName, "Model.find", args[0]);

				return model.find(...args).then((results) => results.map(useId));
			},
			findOne: (...args) => {
				logOperation(sourceName, "Model.findOne", args[0]);

				return model.findOne(...args);
			}
		};
	}

	public getWithCursor<T>(sourceName: keyof typeof models): IAbstractSourceWithCursor<T> {
		return {
			find: (...args) => {
				logOperation(sourceName, "Cursor.find", args[0]);

				const cursor: any = models[sourceName].collection.find(...args);

				/* tslint:disable:no-object-mutation */
				/**
				 * !HACK
				 * @description Attempting not having to map `_id` to `id` outside of this
				 * connector. This will require that we overload Cursor.toArray here, which is not
				 * ideal. Eventually, AbstractCursor should be made into a class, such that a
				 * separate MongoDBCursor can be made to avoid this.
				 * @author David Lee
				 * @date September 05, 2019
				 */
				cursor._toArray = cursor.toArray;
				cursor.toArray = () => cursor._toArray().then((results) => results.map(useId));
				/* tslint:enable:no-object-mutation */

				return cursor as Cursor;
			}
		};
	}

	public adaptQueryArgs(queryArgs: { [key: string]: any }): { [key: string]: any } {
		const keys: string[] = Object.keys(queryArgs);

		const adaptedArgs: { [key: string]: any } = keys.reduce<{ [key: string]: any }>(
			(acc, key) => {
				const value = queryArgs[key];
				const adaptedKey: string = key === "id" ? "_id" : key;
				// prettier-ignore
				const extendedAcc: { [key: string]: any } =
					Array.isArray(value)             ? applyArrayFilter(acc, adaptedKey, value)
					: isConnectionInput(value)       ? applyConnectionInputFilter(acc, adaptedKey, value)
					: isVariableDateTimeInput(value) ? applyDateTimeInputFilter(acc, adaptedKey, value)
					                                 : applyDefaultFilter(acc, adaptedKey, value);

				return extendedAcc;
			},
			{}
		);

		return adaptedArgs;
	}
}
