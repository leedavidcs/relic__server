import { objectType } from "nexus";

export const TokenPayload = objectType({
	name: "TokenPayload",
	description: "The response from a successful login or token refresh request",
	definition: (t) => {
		t.string("token", {
			description: "JSON web token to authenticate API requests",
			nullable: false
		});
		t.string("refreshToken", {
			description: "JSON web token to refresh the token",
			nullable: false
		});
	}
});
