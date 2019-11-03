import { IServerContext } from "@/graphql";
import { DataKeys, IStockPortfolio, PREFIX_PROP_DELIMITER, Prefixes } from "@/mongodb";
import { doesExist } from "@/utils";
import { isNil } from "ramda";
import { getIexCompanyData } from "./get-iex-company-data";
import { getIexKeyStatsData } from "./get-iex-key-stats-data";
import { getIexPreviousDayPriceData } from "./get-iex-previous-day-price-data";
import { getIexQuoteData } from "./get-iex-quote-data";

export * from "./get-iex-company-data";
export * from "./get-iex-key-stats-data";
export * from "./get-iex-previous-day-price-data";
export * from "./get-iex-quote-data";

const createPrefixedTuple = (dataKey: string): [keyof typeof Prefixes, string] => {
	const [prefix, prop] = dataKey.split(PREFIX_PROP_DELIMITER);

	if (!prefix || !prop) {
		throw new Error(`Invalid data key: ${dataKey}`);
	}

	if (!(prefix in Prefixes)) {
		throw new Error(`Invalid data key: ${dataKey}`);
	}

	return [prefix as keyof typeof Prefixes, prop];
};

const groupKeysByPrefix = (
	dataKeys: ReadonlyArray<string | null>
): { [key in keyof typeof Prefixes]: ReadonlyArray<string> } => {
	const withoutNulls: ReadonlyArray<string> = dataKeys.filter(doesExist);
	const prefixedTuples: ReadonlyArray<[keyof typeof Prefixes, string]> = withoutNulls.map(
		createPrefixedTuple
	);

	const groupedByPrefix: {
		[key in keyof typeof Prefixes]: ReadonlyArray<string>;
	} = prefixedTuples.reduce(
		(acc, [prefix, prop]) => ({
			...acc,
			[prefix]: (acc[prefix] || []).concat(prop)
		}),
		{} as { [key in keyof typeof Prefixes]: ReadonlyArray<string> }
	);

	return groupedByPrefix;
};

const getDataForTicker = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: ReadonlyArray<string> },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexCompanyData = await getIexCompanyData(ticker, groupedKeys, context);
	const iexKeyStatsData = await getIexKeyStatsData(ticker, groupedKeys, context);
	const iexPreviousDayPriceData = await getIexPreviousDayPriceData(ticker, groupedKeys, context);
	const iexQuoteData = await getIexQuoteData(ticker, groupedKeys, context);

	return {
		...iexCompanyData,
		...iexKeyStatsData,
		...iexPreviousDayPriceData,
		...iexQuoteData
	};
};

const assignDataToHeaders = (
	resultsMap: { [dataKey in keyof typeof DataKeys]?: any },
	headers: IStockPortfolio["headers"]
): { [key: string]: any } => {
	const headersToResults: { [key: string]: any } = headers.reduce(
		(acc, { name, dataKey }) => {
			if (dataKey === null) {
				return acc;
			}

			const result = resultsMap[dataKey];

			return { ...acc, [name]: isNil(result) ? null : result };
		},
		{} as { [key: string]: any }
	);

	return headersToResults;
};

export const getStockPortfolioData = async (
	stockPortfolio: IStockPortfolio,
	context: IServerContext
): Promise<{ [key: string]: any }> => {
	const { headers, tickers } = stockPortfolio;

	const dataKeys: ReadonlyArray<keyof typeof DataKeys | null> = headers.map(
		({ dataKey }) => dataKey
	);

	const groupedByPrefix = groupKeysByPrefix(dataKeys);

	const stockPortfolioData: ReadonlyArray<{ [key: string]: any }> = await Promise.all(
		tickers.map(async (ticker) => {
			const resultsMap = await getDataForTicker(ticker, groupedByPrefix, context);
			const mappedToHeaders = assignDataToHeaders(resultsMap, headers);

			return mappedToHeaders;
		})
	);

	return stockPortfolioData;
};
