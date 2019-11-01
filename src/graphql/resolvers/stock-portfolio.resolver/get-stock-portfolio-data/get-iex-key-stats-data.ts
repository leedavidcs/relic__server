import { IServerContext } from "@/graphql";
import { DataKeys, Prefixes } from "@/mongodb";
import { KeyStats } from "iexcloud_api_wrapper";

const IexKeyStatsSuffixToPropMap: { [key: string]: keyof KeyStats } = {
	COMPANY_NAME: "companyName",
	MARKET_CAP: "marketcap",
	WEEK_52_HIGH: "week52high",
	WEEK_52_LOW: "week52low",
	WEEK_52_CHANGE: "week52change",
	SHARES_OUTSTANDING: "sharesOutstanding",
	FLOAT: "float",
	SYMBOL: "symbol",
	AVG_10_VOLUME: "avg10Volume",
	AVG_30_VOLUME: "avg30Volume",
	DAY_200_MOVINGAVG: "day200MovingAvg",
	DAY_50_MOVINGAVG: "day50MovingAvg",
	EMPLOYEES: "employees",
	TTM_EPS: "ttmEPS",
	TTM_DIVIDEND_RATE: "ttmDividendRate",
	DIVIDEND_YIELD: "dividendYield",
	NEXT_DIVIDEND_DATE: "nextDividendDate",
	EX_DIVIDEND_DATE: "exDividendDate",
	NEXT_EARNINGS_DATE: "nextEarningsDate",
	PE_RATIO: "peRatio",
	BETA: "beta",
	MAX_CHANGE_PERCENT: "maxChangePercent",
	YEAR_5_CHANGE_PERCENT: "year5ChangePercent",
	YEAR_2_CHANGE_PERCENT: "year2ChangePercent",
	YEAR_1_CHANGE_PERCENT: "year1ChangePercent",
	YTD_CHANGE_PERCENT: "ytdChangePercent",
	MONTH_6_CHANGE_PERCENT: "month6ChangePercent",
	MONTH_3_CHANGE_PERCENT: "month3ChangePercent",
	MONTH_1_CHANGE_PERCENT: "month1ChangePercent",
	DAY_30_CHANGE_PERCENT: "day30ChangePercent",
	DAY_5_CHANGE_PERCENT: "day5ChangePercent"
};

export const getIexKeyStatsData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: ReadonlyArray<string> },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexKeyStatsKeys: ReadonlyArray<string> = groupedKeys[Prefixes.IEX_KEY_STATS];

	if (!iexKeyStatsKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const keyStats: KeyStats = await IexAPI.getKeyStats(ticker);

	return iexKeyStatsKeys.reduce(
		(acc, key) => {
			const keyStatsProp: keyof KeyStats | null = IexKeyStatsSuffixToPropMap[key] || null;

			return {
				...acc,
				...(keyStatsProp && {
					[`${Prefixes.IEX_KEY_STATS}__${key}`]: keyStats[keyStatsProp]
				})
			};
		},
		{} as { [key in keyof typeof DataKeys]?: any }
	);
};
