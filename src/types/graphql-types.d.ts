export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	Cursor: any;
	/** JSON data. Gets returned all at once (cannot specify properties, traditionally like GraphQL) */
	JSON: any;
	/** Date data. Gets returned as a unix-time Int */
	Date: any;
	/** Location data in Longitude + Latitude. Gets returned as a Float 2-tuple */
	Location: any;
};

/** Search items based on a connection property */
export type ConnectionInput = {
	/** An array of IDs. Returns items such that this property contains some of specified IDs */
	someOf?: Maybe<Array<Scalars["ID"]>>;
	/** An array of IDs. Returns items such that this property contains all of specified IDs */
	allOf?: Maybe<Array<Scalars["ID"]>>;
	/** Returns items such that this property has this number of values */
	size?: Maybe<Scalars["Int"]>;
	/** Returns items based on whether or not this property is empty */
	empty?: Maybe<Scalars["Boolean"]>;
};

/** The dataKey property of a stock portfolio header, that determines what data is pulled */
export enum DataKey {
	IexCompanySymbol = "IEX_COMPANY__SYMBOL",
	IexCompanyCompanyName = "IEX_COMPANY__COMPANY_NAME",
	IexCompanyCeo = "IEX_COMPANY__CEO",
	IexCompanyExchange = "IEX_COMPANY__EXCHANGE",
	IexCompanyIndustry = "IEX_COMPANY__INDUSTRY",
	IexCompanyWebsite = "IEX_COMPANY__WEBSITE",
	IexCompanyDescription = "IEX_COMPANY__DESCRIPTION",
	IexCompanyIssueType = "IEX_COMPANY__ISSUE_TYPE",
	IexCompanySector = "IEX_COMPANY__SECTOR",
	IexCompanySecurityName = "IEX_COMPANY__SECURITY_NAME",
	IexCompanyTags = "IEX_COMPANY__TAGS",
	IexCompanyEmployees = "IEX_COMPANY__EMPLOYEES",
	IexKeyStatsCompanyName = "IEX_KEY_STATS__COMPANY_NAME",
	IexKeyStatsMarketCap = "IEX_KEY_STATS__MARKET_CAP",
	IexKeyStatsWeek_52High = "IEX_KEY_STATS__WEEK_52_HIGH",
	IexKeyStatsWeek_52Low = "IEX_KEY_STATS__WEEK_52_LOW",
	IexKeyStatsWeek_52Change = "IEX_KEY_STATS__WEEK_52_CHANGE",
	IexKeyStatsSharesOutstanding = "IEX_KEY_STATS__SHARES_OUTSTANDING",
	IexKeyStatsFloat = "IEX_KEY_STATS__FLOAT",
	IexKeyStatsSymbol = "IEX_KEY_STATS__SYMBOL",
	IexKeyStatsAvg_10Volume = "IEX_KEY_STATS__AVG_10_VOLUME",
	IexKeyStatsAvg_30Volume = "IEX_KEY_STATS__AVG_30_VOLUME",
	IexKeyStatsDay_200Movingavg = "IEX_KEY_STATS__DAY_200_MOVINGAVG",
	IexKeyStatsDay_50Movingavg = "IEX_KEY_STATS__DAY_50_MOVINGAVG",
	IexKeyStatsEmployees = "IEX_KEY_STATS__EMPLOYEES",
	IexKeyStatsTtmEps = "IEX_KEY_STATS__TTM_EPS",
	IexKeyStatsTtmDividendRate = "IEX_KEY_STATS__TTM_DIVIDEND_RATE",
	IexKeyStatsDividendYield = "IEX_KEY_STATS__DIVIDEND_YIELD",
	IexKeyStatsNextDividendDate = "IEX_KEY_STATS__NEXT_DIVIDEND_DATE",
	IexKeyStatsExDividendDate = "IEX_KEY_STATS__EX_DIVIDEND_DATE",
	IexKeyStatsNextEarningsDate = "IEX_KEY_STATS__NEXT_EARNINGS_DATE",
	IexKeyStatsPeRatio = "IEX_KEY_STATS__PE_RATIO",
	IexKeyStatsBeta = "IEX_KEY_STATS__BETA",
	IexKeyStatsMaxChangePercent = "IEX_KEY_STATS__MAX_CHANGE_PERCENT",
	IexKeyStatsYear_5ChangePercent = "IEX_KEY_STATS__YEAR_5_CHANGE_PERCENT",
	IexKeyStatsYear_2ChangePercent = "IEX_KEY_STATS__YEAR_2_CHANGE_PERCENT",
	IexKeyStatsYear_1ChangePercent = "IEX_KEY_STATS__YEAR_1_CHANGE_PERCENT",
	IexKeyStatsYtdChangePercent = "IEX_KEY_STATS__YTD_CHANGE_PERCENT",
	IexKeyStatsMonth_6ChangePercent = "IEX_KEY_STATS__MONTH_6_CHANGE_PERCENT",
	IexKeyStatsMonth_3ChangePercent = "IEX_KEY_STATS__MONTH_3_CHANGE_PERCENT",
	IexKeyStatsMonth_1ChangePercent = "IEX_KEY_STATS__MONTH_1_CHANGE_PERCENT",
	IexKeyStatsDay_30ChangePercent = "IEX_KEY_STATS__DAY_30_CHANGE_PERCENT",
	IexKeyStatsDay_5ChangePercent = "IEX_KEY_STATS__DAY_5_CHANGE_PERCENT",
	IexPreviousDayPriceSymbol = "IEX_PREVIOUS_DAY_PRICE__SYMBOL",
	IexPreviousDayPriceDate = "IEX_PREVIOUS_DAY_PRICE__DATE",
	IexPreviousDayPriceOpen = "IEX_PREVIOUS_DAY_PRICE__OPEN",
	IexPreviousDayPriceHigh = "IEX_PREVIOUS_DAY_PRICE__HIGH",
	IexPreviousDayPriceLow = "IEX_PREVIOUS_DAY_PRICE__LOW",
	IexPreviousDayPriceClose = "IEX_PREVIOUS_DAY_PRICE__CLOSE",
	IexPreviousDayPriceVolume = "IEX_PREVIOUS_DAY_PRICE__VOLUME",
	IexPreviousDayPriceUnadjustedVolume = "IEX_PREVIOUS_DAY_PRICE__UNADJUSTED_VOLUME",
	IexPreviousDayPriceChange = "IEX_PREVIOUS_DAY_PRICE__CHANGE",
	IexPreviousDayPriceChangePercent = "IEX_PREVIOUS_DAY_PRICE__CHANGE_PERCENT",
	IexQuoteSymbol = "IEX_QUOTE__SYMBOL",
	IexQuoteCompanyName = "IEX_QUOTE__COMPANY_NAME",
	IexQuoteCalculationPrice = "IEX_QUOTE__CALCULATION_PRICE",
	IexQuoteOpen = "IEX_QUOTE__OPEN",
	IexQuoteOpenTime = "IEX_QUOTE__OPEN_TIME",
	IexQuoteClose = "IEX_QUOTE__CLOSE",
	IexQuoteCloseTime = "IEX_QUOTE__CLOSE_TIME",
	IexQuoteHigh = "IEX_QUOTE__HIGH",
	IexQuoteLow = "IEX_QUOTE__LOW",
	IexQuoteLatestPrice = "IEX_QUOTE__LATEST_PRICE",
	IexQuoteLatestSource = "IEX_QUOTE__LATEST_SOURCE",
	IexQuoteLatestTime = "IEX_QUOTE__LATEST_TIME",
	IexQuoteLatestUpdate = "IEX_QUOTE__LATEST_UPDATE",
	IexQuoteLatestVolume = "IEX_QUOTE__LATEST_VOLUME",
	IexQuoteIexRealTimePrice = "IEX_QUOTE__IEX_REAL_TIME_PRICE",
	IexQuoteIexRealTimeSize = "IEX_QUOTE__IEX_REAL_TIME_SIZE",
	IexQuoteIexLastUpdated = "IEX_QUOTE__IEX_LAST_UPDATED",
	IexQuoteDelayedPrice = "IEX_QUOTE__DELAYED_PRICE",
	IexQuoteDelayedPriceTime = "IEX_QUOTE__DELAYED_PRICE_TIME",
	IexQuoteExtendedPrice = "IEX_QUOTE__EXTENDED_PRICE",
	IexQuoteExtendedChange = "IEX_QUOTE__EXTENDED_CHANGE",
	IexQuoteExtendedChangePercent = "IEX_QUOTE__EXTENDED_CHANGE_PERCENT",
	IexQuoteExtendedPriceTime = "IEX_QUOTE__EXTENDED_PRICE_TIME",
	IexQuotePreviousClose = "IEX_QUOTE__PREVIOUS_CLOSE",
	IexQuoteChange = "IEX_QUOTE__CHANGE",
	IexQuoteChangePercent = "IEX_QUOTE__CHANGE_PERCENT",
	IexQuoteIexMarketPercent = "IEX_QUOTE__IEX_MARKET_PERCENT",
	IexQuoteIexVolume = "IEX_QUOTE__IEX_VOLUME",
	IexQuoteAvgTotalVolume = "IEX_QUOTE__AVG_TOTAL_VOLUME",
	IexQuoteIexBidPrice = "IEX_QUOTE__IEX_BID_PRICE",
	IexQuoteIexBidSize = "IEX_QUOTE__IEX_BID_SIZE",
	IexQuoteIexAskPrice = "IEX_QUOTE__IEX_ASK_PRICE",
	IexQuoteIexAskSize = "IEX_QUOTE__IEX_ASK_SIZE",
	IexQuoteMarketCap = "IEX_QUOTE__MARKET_CAP",
	IexQuoteWeek_52High = "IEX_QUOTE__WEEK_52_HIGH",
	IexQuoteWeek_52Low = "IEX_QUOTE__WEEK_52_LOW",
	IexQuoteYtdChange = "IEX_QUOTE__YTD_CHANGE"
}

/** The provider for the data provided by the data key */
export enum DataKey_Provider {
	/** IEX Cloud (see `https://iexcloud.io/`) */
	IexCloud = "IEX_CLOUD"
}

/** A single data key option that can be selected for a stock portfolio header */
export type DataKeyOption = {
	__typename?: "DataKeyOption";
	/** A more normal name. This can be shown to users. */
	name: Scalars["String"];
	/** A unique data key for fetching stock portfolio data */
	dataKey: DataKey;
	/** A description of the data that is fetched with this data key */
	description: Scalars["String"];
	/** The name of the provider */
	provider: DataKey_Provider;
};

/** Search items based on date-time property */
export type DateTimeInput = {
	/** Milliseconds of the second (can be from 0-999) */
	milliseconds?: Maybe<Scalars["Int"]>;
	/** Seconds of the minute (can be 0-59) */
	seconds?: Maybe<Scalars["Int"]>;
	/** Minutes of the hour (can be 0-59) */
	minutes?: Maybe<Scalars["Int"]>;
	/** Hours of the day (can be 0-23) */
	hours?: Maybe<Scalars["Int"]>;
	/** Date: DD in (MM/DD/YYYY), indexed from 1 */
	day?: Maybe<Scalars["Int"]>;
	/** Date: MM in (MM/DD/YYYY), indexed from 1 */
	month?: Maybe<Scalars["Int"]>;
	/** Date: YYYY in (MM/DD/YYYY), indexed from 1 */
	year: Scalars["Int"];
};

/** Root mutation type */
export type Mutation = {
	__typename?: "Mutation";
	/** The viewer of this request */
	viewer?: Maybe<Viewer>;
	/** Logins in the user, and returns an expiring access token */
	loginLocalUser?: Maybe<TokenResponse>;
	/** Refreshes the currently logged-in user's access token */
	refreshAccessToken?: Maybe<TokenResponse>;
	/** Performs local authentication (custom username + password) */
	registerLocalUser?: Maybe<RegisterLocalUserResponse>;
	/** Creates an empty stock portfolio */
	createStockPortfolio?: Maybe<StockPortfolio>;
	/** Updates a stock portfolio */
	updateStockPortfolio?: Maybe<StockPortfolio>;
	/** Deletes a stock portfolio */
	deleteStockPortfolio?: Maybe<StockPortfolio>;
};

/** Root mutation type */
export type MutationLoginLocalUserArgs = {
	userIdentifier: Scalars["String"];
	password: Scalars["String"];
};

/** Root mutation type */
export type MutationRefreshAccessTokenArgs = {
	refreshToken: Scalars["String"];
};

/** Root mutation type */
export type MutationRegisterLocalUserArgs = {
	email: Scalars["String"];
	password: Scalars["String"];
	username: Scalars["String"];
};

/** Root mutation type */
export type MutationUpdateStockPortfolioArgs = {
	id?: Maybe<Scalars["ID"]>;
	headers?: Maybe<Array<StockPortfolioHeaderInput>>;
	tickers?: Maybe<Array<Scalars["String"]>>;
};

/** Root mutation type */
export type MutationDeleteStockPortfolioArgs = {
	id?: Maybe<Scalars["ID"]>;
};

/** Pagination info, to show if other pages exist */
export type PageInfo = {
	__typename?: "PageInfo";
	/** Pagination info, whether there is more data going forward */
	hasNextPage: Scalars["Boolean"];
	/** Pagination info, whether there is more data going backward */
	hasPreviousPage: Scalars["Boolean"];
	/** Total count of results across all pages */
	count: Scalars["Int"];
	/** The cursor for the first item in this page */
	startCursor?: Maybe<Scalars["Cursor"]>;
	/** The cursor for the last item in this page */
	endCursor?: Maybe<Scalars["Cursor"]>;
};

/** Root query type */
export type Query = {
	__typename?: "Query";
	/** The viewer of this request */
	viewer?: Maybe<Viewer>;
	/** Retrieves the list of data key options for a stock portfolio header. All filters are OR'ed. */
	dataKeyOptions: Array<DataKeyOption>;
	/** Gets a paginated list of stock portfolios based on filters */
	stockPortfolios?: Maybe<StockPortfolioConnection>;
};

/** Root query type */
export type QueryDataKeyOptionsArgs = {
	name?: Maybe<Scalars["String"]>;
	dataKey?: Maybe<DataKey>;
	provider?: Maybe<DataKey_Provider>;
};

/** Root query type */
export type QueryStockPortfoliosArgs = {
	first?: Maybe<Scalars["Int"]>;
	last?: Maybe<Scalars["Int"]>;
	before?: Maybe<Scalars["Cursor"]>;
	after?: Maybe<Scalars["Cursor"]>;
};

/** The response object from a local register user request */
export type RegisterLocalUserResponse = {
	__typename?: "RegisterLocalUserResponse";
	/** Whether the registration successfully created a user or not */
	success: Scalars["Boolean"];
	/** An error will be described if success is false */
	error?: Maybe<Scalars["String"]>;
	/** The user object */
	user?: Maybe<User>;
};

/** StockPortfolio entity. This is what gets shown on the data grid */
export type StockPortfolio = {
	__typename?: "StockPortfolio";
	/** The ID of the stock portfolio */
	id?: Maybe<Scalars["ID"]>;
	/** The user that this stock portfolio belongs to. Also the creator */
	user: User;
	/** The headers (configs) for this data grid, including how data is resolved */
	headers: Array<StockPortfolioHeader>;
	/** The tickers that are the rows for this data grid */
	tickers: Array<Scalars["String"]>;
	/** The data that gets resolved based on headers and tickers */
	data: Scalars["JSON"];
};

/** The stock portfolio connection, from which pagination and resource info can be gotten */
export type StockPortfolioConnection = {
	__typename?: "StockPortfolioConnection";
	/** Holds cursor and resource information */
	edges: Array<StockPortfolioEdge>;
	/** Convenience property to avoid nesting */
	nodes: Array<StockPortfolio>;
	/** Pagination info, on whether there is more data */
	pageInfo: PageInfo;
};

/** Connection edges, which hold cursor and resource information */
export type StockPortfolioEdge = {
	__typename?: "StockPortfolioEdge";
	/** Cursor for pagination */
	cursor: Scalars["Cursor"];
	/** The actual stock portfolio data */
	node: StockPortfolio;
};

/** A column configuration for the stock portfolio on the data grid */
export type StockPortfolioHeader = {
	__typename?: "StockPortfolioHeader";
	/** The name displayed for this column header */
	name: Scalars["String"];
	/** The dataKey, which determines how values in this column are resolved */
	dataKey?: Maybe<DataKey>;
	/** The configured width of this column */
	width: Scalars["Int"];
	/** Whether this column should be resizable */
	resizable: Scalars["Boolean"];
};

export type StockPortfolioHeaderInput = {
	name: Scalars["String"];
	dataKey: Scalars["String"];
	width: Scalars["Int"];
	tickers: Array<Scalars["String"]>;
};

/** The response from a successful login or token refresh request */
export type TokenResponse = {
	__typename?: "TokenResponse";
	/** JSON web token to authenticate API requests */
	token: Scalars["String"];
	/** JSON web token to refresh the token */
	refreshToken: Scalars["String"];
};

/** Basic user of the application */
export type User = {
	__typename?: "User";
	/** The id of the user */
	id?: Maybe<Scalars["String"]>;
	/** The user's email */
	email?: Maybe<Scalars["String"]>;
	/** Whether the user verified their email address */
	emailVerified?: Maybe<Scalars["String"]>;
	/** The user's encoded password */
	password?: Maybe<Scalars["String"]>;
	/** The user's username */
	username?: Maybe<Scalars["String"]>;
};

/** Search items based on a range, or fuzzy date */
export type VariableDateTimeInput = {
	/** Returns items such that this property comes before the specified date-time */
	before?: Maybe<DateTimeInput>;
	/** Returns items such that this property comes after the specified date-time */
	after?: Maybe<DateTimeInput>;
	/** Returns items such that this property's date-time contains exactly the fields as specifed */
	equal?: Maybe<DateTimeInput>;
};

/** The viewer of this request */
export type Viewer = {
	__typename?: "Viewer";
	/** The viewer's id */
	id: Scalars["ID"];
	/** The viewer's email */
	email: Scalars["String"];
	/** The viewer's username */
	username: Scalars["String"];
};
