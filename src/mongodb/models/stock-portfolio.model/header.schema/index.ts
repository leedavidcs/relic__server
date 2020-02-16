import { Schema, SchemaDefinition } from "mongoose";
import { DataKeys } from "./data-keys";

export * from "./data-keys";

interface IColumnConfig {
	width: number;
	frozen: boolean;
	resizable: boolean;
}

export interface IStockPortfolioHeader extends IColumnConfig {
	name: string;
	dataKey: keyof typeof DataKeys | null;
}

/* column configs, for front-end data-grid purposes */
const columnConfig: SchemaDefinition = {
	/* The display-width of this column */
	width: {
		type: Number,
		default: 100
	},
	/* Whether the column could be moved */
	frozen: {
		type: Boolean,
		default: false
	},
	/* Whether the column's width could be resized */
	resizable: {
		type: Boolean,
		default: true
	}
};

export const StockPortfolioHeaderSchema: Schema<IStockPortfolioHeader> = new Schema({
	/* The display-label to be used for this property (column) */
	name: {
		type: String,
		required: true
	},
	/* The key of the data that is fetched for this property */
	dataKey: {
		type: String,
		enum: Object.keys(DataKeys).map((key) => DataKeys[key]),
		default: null
	},
	...columnConfig
});
