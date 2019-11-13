import { IexKeyStatsSuffixToPropMap } from "@/graphql/resolvers/stock-portfolio.resolver";
import { IexKeyStatsDataKeys, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKey_Provider, DataKeyOption } from "@/types";

export const IexKeyStatsDataKeyOptions = Object.keys(IexKeyStatsDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexKeyStatsSuffixToPropMap[suffix];

	return acc.concat({
		name: `iex.keyStats.${prop}`,
		dataKey: dataKey as DataKey,
		description: `Property (${prop}) in Key Stats. (see: https://iexcloud.io/docs/api/#key-stats)`,
		provider: "IEX Cloud" as DataKey_Provider
	});
}, [] as DataKeyOption[]);
