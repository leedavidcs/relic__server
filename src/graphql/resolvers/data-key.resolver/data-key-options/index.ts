import { IServerContext } from "@/graphql";
import { DataKeyOption, QueryDataKeyOptionsArgs } from "@/types";
import { IFieldResolver } from "graphql-tools";
import { IexCompanyDataKeyOptions } from "./iex-company.data-key-option";
import { IexKeyStatsDataKeyOptions } from "./iex-key-stats-data-key-option";
import { IexPreviousDayPriceDataKeyOptions } from "./iex-previous-day-price.data-key";
import { IexQuoteDataKeyOptions } from "./iex-quote.data-key-option";

const isNoCaseSubStr = (str: string, subStr: string): boolean => {
	return str.toLowerCase().includes(subStr.toLowerCase());
};

export const dataKeyOptions: IFieldResolver<any, IServerContext, QueryDataKeyOptionsArgs> = (
	parent,
	{ name, dataKey, provider }
) => {
	const options: DataKeyOption[] = [
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
