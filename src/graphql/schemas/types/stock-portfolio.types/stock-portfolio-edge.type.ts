import { objectType } from "nexus";

export const StockPortfolioEdge = objectType({
	name: "StockPortfolioEdge",
	description: "Connection edges, which hold cursor and resource information",
	definition: (t) => {
		t.implements("ConnectionEdge");
		t.field("node", {
			type: "StockPortfolio",
			nullable: false,
			description: "The actual stock portfolio data"
		});
	}
});
