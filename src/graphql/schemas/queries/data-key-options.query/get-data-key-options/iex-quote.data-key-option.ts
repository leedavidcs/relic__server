import { IexQuoteDataKeys, IexQuoteSuffixToPropMap, PREFIX_PROP_DELIMITER } from "@/data-keys";

export const IexQuoteDataKeyOptions = Object.keys(IexQuoteDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexQuoteSuffixToPropMap[suffix];

	return acc.concat({
		name: `iex.quote.${prop}`,
		dataKey,
		description: `Property (${prop}) in Quote. (see: https://iexcloud.io/docs/api/#quote)`,
		provider: "IEX Cloud"
	});
}, [] as any[]);
