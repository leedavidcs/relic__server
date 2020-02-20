import { ForeignKey } from "@/mongodb";
import { Document, Schema } from "mongoose";
import { IStockPortfolioHeader, StockPortfolioHeaderSchema } from "./header.schema";

export interface IStockPortfolio extends Document {
	user: ForeignKey<"User">;
	name: string;
	headers: readonly IStockPortfolioHeader[];
	tickers: readonly string[];
}

export const StockPortfolioSchema: Schema<IStockPortfolio> = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		name: {
			type: String,
			required: true
		},
		headers: {
			type: [StockPortfolioHeaderSchema],
			default: []
		},
		tickers: {
			type: [String],
			default: []
		}
	},
	{ timestamps: true }
);

StockPortfolioSchema.index({ user: 1, name: 1 }, { unique: true });
