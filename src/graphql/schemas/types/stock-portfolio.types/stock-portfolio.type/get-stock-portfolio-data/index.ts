import { IServerContext } from "@/graphql";
import { DataKeys, Prefixes, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { doesExist } from "@/utils";
import { isNil } from "lodash";
import { getIexCompanyData } from "./get-iex-company-data";
import { getIexKeyStatsData } from "./get-iex-key-stats-data";
import { getIexPreviousDayPriceData } from "./get-iex-previous-day-price-data";
import { getIexQuoteData } from "./get-iex-quote-data";
import { IServerContextWithUser } from "@/graphql/context";

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
	dataKeys: readonly Maybe<string>[]
): Record<keyof typeof Prefixes, readonly string[]> => {
	const withoutNulls: readonly string[] = dataKeys.filter(doesExist);
	const prefixedTuples: readonly [keyof typeof Prefixes, string][] = withoutNulls.map(
		createPrefixedTuple
	);

	const groupedByPrefix: Record<keyof typeof Prefixes, readonly string[]> = prefixedTuples.reduce(
		(acc, [prefix, prop]) => ({
			...acc,
			[prefix]: (acc[prefix] || []).concat(prop)
		}),
		{} as Record<keyof typeof Prefixes, readonly string[]>
	);

	return groupedByPrefix;
};

const getDataForTicker = async (
	ticker: string,
	groupedKeys: Record<keyof typeof Prefixes, readonly string[]>,
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
	headers
): Record<string, any> => {
	const headersToResults: Record<string, any> = headers.reduce((acc, { name, dataKey }) => {
		if (!dataKey) {
			return acc;
		}

		const result = resultsMap[dataKey];

		return { ...acc, [name]: isNil(result) ? null : result };
	}, {} as Record<string, any>);

	return headersToResults;
};

export const getStockPortfolioData = async (
	stockPortfolio,
	context: IServerContextWithUser
): Promise<Record<string, any>[]> => {
	const { headers, tickers } = stockPortfolio;

	const dataKeys: readonly Maybe<keyof typeof DataKeys>[] = headers.map(({ dataKey }) => dataKey);

	const groupedByPrefix = groupKeysByPrefix(dataKeys);

	const stockPortfolioData: Record<string, any>[] = await Promise.all(
		tickers.map(async (ticker) => {
			const resultsMap = await getDataForTicker(ticker, groupedByPrefix, context);
			const mappedToHeaders = assignDataToHeaders(resultsMap, headers);

			return mappedToHeaders;
		})
	);

	return stockPortfolioData;
};
