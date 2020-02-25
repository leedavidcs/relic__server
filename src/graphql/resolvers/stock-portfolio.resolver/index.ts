import { IServerContextWithUser } from "@/graphql";
import { IStockPortfolio } from "@/mongodb";
import { Logger, NotFoundError } from "@/utils";
import { IFieldResolver, IResolverObject } from "graphql-tools";
import { getUniqueName } from "./get-unique-name";

const createStockPortfolio: IFieldResolver<any, IServerContextWithUser, any> = async (
	parent,
	{ input: { name } },
	{ connectors: { MongoDB }, user }
) => {
	const source = MongoDB.get<IStockPortfolio>("StockPortfolio");
	const uniqueName: string = await getUniqueName(name, source);

	const created: IStockPortfolio = await source.create({
		name: uniqueName,
		user: user.id
	});

	return { stockPortfolio: created };
};

const updateStockPortfolio: IFieldResolver<any, IServerContextWithUser, any> = async (
	parent,
	{ input: { id, headers, tickers } },
	{ connectors: { MongoDB }, user }
) => {
	const source = MongoDB.get<IStockPortfolio>("StockPortfolio");

	let toUpdate: IStockPortfolio | null = null;

	try {
		toUpdate = await source.findOne({ id, user: user.id });
	} catch (err) {
		Logger.error(`Error: updateStockPortfolio resolver: ${err}`);

		throw new Error(`Could not update the stock portfolio. (id = ${id})`);
	}

	if (!toUpdate) {
		throw new NotFoundError(`Stock portfolio could not be found. (id = ${id})`);
	}

	toUpdate.headers = headers;
	toUpdate.tickers = tickers;

	const updated: IStockPortfolio = await toUpdate.save();

	return { stockPortfolio: updated };
};

const deleteStockPortfolio: IFieldResolver<any, IServerContextWithUser, any> = async (
	parent,
	{ input: { id } },
	{ connectors: { MongoDB }, user }
) => {
	const source = MongoDB.get<IStockPortfolio>("StockPortfolio");

	let deleted: IStockPortfolio | null = null;

	try {
		deleted = await source.findOneAndDelete({ id, user: user.id });
	} catch (err) {
		Logger.error(`Error: depeteStockPortfolio resolver: ${err}`);

		throw new Error(`Could not delete the stock portfolio. (id = ${id})`);
	}

	if (!deleted) {
		throw new NotFoundError(`Stock portfolio could not be found. (id = ${id})`);
	}

	return { stockPortfolio: deleted };
};

const StockPortfolio: IResolverObject<IStockPortfolio, IServerContextWithUser> = {
	user: ({ user }, args, { loaders }) => loaders.userById.load(user)
};

export const StockPortfolioTypes = {
	StockPortfolio
};

export const StockPortfolioMutations: IResolverObject = {
	createStockPortfolio,
	deleteStockPortfolio,
	updateStockPortfolio
};
