import { objectType } from "nexus";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	description: "A column configuration for the stock portfolio on the data grid",
	definition: (t) => {
		t.string("name", {
			description: "The name displayed for this column header",
			nullable: false
		});
		t.field("dataKey", {
			type: "DataKey",
			description: "The dataKey, which determines how values in this column are resolved"
		});
		t.int("width", {
			description: "The configured width of this column",
			nullable: false
		});
		t.boolean("frozen", {
			description: "Whether this column could be moved",
			nullable: false
		});
		t.boolean("resizable", {
			description: "Whether this column could be resized",
			nullable: false
		});
	}
});
