import { objectType } from "nexus";
import { getStockPortfolioData } from "./get-stock-portfolio-data";

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	description: "StockPortfolio entity. This is what gets shown on the data grid",
	definition: (t) => {
		t.model.id();
		t.model.user();
		t.model.name();
		t.model.headers();
		t.model.tickers();
		t.list.field("data", {
			type: "JSONObject",
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: (parent, args, ctx) => getStockPortfolioData(parent, ctx)
		});
		t.model.createdAt();
		t.model.updatedAt();
	}
});
