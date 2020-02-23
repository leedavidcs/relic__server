import { IServerContext } from "@/graphql";
import {
	DataKeys,
	IexPreviousDayPriceSuffixToPropMap,
	Prefixes,
	PREFIX_PROP_DELIMITER
} from "@/mongodb";
import { PreviousDay } from "iexcloud_api_wrapper";

export const getIexPreviousDayPriceData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: readonly string[] },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexPreviousDayPriceKeys: readonly string[] = groupedKeys[Prefixes.IEX_PREVIOUS_DAY_PRICE];

	if (!iexPreviousDayPriceKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const previousDayPrice: PreviousDay = await IexAPI.getPreviousDayPrice(ticker);

	return iexPreviousDayPriceKeys.reduce((acc, key) => {
		const previousDayPriceProp: keyof PreviousDay | null =
			IexPreviousDayPriceSuffixToPropMap[key] || null;

		const previousDayData = previousDayPriceProp && {
			[`${Prefixes.IEX_PREVIOUS_DAY_PRICE}${PREFIX_PROP_DELIMITER}${key}`]: previousDayPrice[
				previousDayPriceProp
			]
		};

		return { ...acc, ...previousDayData };
	}, {} as { [key in keyof typeof DataKeys]?: any });
};
