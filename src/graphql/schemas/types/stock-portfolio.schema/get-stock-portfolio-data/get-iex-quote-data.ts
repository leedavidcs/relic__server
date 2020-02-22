import { IServerContext } from "@/graphql";
import { DataKeys, Prefixes, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { Quote } from "iexcloud_api_wrapper";

export const IexQuoteSuffixToPropMap: { [key: string]: keyof Quote } = {
	SYMBOL: "symbol",
	COMPANY_NAME: "companyName",
	CALCULATION_PRICE: "calculationPrice",
	OPEN: "open",
	OPEN_TIME: "openTime",
	CLOSE: "close",
	CLOSE_TIME: "closeTime",
	HIGH: "high",
	LOW: "low",
	LATEST_PRICE: "latestPrice",
	LATEST_SOURCE: "latestSource",
	LATEST_TIME: "latestTime",
	LATEST_UPDATE: "latestUpdate",
	LATEST_VOLUME: "latestVolume",
	IEX_REAL_TIME_PRICE: "iexRealtimePrice",
	IEX_REAL_TIME_SIZE: "iexRealtimeSize",
	IEX_LAST_UPDATED: "iexLastUpdated",
	DELAYED_PRICE: "delayedPrice",
	DELAYED_PRICE_TIME: "delayedPriceTime",
	EXTENDED_PRICE: "extendedPrice",
	EXTENDED_CHANGE: "extendedChange",
	EXTENDED_CHANGE_PERCENT: "extendedChangePercent",
	EXTENDED_PRICE_TIME: "extendedPriceTime",
	PREVIOUS_CLOSE: "previousClose",
	CHANGE: "change",
	CHANGE_PERCENT: "changePercent",
	IEX_MARKET_PERCENT: "iexMarketPercent",
	IEX_VOLUME: "iexVolume",
	AVG_TOTAL_VOLUME: "avgTotalVolume",
	IEX_BID_PRICE: "iexBidPrice",
	IEX_BID_SIZE: "iexBidSize",
	IEX_ASK_PRICE: "iexAskPrice",
	IEX_ASK_SIZE: "iexAskSize",
	MARKET_CAP: "marketCap",
	WEEK_52_HIGH: "week52High",
	WEEK_52_LOW: "week52Low",
	YTD_CHANGE: "ytdChange"
};

export const getIexQuoteData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: readonly string[] },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexQuoteKeys: readonly string[] = groupedKeys[Prefixes.IEX_QUOTE];

	if (!iexQuoteKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const quote: Quote = await IexAPI.getQuote(ticker);

	return iexQuoteKeys.reduce((acc, key) => {
		const quoteProp: keyof Quote | null = IexQuoteSuffixToPropMap[key] || null;

		return {
			...acc,
			...(quoteProp && {
				[`${Prefixes.IEX_QUOTE}${PREFIX_PROP_DELIMITER}${key}`]: quote[quoteProp]
			})
		};
	}, {} as { [key in keyof typeof DataKeys]?: any });
};
