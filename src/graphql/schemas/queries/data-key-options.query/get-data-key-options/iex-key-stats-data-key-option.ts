import {
	IexKeyStatsDataKeys,
	IexKeyStatsSuffixToPropMap,
	PREFIX_PROP_DELIMITER
} from "@/data-keys";

export const IexKeyStatsDataKeyOptions = Object.keys(IexKeyStatsDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexKeyStatsSuffixToPropMap[suffix];

	/* eslint-disable max-len */
	return acc.concat({
		name: `iex.keyStats.${prop}`,
		dataKey,
		description: `Property (${prop}) in Key Stats. (see: https://iexcloud.io/docs/api/#key-stats)`,
		provider: "IEX Cloud"
	});
	/* eslint-enable max-len */
}, [] as any[]);
