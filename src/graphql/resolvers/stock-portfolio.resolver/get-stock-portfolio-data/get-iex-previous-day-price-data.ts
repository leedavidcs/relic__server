import { IServerContext } from "@/graphql";
import { DataKeys, Prefixes } from "@/mongodb";
import { PreviousDay } from "iexcloud_api_wrapper";

const IexPreviousDayPriceToPropMap: { [key: string]: keyof PreviousDay } = {
	SYMBOL: "symbol",
	DATE: "date",
	OPEN: "open",
	HIGH: "high",
	LOW: "low",
	CLOSE: "close",
	VOLUME: "volume",
	UNADJUSTED_VOLUME: "unadjustedVolume",
	CHANGE: "change",
	CHANGE_PERCENT: "changePercent"
};

export const getIexPreviousDayPriceData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: ReadonlyArray<string> },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexPreviousDayPriceKeys: ReadonlyArray<string> =
		groupedKeys[Prefixes.IEX_PREVIOUS_DAY_PRICE];

	if (!iexPreviousDayPriceKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const previousDayPrice: PreviousDay = await IexAPI.getPreviousDayPrice(ticker);

	return iexPreviousDayPriceKeys.reduce(
		(acc, key) => {
			const previousDayPriceProp: keyof PreviousDay | null =
				IexPreviousDayPriceToPropMap[key] || null;

			return {
				...acc,
				...(previousDayPriceProp && {
					[`${Prefixes.IEX_PREVIOUS_DAY_PRICE}__${key}`]: previousDayPrice[
						previousDayPriceProp
					]
				})
			};
		},
		{} as { [key in keyof typeof DataKeys]?: any }
	);
};
