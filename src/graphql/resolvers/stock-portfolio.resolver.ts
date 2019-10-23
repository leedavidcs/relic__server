import { IServerContext } from "@/graphql";
import { IStockPortfolio } from "@/mongodb";
import { IFieldResolver, IResolverObject } from "graphql-tools";

const createStockPortfolio: IFieldResolver<any, IServerContext, any> = async (
	parent,
	args,
	{ connectors: { MongoDB } }
) => {
	const result: IStockPortfolio = await MongoDB.get<IStockPortfolio>("StockPortfolio").create({});

	return result;
};

const StockPortfolio: IResolverObject<IStockPortfolio, IServerContext> = {
	user: ({ user }, args, { loaders }) => loaders.userById.load(user)
};

export const StockPortfolioTypes = {
	StockPortfolio
};

export const StockPortfolioMutations: IResolverObject = {
	createStockPortfolio
};
