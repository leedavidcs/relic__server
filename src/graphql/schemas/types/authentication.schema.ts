import { inputObjectType, mutationField, objectType, arg } from "nexus";
import { EmailAddress, UserPassword } from "./scalars.schema";
import { User } from "./user.schema";

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
export const RefreshAccessTokenInput = inputObjectType({
	name: "RefreshAccessTokenInput",
	definition: (t) => {
		t.string("refreshToken", {
			required: true,
			description: "The refresh token, that is used to refresh the access token"
		});
	}
});

export const RegisterLocalUserInput = inputObjectType({
	name: "RegisterLocalUserInput",
	definition: (t) => {
		t.field("email", {
			type: EmailAddress,
			required: true,
			description: "(Unique) The user's email"
		});
		t.field("password", {
			type: UserPassword,
			required: true,
			description: "The user's decrypted password"
		});
		t.string("username", {
			required: true,
			description: "(Unique) The user's username"
		});
	}
});

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

export const RegisterLocalUserPayload = objectType({
	name: "RegisterLocalUserPayload",
	description: "The response object from a local register user request",
	definition: (t) => {
		t.boolean("success", {
			nullable: false,
			description: "Whether the registration successfully created a user or not"
		});
		t.string("error", {
			description: "An error will be described if success is false"
		});
		t.field("user", {
			type: User,
			description: "The user object"
		});
	}
});

export const ResendVerifyEmailPayload = objectType({
	name: "ResendVerifyEmailPayload",
	description: "The response object from a resend verify email request",
	definition: (t) => {
		t.boolean("success", {
			nullable: false,
			description: "Status, on whether the email was successfully resent"
		});
	}
});

export const loginLocalUser = mutationField("loginLocalUser", {
	type: TokenPayload,
	description: "Logins in the user, and returns an expiring access token",
	args: {
		input: arg({
			type: LoginLocalUserInput,
			required: true
		})
	}
});

export const refreshAccessToken = mutationField("refreshAccessToken", {
	type: TokenPayload,
	description: "Refreshes the currently logged-in user's access token",
	args: {
		input: arg({
			type: RefreshAccessTokenInput,
			required: true
		})
	}
});

export const registerLocalUser = mutationField("registerLocalUser", {
	type: RegisterLocalUserPayload,
	description: "Performs local auth registration (custom username + password)",
	args: {
		input: arg({
			type: RegisterLocalUserInput,
			required: true
		})
	}
});

export const resendVerifyEmail = mutationField("resendVerifyEmail", {
	type: ResendVerifyEmailPayload,
	description: "Resends the account verification email to the logged-in user"
});
