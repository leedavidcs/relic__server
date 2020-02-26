import { IServerContext } from "@/graphql";
import { DataKeys, IexQuoteSuffixToPropMap, Prefixes, PREFIX_PROP_DELIMITER } from "@/data-keys";
import { Quote } from "iexcloud_api_wrapper";

export const getIexQuoteData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: readonly string[] },
	{ dataSources: { IexAPI } }: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexQuoteKeys: readonly string[] = groupedKeys[Prefixes.IEX_QUOTE];

	if (!iexQuoteKeys) {
		return {};
	}

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
