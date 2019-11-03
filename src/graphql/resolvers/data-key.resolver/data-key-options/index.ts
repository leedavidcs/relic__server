import { IServerContext } from "@/graphql";
import { DataKeyOption, QueryDataKeyOptionsArgs } from "@/types";
import { IFieldResolver } from "graphql-tools";
import { IexCompanyDataKeyOptions } from "./iex-company.data-key-option";
import { IexKeyStatsDataKeyOptions } from "./iex-key-stats-data-key-option";
import { IexPreviousDayPriceDataKeyOptions } from "./iex-previous-day-price.data-key";
import { IexQuoteDataKeyOptions } from "./iex-quote.data-key-option";

export const dataKeyOptions: IFieldResolver<any, IServerContext, QueryDataKeyOptionsArgs> = (
	parent,
	{ name, dataKey, provider }
) => {
	const noCaseName: string | null | undefined = name && name.toLocaleLowerCase();
	const noCaseDataKey: string | null | undefined = dataKey && dataKey.toLocaleLowerCase();
	const noCaseProvider: string | null | undefined = provider && provider.toLocaleLowerCase();

	const options: DataKeyOption[] = [
		...IexCompanyDataKeyOptions,
		...IexKeyStatsDataKeyOptions,
		...IexPreviousDayPriceDataKeyOptions,
		...IexQuoteDataKeyOptions
	];

	const withFilters = options
		.map((option) => ({
			...option,
			name: option.name.toLocaleLowerCase(),
			dataKey: option.dataKey.toLocaleLowerCase(),
			provider: option.provider.toLocaleLowerCase()
		}))
		.filter((option) => {
			const partialMatchName = noCaseName ? option.name.includes(noCaseName) : true;
			const partialMatchDataKey = noCaseDataKey
				? option.dataKey.includes(noCaseDataKey)
				: true;
			const partialMatchProvider = noCaseProvider
				? option.provider.includes(noCaseProvider)
				: true;

			return partialMatchName || partialMatchDataKey || partialMatchProvider;
		});

	return withFilters;
};
