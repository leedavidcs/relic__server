import { IexPreviousDayPriceSuffixToPropMap } from "@/graphql/resolvers/stock-portfolio.resolver";
import { IexPreviousDayPriceDataKeys, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKey_Provider, DataKeyOption } from "@/types";

export const IexPreviousDayPriceDataKeyOptions = Object.keys(IexPreviousDayPriceDataKeys).reduce(
	(acc, dataKey) => {
		const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
		const prop: string = IexPreviousDayPriceSuffixToPropMap[suffix];

		return acc.concat({
			name: `iex.previousDayPrice.${prop}`,
			dataKey: dataKey as DataKey,
			description:
				`Property (${prop}) in Previous Day Price. (see: ` +
				"https://iexcloud.io/docs/api/#previous-day-price)",
			provider: "IEX Cloud" as DataKey_Provider
		});
	},
	[] as DataKeyOption[]
);
