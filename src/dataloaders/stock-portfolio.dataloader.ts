import { IStockPortfolio, models } from "@/mongodb";
import DataLoader, { BatchLoadFn } from "dataloader";
import { getOrderedMongoDBResults, logOperation } from "./utils";

const batchById: BatchLoadFn<string, IStockPortfolio & IDataNode> = async (keys: string[]) => {
	const filter = { _id: { $in: keys } };

	logOperation("StockPortfolio", "MongoDB.Model.find", filter);

	const stockPortfolios = await models.StockPortfolio.find(filter)
		.lean()
		.then((results) => getOrderedMongoDBResults(keys, results));

	return stockPortfolios as Array<IStockPortfolio & IDataNode>;
};

export const stockPortfolioById = (): DataLoader<string, IStockPortfolio & IDataNode> =>
	new DataLoader(batchById);
