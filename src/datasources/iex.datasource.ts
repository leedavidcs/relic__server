import { DataSource } from "apollo-datasource";
import { company, earningsToday, keyStats, previousDay, quote } from "iexcloud_api_wrapper";

export class IexAPI extends DataSource {
	public getCompany = company;
	public getEarningsToday = earningsToday;
	public getKeyStats = keyStats;
	public getPreviousDayPrice = previousDay;
	public getQuote = quote;
}
