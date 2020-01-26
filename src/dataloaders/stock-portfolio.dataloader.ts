import { IStockPortfolio } from "@/mongodb";
import DataLoader from "dataloader";
import { batchById, batchByIdAndFilters, IObjectFilterKey } from "./utils";

export const stockPortfolioById = (): DataLoader<string, IStockPortfolio & IDataNode> => {
	return new DataLoader((keys: ReadonlyArray<string>) => batchById("StockPortfolio", keys));
};

export const stockPortfolio = (): DataLoader<
	IObjectFilterKey,
	(IStockPortfolio & IDataNode) | null
> => new DataLoader((keys) => batchByIdAndFilters("StockPortfolio", keys));
