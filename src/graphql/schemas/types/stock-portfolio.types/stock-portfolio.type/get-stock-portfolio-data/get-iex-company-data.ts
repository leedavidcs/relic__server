import { IServerContext } from "@/graphql";
import { DataKeys, IexCompanySuffixToPropMap, Prefixes, PREFIX_PROP_DELIMITER } from "@/data-keys";
import { Company } from "iexcloud_api_wrapper";

export const getIexCompanyData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: readonly string[] },
	{ dataSources: { IexAPI } }: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexCompanyKeys: readonly string[] = groupedKeys[Prefixes.IEX_COMPANY];

	if (!iexCompanyKeys) {
		return {};
	}

	const company: Company = await IexAPI.getCompany(ticker);

	return iexCompanyKeys.reduce((acc, key) => {
		const companyProp: keyof Company | null = IexCompanySuffixToPropMap[key] || null;

		return {
			...acc,
			...(companyProp && {
				[`${Prefixes.IEX_COMPANY}${PREFIX_PROP_DELIMITER}${key}`]: company[companyProp]
			})
		};
	}, {} as { [key in keyof typeof DataKeys]?: any });
};
