import { models } from "@/mongodb";
import { getOrderedMongoDBResults, logOperation } from "..";

export const batchById = async <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	sourceName: S,
	keys: string[]
) => {
	const filter = { _id: { $in: keys } };

	logOperation(sourceName, "MongoDB.Model.find", filter);

	const results = await models[sourceName].find(filter).lean();
	const ordered = getOrderedMongoDBResults(keys, results);

	return ordered as Array<T & IDataNode>;
};
