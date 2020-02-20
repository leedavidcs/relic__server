import { IServerContext } from "@/graphql";
import { ConnectionEdge, resolveRootConnection } from "@/graphql/resolvers/connection.resolver";
import { IStockPortfolio } from "@/mongodb";
import { Logger, NotFoundError, UnexpectedError } from "@/utils";
import { IFieldResolver, IResolverObject } from "graphql-tools";
import { getStockPortfolioData } from "./get-stock-portfolio-data";

export * from "./get-stock-portfolio-data";

const stockPortfolios: IFieldResolver<any, IServerContext, any> = async (parent, args, context) => {
	const {
		loaders: { stockPortfolio },
		user
	} = context;

	if (!user) {
		throw new UnexpectedError();
	}

	const userId: string = user.id;
	const filter: { [key: string]: any } = { ...args, user: userId };

	const result = await resolveRootConnection("StockPortfolio", filter, stockPortfolio, context);

	return result;
};

const createStockPortfolio: IFieldResolver<any, IServerContext, any> = async (
	parent,
	args,
	{ connectors: { MongoDB }, user }
) => {
	if (user === null) {
		throw new Error("Should not reach here: User is not found.");
	}

	const result: IStockPortfolio = await MongoDB.get<IStockPortfolio>("StockPortfolio").create({
		user: user.id
	});

	return result;
};

const updateStockPortfolio: IFieldResolver<any, IServerContext, any> = async (
	parent,
	{ input: { id, headers, tickers } },
	{ connectors: { MongoDB }, user }
) => {
	if (user === null) {
		throw new Error("Should not reach here: User is not found.");
	}

	const stockPortfolioSource = MongoDB.get<IStockPortfolio>("StockPortfolio");

	let toUpdate: IStockPortfolio | null = null;

	try {
		toUpdate = await stockPortfolioSource.findOne({ id, user: user.id });
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

	return updated;
};

const deleteStockPortfolio: IFieldResolver<any, IServerContext, any> = async (
	parent,
	{ input: { id } },
	{ connectors: { MongoDB }, user }
) => {
	if (user === null) {
		throw new Error("Should not reach here: User is not found");
	}

	const stockPortfolioSource = MongoDB.get<IStockPortfolio>("StockPortfolio");

	let deleted: IStockPortfolio | null = null;

	try {
		deleted = await stockPortfolioSource.findOneAndDelete({ id, user: user.id });
	} catch (err) {
		Logger.error(`Error: depeteStockPortfolio resolver: ${err}`);

		throw new Error(`Could not delete the stock portfolio. (id = ${id})`);
	}

	if (!deleted) {
		throw new NotFoundError(`Stock portfolio could not be found. (id = ${id})`);
	}

	return deleted;
};

const StockPortfolio: IResolverObject<IStockPortfolio, IServerContext> = {
	user: ({ user }, args, { loaders }) => loaders.userById.load(user),
	data: (parent, args, context) => getStockPortfolioData(parent, context)
};

const StockPortfolioEdge: IResolverObject<IStockPortfolio, IServerContext> = ConnectionEdge;

export const StockPortfolioTypes = {
	StockPortfolio,
	StockPortfolioEdge
};

export const StockPortfolioQueries: IResolverObject = {
	stockPortfolios
};

export const StockPortfolioMutations: IResolverObject = {
	createStockPortfolio,
	deleteStockPortfolio,
	updateStockPortfolio
};
