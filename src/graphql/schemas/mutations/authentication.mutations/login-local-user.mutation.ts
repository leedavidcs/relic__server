import { authenticateLocal } from "@/authentication";
import { OperationUnavailableError } from "@/utils";
import { arg, inputObjectType, mutationField } from "nexus";

export const LoginLocalUserInput = inputObjectType({
	name: "LoginLocalUserInput",
	definition: (t) => {
		t.string("userIdentifier", {
			required: true,
			description: "The email or username (either) of the user"
		});
		t.string("password", {
			required: true,
			description: "The user's decrypted password"
		});
	}
});

export const loginLocalUser = mutationField("loginLocalUser", {
	type: "TokenPayload",
	description: "Logins in the user, and returns an expiring access token",
	args: {
		input: arg({
			type: "LoginLocalUserInput",
			required: true
		})
	},
	resolve: async (parent, { input: { password, userIdentifier } }, { koaCtx }) => {
		if (koaCtx === null) {
			throw new OperationUnavailableError();
		}

		koaCtx.request.body = { password, userIdentifier };

		const tokens = await authenticateLocal(koaCtx);

		return tokens;
	}
});
