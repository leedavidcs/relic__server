import { model, Model } from "mongoose";
import { IStockPortfolio, StockPortfolioSchema } from "./schema";

export * from "./header.schema";
export { IStockPortfolio } from "./schema";

export const StockPortfolioModel: Model<IStockPortfolio> = model<IStockPortfolio>(
	"StockPortfolio",
	StockPortfolioSchema
);
