import { objectType } from "nexus";
import { getStockPortfolioData } from "./get-stock-portfolio-data";

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	description: "StockPortfolio entity. This is what gets shown on the data grid",
	definition: (t) => {
		t.implements("ConnectionNode");
		t.field("user", {
			type: "User",
			nullable: false,
			description: "The user that this stock portfolio belongs to. Also the creator",
			complexity: 1
		});
		t.string("name", { description: "The name, the user has given to this stock portfolio" });
		t.list.field("headers", {
			type: "StockPortfolioHeader",
			nullable: false,
			description: "The headers (configs) for this data grid, including how data is resolved"
		});
		t.list.string("tickers", {
			nullable: false,
			description: "The tickers that are the rows for this data grid"
		});
		t.list.field("data", {
			type: "JSONObject",
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: (parent, args) => getStockPortfolioData(parent, args)
		});
	}
});
