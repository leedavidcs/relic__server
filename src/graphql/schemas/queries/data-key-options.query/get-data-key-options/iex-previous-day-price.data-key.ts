import {
	IexPreviousDayPriceDataKeys,
	IexPreviousDayPriceSuffixToPropMap,
	PREFIX_PROP_DELIMITER
} from "@/mongodb";
import { DataKey, DataKeyOption, DataKey_Provider } from "@/types";

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
