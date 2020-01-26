import { getOrderedMongoDBResults, logOperation } from "@/dataloaders/utils";
import { models } from "@/mongodb";
import { Document } from "mongoose";

export const batchById = async <
	S extends keyof typeof models,
	T extends InstanceType<typeof models[S]> = InstanceType<typeof models[S]>
>(
	sourceName: S,
	keys: readonly string[]
) => {
	const filter = { _id: { $in: keys } };

	logOperation(sourceName, "MongoDB.Model.find", filter);

	const results: Document[] = await models[sourceName].find(filter).lean();
	const ordered = getOrderedMongoDBResults(keys, results);

	return ordered as (T & IDataNode)[];
};
