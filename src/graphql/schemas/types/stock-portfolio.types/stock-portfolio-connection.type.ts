import { objectType } from "nexus";

export const StockPortfolioConnection = objectType({
	name: "StockPortfolioConnection",
	description:
		"The stock portfolio connection, from which pagination and resource info can be gotten",
	definition: (t) => {
		t.implements("Connection");
		t.list.field("edges", {
			type: "StockPortfolioEdge",
			nullable: false,
			description: "Holds cursor and resource information"
		});
		t.list.field("nodes", {
			type: "StockPortfolio",
			nullable: false,
			description: "Convenience property to avoid nesting"
		});
	}
});
