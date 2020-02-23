import { arg, inputObjectType, mutationField, objectType } from "nexus";

export const UpdateStockPortfolioInput = inputObjectType({
	name: "UpdateStockPortfolioInput",
	definition: (t) => {
		t.id("id", {
			required: true,
			description: "The ID of the stock portfolio to update"
		});
		t.list.field("headers", {
			type: "StockPortfolioHeaderInput",
			description: "Headers for this data grid, including how data is resolved"
		});
		t.list.string("tickers", {
			description: "The tickers that are the rows for this data grid"
		});
	}
});

export const UpdateStockPortfolioPayload = objectType({
	name: "UpdateStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: "StockPortfolio"
		});
	}
});

export const updateStockPortfolio = mutationField("updateStockPortfolio", {
	type: UpdateStockPortfolioPayload,
	args: {
		input: arg({
			type: "UpdateStockPortfolioInput",
			required: true
		})
	},
	complexity: 1
});
