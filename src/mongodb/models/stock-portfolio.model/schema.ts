import { ForeignKey } from "@/mongodb";
import { Document, Schema } from "mongoose";
import { IStockPortfolioHeader, StockPortfolioHeaderSchema } from "./header.schema";
import { setUniqueName } from "./set-unique-name.middleware";

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
			default: "New_Portfolio"
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

StockPortfolioSchema.pre("validate", async function(next) {
	const stockPortfolio = this as IStockPortfolio;

	try {
		await setUniqueName(stockPortfolio);

		next();
	} catch (err) {
		next(err);
	}
});
