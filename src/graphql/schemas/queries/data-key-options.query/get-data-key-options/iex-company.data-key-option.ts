import { IexCompanyDataKeys, IexCompanySuffixToPropMap, PREFIX_PROP_DELIMITER } from "@/data-keys";

export const IexCompanyDataKeyOptions = Object.keys(IexCompanyDataKeys).reduce((acc, dataKey) => {
	const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
	const prop: string = IexCompanySuffixToPropMap[suffix];

	return acc.concat({
		name: `iex.company.${prop}`,
		dataKey,
		description: `Property (${prop}) in Company. (see: https://iexcloud.io/docs/api/#company)`,
		provider: "IEX Cloud"
	});
}, [] as any[]);
