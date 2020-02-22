import { IexKeyStatsSuffixToPropMap } from "@/graphql/schemas/types/stock-portfolio.schema/get-stock-portfolio-data";
import { IexKeyStatsDataKeys, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKeyOption, DataKey_Provider } from "@/types";

export const IexKeyStatsDataKeyOptions = Object.keys(IexKeyStatsDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexKeyStatsSuffixToPropMap[suffix];

	/* eslint-disable max-len */
	return acc.concat({
		name: `iex.keyStats.${prop}`,
		dataKey: dataKey as DataKey,
		description: `Property (${prop}) in Key Stats. (see: https://iexcloud.io/docs/api/#key-stats)`,
		provider: "IEX Cloud" as DataKey_Provider
	});
	/* eslint-enable max-len */
}, [] as DataKeyOption[]);
