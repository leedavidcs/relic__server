import { AuthorizationError } from "@/utils";
import { not, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(async (parent, args, { user }) => {
	const doesUserExist: boolean = Boolean(user);

	return doesUserExist || new AuthorizationError("This request must be authenticated.");
});

export const permissions = shield({
	Mutation: {
		loginLocalUser: not(isAuthenticated),
		refreshAccessToken: isAuthenticated,
		createStockPortfolio: isAuthenticated
	}
});
