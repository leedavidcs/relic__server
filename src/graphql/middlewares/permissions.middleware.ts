import { AuthorizationError } from "@/utils";
import { rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })((parent, args, { user }) => {
	const doesUserExist = Boolean(user);

	return doesUserExist || new AuthorizationError("This request must be authenticated.");
});

const isNotAuthenticated = rule({ cache: "contextual" })((parent, args, { user }) => {
	const doesUserExist = Boolean(user);

	return !doesUserExist;
});

export const permissions = shield({
	Mutation: {
		loginLocalUser: isNotAuthenticated,
		registerLocalUser: isNotAuthenticated,
		refreshAccessToken: isAuthenticated,
		resendVerifyEmail: isAuthenticated,
		createStockPortfolio: isAuthenticated,
		deleteStockPortfolio: isAuthenticated,
		updateStockPortfolio: isAuthenticated
	}
});
