import { arg, inputObjectType, mutationField } from "nexus";

export const StockPortfolioUpdateInput = inputObjectType({
	name: "StockPortfolioUpdateInput",
	definition: (t) => {
		t.id("id", { nullable: false });
		t.string("name");
		t.list.string("tickers");
		t.list.field("headers", { type: "StockPortfolioHeaderInput" });
	}
});

export const updateOneStockPortfolio = mutationField("updateOneStockPortfolio", {
	type: "StockPortfolio",
	nullable: false,
	args: {
		data: arg({
			type: "StockPortfolioUpdateInput",
			nullable: false
		})
	},
	resolve: async (parent, { data }, { prisma }) => {
		const updatedStockPortfolio = await prisma.stockPortfolio.update({
			where: { id: data.id },
			data: {
				name: data.name,
				tickers: { set: data.tickers || [] },
				headers: { create: data.headers }
			}
		});

		return updatedStockPortfolio;
	}
});
