import { extendType } from "nexus";

export const stockPortfolios = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.stockPortfolios({ filtering: true, ordering: true });
		t.crud.stockPortfolio();
	}
});
