import { StockPortfolio } from "@prisma/client";
import { arg, inputObjectType, mutationField } from "nexus";
import { getUniqueName } from "./get-unique-name";

export const StockPortfolioCreateInput = inputObjectType({
	name: "StockPortfolioCreateInput",
	definition: (t) => {
		t.string("name", {
			nullable: false
		});
	}
});

export const createOneStockPortfolio = mutationField("createOneStockPortfolio", {
	type: "StockPortfolio",
	nullable: false,
	args: {
		data: arg({
			type: "StockPortfolioCreateInput",
			required: true
		})
	},
	resolve: async (parent, { data }, ctx) => {
		const { prisma, user } = ctx;

		const uniqueName: string = await getUniqueName(data.name, ctx);

		const stockPortfolio: StockPortfolio = await prisma.stockPortfolio.create({
			data: {
				user: { connect: { id: user.id } },
				name: uniqueName,
				tickers: { set: [] }
			}
		});

		return stockPortfolio;
	},
	complexity: 1
});
