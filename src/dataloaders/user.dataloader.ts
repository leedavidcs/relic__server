import { IUser } from "@/mongodb";
import DataLoader from "dataloader";
import { batchById } from "./utils";

export const userById = (): DataLoader<string, IUser & IDataNode> => {
	return new DataLoader((keys: string[]) => batchById("User", keys));
};
