import { IexCompanyDataKeys } from "./iex-company.data-key";
import { IexKeyStatsDataKeys } from "./iex-key-stats.data-key";
import { IexPreviousDayPriceDataKeys } from "./iex-previous-day-price.data-key";
import { IexQuoteDataKeys } from "./iex-quote.data-key";

export * from "./iex-company.data-key";
export * from "./iex-key-stats.data-key";
export * from "./iex-previous-day-price.data-key";
export * from "./iex-quote.data-key";

export const Prefixes = {
	IEX_COMPANY: "IEX_COMPANY",
	IEX_KEY_STATS: "IEX_KEY_STATS",
	IEX_PREVIOUS_DAY_PRICE: "IEX_PREVIOUS_DAY_PRICE",
	IEX_QUOTE: "IEX_QUOTE"
};

export const PREFIX_PROP_DELIMITER = "__";

export const DataKeys = {
	...IexCompanyDataKeys,
	...IexKeyStatsDataKeys,
	...IexPreviousDayPriceDataKeys,
	...IexQuoteDataKeys
};
