import { IServerContext } from "@/graphql";
import { DataKeys, PREFIX_PROP_DELIMITER, Prefixes } from "@/mongodb";
import { Company } from "iexcloud_api_wrapper";

const IexCompanySuffixToPropMap: { [key: string]: keyof Company } = {
	SYMBOL: "symbol",
	COMPANY_NAME: "companyName",
	CEO: "CEO",
	EXCHANGE: "exchange",
	INDUSTRY: "industry",
	WEBSITE: "website",
	DESCRIPTION: "description",
	ISSUE_TYPE: "issueType",
	SECTOR: "sector",
	SECURITY_NAME: "securityName",
	TAGS: "tags",
	EMPLOYEES: "employees"
};

export const getIexCompanyData = async (
	ticker: string,
	groupedKeys: { [key in keyof typeof Prefixes]: ReadonlyArray<string> },
	context: IServerContext
): Promise<{ [key in keyof typeof DataKeys]?: any }> => {
	const iexCompanyKeys: ReadonlyArray<string> = groupedKeys[Prefixes.IEX_COMPANY];

	if (!iexCompanyKeys) {
		return {};
	}

	const {
		dataSources: { IexAPI }
	} = context;

	const company: Company = await IexAPI.getCompany(ticker);

	return iexCompanyKeys.reduce(
		(acc, key) => {
			const companyProp: keyof Company | null = IexCompanySuffixToPropMap[key] || null;

			return {
				...acc,
				...(companyProp && {
					[`${Prefixes.IEX_COMPANY}${PREFIX_PROP_DELIMITER}${key}`]: company[companyProp]
				})
			};
		},
		{} as { [key in keyof typeof DataKeys]?: any }
	);
};
