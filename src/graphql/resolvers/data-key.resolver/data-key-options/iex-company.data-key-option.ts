import { IexCompanySuffixToPropMap } from "@/graphql/resolvers/stock-portfolio.resolver";
import { IexCompanyDataKeys, PREFIX_PROP_DELIMITER } from "@/mongodb";
import { DataKey, DataKey_Provider, DataKeyOption } from "@/types";

export const IexCompanyDataKeyOptions = Object.keys(IexCompanyDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexCompanySuffixToPropMap[suffix];

	return acc.concat({
		name: `iex.company.${prop}`,
		dataKey: dataKey as DataKey,
		description: `Property (${prop}) in Company. (see: https://iexcloud.io/docs/api/#company)`,
		provider: "IEX Cloud" as DataKey_Provider
	});
}, [] as DataKeyOption[]);
