import { Document, model, Model, Schema } from "mongoose";
import { prop, uniqBy } from "ramda";
import { ForeignKey } from "..";
import { DataKeys } from "./data-keys";

export * from "./data-keys";

interface IStockPortfolioHeader {
	name: string;
	dataKey: keyof typeof DataKeys | null;
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
			}
		],
		default: [],
		validate: {
			validator: (headers: IStockPortfolio["headers"]) => {
				const uniqByName: IStockPortfolio["headers"] = uniqBy(prop("name"), headers);

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

export const StockPortfolioModel: Model<IStockPortfolio> = model<IStockPortfolio>(
	"StockPortfolio",
	StockPortfolioSchema
);
