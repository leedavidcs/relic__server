import { Document, model, Model, Schema } from "mongoose";
import { ForeignKey } from ".";

interface IStockPortfolioHeader {
	name: string;
	dataKey: string | null;
	width: number;
	resizable: boolean;
}

export interface IStockPortfolio extends Document {
	user: ForeignKey<"User">;
	headers: ReadonlyArray<IStockPortfolioHeader>;
	tickers: ReadonlyArray<string>;
}

const StockPortfolioSchema: Schema<IStockPortfolio> = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	headers: {
		type: [
			{
				name: {
					type: String,
					required: true
				},
				dataKey: {
					type: String,
					default: null
				},
				width: {
					type: Number,
					required: true
				},
				resizable: {
					type: Boolean,
					required: true
				}
			}
		],
		required: true
	},
	tickers: {
		type: [String],
		default: []
	}
});

export const StockPortfolioModel: Model<IStockPortfolio> = model<IStockPortfolio>(
	"StockPortfolio",
	StockPortfolioSchema
);
