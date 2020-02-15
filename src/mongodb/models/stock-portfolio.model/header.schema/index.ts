import { Schema } from "mongoose";
import { DataKeys } from "./data-keys";

export * from "./data-keys";

export interface IStockPortfolioHeader {
	name: string;
	dataKey: keyof typeof DataKeys | null;
	width: number;
	resizable: boolean;
}

export const StockPortfolioHeaderSchema: Schema<IStockPortfolioHeader> = new Schema({
	name: {
		type: String,
		required: true
	},
	dataKey: {
		type: String,
		enum: Object.keys(DataKeys).map((key) => DataKeys[key]),
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
});
