import { IexQuoteDataKeys, IexQuoteSuffixToPropMap, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKeyOption, DataKey_Provider } from "@/types";

export const IexQuoteDataKeyOptions = Object.keys(IexQuoteDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexQuoteSuffixToPropMap[suffix];

	return acc.concat({
		name: `iex.quote.${prop}`,
		dataKey: dataKey as DataKey,
		description: `Property (${prop}) in Quote. (see: https://iexcloud.io/docs/api/#quote)`,
		provider: "IEX Cloud" as DataKey_Provider
	});
}, [] as DataKeyOption[]);
