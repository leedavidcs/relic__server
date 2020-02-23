import { arg, inputObjectType, mutationField, objectType } from "nexus";

export const DeleteStockPortfolioInput = inputObjectType({
	name: "DeleteStockPortfolioInput",
	definition: (t) => {
		t.id("id", {
			required: true,
			description: "Id of the stock portfolio to delete"
		});
	}
});

export const DeleteStockPortfolioPayload = objectType({
	name: "DeleteStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: "StockPortfolio"
		});
	}
});

export const deleteStockPortfolio = mutationField("deleteStockPortfolio", {
	type: "DeleteStockPortfolioPayload",
	args: {
		input: arg({
			type: "DeleteStockPortfolioInput",
			required: true
		})
	},
	complexity: 1
});
