import { extendType } from "nexus";

export const deleteOneStockPortfolio = extendType({
	type: "Mutation",
	definition: (t) => {
		t.crud.deleteOneStockPortfolio();
	}
});
