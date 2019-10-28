import { DataSource } from "apollo-datasource";
import { company, earningsToday, keyStats, previousDay, price, quote } from "iexcloud_api_wrapper";

export class IexAPI extends DataSource {
	public getCompany = company;
	public getEarningsToday = earningsToday;
	public getKeyStats = keyStats;
	public getPreviousDayPrice = previousDay;
	public getPrice = price;
	public getQuote = quote;

	constructor() {
		super();
	}
}
