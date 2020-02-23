import { IServerContext } from "@/graphql";
import { DataKeys, IexKeyStatsSuffixToPropMap, Prefixes, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { KeyStats } from "iexcloud_api_wrapper";

export const getIexKeyStatsData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: readonly string[] },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexKeyStatsKeys: readonly string[] = groupedKeys[Prefixes.IEX_KEY_STATS];

	if (!iexKeyStatsKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const keyStats: KeyStats = await IexAPI.getKeyStats(ticker);

	return iexKeyStatsKeys.reduce((acc, key) => {
		const keyStatsProp: keyof KeyStats | null = IexKeyStatsSuffixToPropMap[key] || null;

		return {
			...acc,
			...(keyStatsProp && {
				[`${Prefixes.IEX_KEY_STATS}${PREFIX_PROP_DELIMITER}${key}`]: keyStats[keyStatsProp]
			})
		};
	}, {} as { [key in keyof typeof DataKeys]?: any });
};
