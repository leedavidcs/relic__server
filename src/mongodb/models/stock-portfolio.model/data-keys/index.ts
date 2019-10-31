import { IexCompanyDataKeys } from "./iex-company.data-key";
import { IexKeyStatsDataKeys } from "./iex-key-stats.data-key";

export const Prefixes = {
	IEX_COMPANY: "IEX_COMPANY",
	IEX_KEY_STATS: "IEX_KEY_STATS"
};

export const PREFIX_PROP_DELIMITER: string = "__";

export const DataKeys = {
	...IexCompanyDataKeys,
	...IexKeyStatsDataKeys
};
