import { IUser, models } from "@/mongodb";
import DataLoader, { BatchLoadFn } from "dataloader";
import { getOrderedMongoDBResults, logOperation } from "./utils";

const batchById: BatchLoadFn<string, IUser & IDataNode> = async (keys: string[]) => {
	const filter = { _id: { $in: keys } };

	logOperation("User", "MongoDB.Model.find", filter);

	const users = await models.User.find(filter)
		.lean()
		.then((results) => getOrderedMongoDBResults(keys, results));

	return users as Array<IUser & IDataNode>;
};

export const userById = (): DataLoader<string, IUser & IDataNode> => new DataLoader(batchById);
