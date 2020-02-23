import { inputObjectType } from "nexus";

export const StockPortfolioHeaderInput = inputObjectType({
	name: "StockPortfolioHeaderInput",
	definition: (t) => {
		t.string("name", { required: true });
		t.string("dataKey", { required: true });
		t.int("width", { required: true });
		t.list.string("tickers", { required: true });
	}
});
