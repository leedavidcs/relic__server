import { Document } from "mongoose";

export const getOrderedMongoDBResults = <T extends Document>(
	keys: readonly string[],
	results: T[]
) => {
	const dict = results.reduce((acc, item) => {
		const newAcc = { ...acc, [item._id]: { ...item, id: item._id } };

		return newAcc;
	}, {} as { [key: string]: T & IDataNode });

	const orderedResults: ((T & IDataNode) | null)[] = keys.map((key) => dict[key] || null);

	return orderedResults;
};
