import { IexCompanyDataKeyOptions } from "./iex-company.data-key-option";
import { IexKeyStatsDataKeyOptions } from "./iex-key-stats-data-key-option";
import { IexPreviousDayPriceDataKeyOptions } from "./iex-previous-day-price.data-key";
import { IexQuoteDataKeyOptions } from "./iex-quote.data-key-option";

const isNoCaseSubStr = (str: string, subStr: string): boolean => {
	return str.toLowerCase().includes(subStr.toLowerCase());
};

interface IGetDataKeyOptions {
	name?: Maybe<string>;
	dataKey?: Maybe<string>;
	provider?: Maybe<string>;
}

export const getDataKeyOptions = ({ name, dataKey, provider }: IGetDataKeyOptions) => {
	const options = [
		...IexCompanyDataKeyOptions,
		...IexKeyStatsDataKeyOptions,
		...IexPreviousDayPriceDataKeyOptions,
		...IexQuoteDataKeyOptions
	];

	const withFilters = options.filter((option) => {
		const isSubStrName = name ? isNoCaseSubStr(option.name, name) : true;
		const isSubStrDataKey = dataKey ? isNoCaseSubStr(option.dataKey, dataKey) : true;
		const isSubStrProvider = provider ? isNoCaseSubStr(option.provider, provider) : true;

		return isSubStrName || isSubStrDataKey || isSubStrProvider;
	});

	return withFilters;
};
