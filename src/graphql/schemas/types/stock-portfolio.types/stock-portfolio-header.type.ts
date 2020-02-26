import { objectType } from "nexus";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	description: "A column configuration for the stock portfolio on the data grid",
	definition: (t) => {
		t.model.name();
		t.model.dataKey();
		t.model.width();
		t.model.frozen();
		t.model.resizable();
	}
});
