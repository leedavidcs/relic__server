import { allow, not, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })((parent, args, { user }) => {
	const doesUserExist = Boolean(user);

	return doesUserExist;
});

export const permissions = shield({
	Mutation: {
		loginLocalUser: not(isAuthenticated),
		registerLocalUser: not(isAuthenticated),
		refreshAccessToken: isAuthenticated,
		resendVerifyEmail: isAuthenticated,
		createStockPortfolio: isAuthenticated,
		deleteStockPortfolio: isAuthenticated,
		updateStockPortfolio: isAuthenticated
	},
	StockPortfolio: allow,
	User: allow
});
