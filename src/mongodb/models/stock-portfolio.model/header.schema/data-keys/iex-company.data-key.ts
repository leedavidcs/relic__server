import { Company } from "iexcloud_api_wrapper";

export const IexCompanyDataKeys = {
	IEX_COMPANY__SYMBOL: "IEX_COMPANY__SYMBOL",
	IEX_COMPANY__COMPANY_NAME: "IEX_COMPANY__COMPANY_NAME",
	IEX_COMPANY__CEO: "IEX_COMPANY__CEO",
	IEX_COMPANY__EXCHANGE: "IEX_COMPANY__EXCHANGE",
	IEX_COMPANY__INDUSTRY: "IEX_COMPANY__INDUSTRY",
	IEX_COMPANY__WEBSITE: "IEX_COMPANY__WEBSITE",
	IEX_COMPANY__DESCRIPTION: "IEX_COMPANY__DESCRIPTION",
	IEX_COMPANY__ISSUE_TYPE: "IEX_COMPANY__ISSUE_TYPE",
	IEX_COMPANY__SECTOR: "IEX_COMPANY__SECTOR",
	IEX_COMPANY__SECURITY_NAME: "IEX_COMPANY__SECURITY_NAME",
	IEX_COMPANY__TAGS: "IEX_COMPANY__TAGS",
	IEX_COMPANY__EMPLOYEES: "IEX_COMPANY__EMPLOYEES"
};

export const IexCompanySuffixToPropMap: { [key: string]: keyof Company } = {
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
