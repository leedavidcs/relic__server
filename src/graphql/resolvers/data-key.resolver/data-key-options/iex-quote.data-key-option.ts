import { IexQuoteSuffixToPropMap } from "@/graphql/resolvers/stock-portfolio.resolver";
import { IexQuoteDataKeys, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKey_Provider, DataKeyOption } from "@/types";

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
