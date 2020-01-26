import { IUser } from "@/mongodb";
import DataLoader from "dataloader";
import { batchById } from "./utils";

export const userById = (): DataLoader<string, IUser & IDataNode> => {
	return new DataLoader((keys: readonly string[]) => batchById("User", keys));
};
