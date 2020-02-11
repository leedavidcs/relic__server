import { ForeignKey } from "@/mongodb";
import { uniqBy } from "lodash";
import { Document, Schema } from "mongoose";
import { IStockPortfolioHeader, StockPortfolioHeaderSchema } from "./header.schema";

export interface IStockPortfolio extends Document {
	user: ForeignKey<"User">;
	name: string;
	headers: readonly IStockPortfolioHeader[];
	tickers: readonly string[];
}

export const StockPortfolioSchema: Schema<IStockPortfolio> = new Schema({
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
		default: [],
		validate: {
			validator: (headers: readonly IStockPortfolioHeader[]) => {
				const uniqByName: readonly IStockPortfolioHeader[] = uniqBy(headers, "name");
				const isAllUniq: boolean = uniqByName.length === headers.length;

				return isAllUniq;
			},
			msg: "Header names must be unique."
		}
	},
	tickers: {
		type: [String],
		default: []
	}
});

// Add created and updated ats

StockPortfolioSchema.index({ user: 1, name: 1 }, { unique: true });
