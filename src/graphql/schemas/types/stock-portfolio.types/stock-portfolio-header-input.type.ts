import { inputObjectType } from "nexus";

export const StockPortfolioHeaderInput = inputObjectType({
	name: "StockPortfolioHeaderInput",
	definition: (t) => {
		t.string("name", { required: true });
		t.string("dataKey", { required: true });
		t.int("width", { required: true });
		t.boolean("frozen", { required: true });
		t.boolean("resizable", { required: true });
	}
});
