import { arg, inputObjectType, mutationField, objectType } from "nexus";

export const CreateStockPortfolioInput = inputObjectType({
	name: "CreateStockPortfolioInput",
	definition: (t) => {
		t.string("name", {
			description: "(Unique) The name of this stock portfolio.",
			default: "New_Portfolio"
		});
	}
});

export const CreateStockPortfolioPayload = objectType({
	name: "CreateStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: "StockPortfolio"
		});
	}
});

export const createStockPortfolio = mutationField("createStockPortfolio", {
	type: CreateStockPortfolioPayload,
	args: {
		input: arg({
			type: "CreateStockPortfolioInput",
			required: true
		})
	},
	complexity: 1
});
